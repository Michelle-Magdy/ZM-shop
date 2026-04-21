import catchAsync from "../util/catchAsync.js";
import { createOrderService } from "../services/order.service.js";
import { validateCartItems } from "../services/cart.service.js";
import Cart from "../models/cart.model.js";
import stripe from "../stripeConfig.js";

export const createCheckoutSession = catchAsync(async (req, res, next) => {
    const cart = req.cart;

    const subtotal = cart.items.reduce((sum, item) =>
        sum + item.variant.price * item.quantity, 0
    );

    let discountAmount = 0;
    if (cart.coupon?.couponId) {
        const coupon = cart.coupon.couponId;
        const isValid = coupon.isActive && coupon.expirationDate > new Date();

        if (!isValid) {
            return next(new AppError("Coupon is no longer valid", 400));
        }

        discountAmount = subtotal * (cart.coupon.discountPercentage / 100);
    }


    const line_items = cart.items.map(item => {
        let variantDescription = "";
        if (item.variant.attributeValues && item.variant.attributeValues.size > 0) {
            const attrs = Array.from(item.variant.attributeValues.entries());
            variantDescription = attrs.map(([key, value]) => `${key}: ${value}`).join(", ");
        }

        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    description: variantDescription ? `Variant - ${variantDescription}` : undefined,
                    images: item.coverImage ? process.env.NODE_ENV === "development" ? [`${process.env.BACK_DEVELOPMENT_URL}/images/products/${item.coverImage}`] : [`${process.env.BACK_PRODUCTION_URL}/images/products/${item.coverImage}`] : []
                },
                unit_amount: Math.round(item.variant.price * 100), // cents
            },
            quantity: item.quantity

        };
    });


    if (discountAmount > 0) {
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: `Discount (${cart.coupon.code})`,
                },
                unit_amount: -Math.round(discountAmount * 100),
            },
            quantity: 1,
        });
    }

    const redirectionURL = process.env.NODE_ENV === "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL;


    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: `${redirectionURL}/cart`,
        cancel_url: `${redirectionURL}/cart`,
        metadata: {
            userId: req.user._id.toString(),
            address: req.body.address.toString(),
            phone: req.body.phone.toString()
        }
    });


    res.status(200).json({
        priceChanged: req.priceChanged,
        url: session.url
    });
});

const refundWithIdempotency = (paymentIntentId, idempotencySuffix) => {
    return stripe.refunds.create(
        { payment_intent: paymentIntentId },
        { idempotencyKey: `refund-${paymentIntentId}-${idempotencySuffix}` }
    );
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // make sure raw body is available, not parsed JSON
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // we get it from stipe after setting up webhook with our domain
        );
    } catch (err) {
        console.log("⚠️ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle only the event type you care about
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // ✅ Only process if payment is confirmed
        if (session.payment_status !== "paid") {
            return res.status(200).send({ received: true });
        }

        const userId = session.metadata.userId;
        const address = session.metadata.address;
        const phone = session.metadata.phone;

        // ✅ Prevent duplicate processing
        const existingOrder = await Order.findOne({ stripeSessionId: session.id });
        if (existingOrder) return res.status(200).send({ received: true });

        // ✅ Fetch fresh cart
        const cart = await Cart.findOne({ userId })
            .populate("items.productId", "variant")
            .populate("coupon.couponId");

        if (!cart || cart.items.length === 0) {
            // Optionally issue refund if cart empty
            await refundWithIdempotency(session.payment_intent, "empty_cart");
            return res.status(200).send({ error: "Cart empty, refund issued" });
        }

        // ✅ Revalidate stock & price
        const { error } = await validateCartItems(cart);
        if (error) {
            // Refund if validation fails
            await refundWithIdempotency(session.payment_intent, "cart_validation_failed");
            return res.status(200).send({ error: error.message });
        }

        try {
            // ✅ Transaction-safe order creation
            console.log("Creating order");

            await createOrderService(userId, { address, phone }, true, cart, session.id, session.payment_intent);
        } catch (err) {
            console.log("Error creating order from webhook:", err);
            // refund on failure
            await refundWithIdempotency(session.payment_intent, "order_creation_failed");
            return res.status(200).send({ error: "Order creation failed, refund issued" });
        }
    }

    // Respond 200 to acknowledge receipt of webhook
    res.status(200).send({ received: true });
};