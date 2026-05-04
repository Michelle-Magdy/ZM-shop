import catchAsync from "../util/catchAsync.js";
import { createOrderService } from "../services/order.service.js";
import { validateCartItems } from "../services/cart.service.js";
import Cart from "../models/cart.model.js";
import stripe from "../stripeConfig.js";
import Order from "../models/order.model.js";
import AppError from "../util/appError.js";

export const createCheckoutSession = catchAsync(async (req, res, next) => {
    const cart = req.cart;
    const subtotal = cart.items.reduce((sum, item) =>
        sum + item.variant.price * item.quantity, 0
    );

     let discountPercentage = 0;
    if (cart.coupon?.couponId) {
        const coupon = cart.coupon.couponId;
        const isValid = coupon.isActive && coupon.expirationDate > new Date();

        if (!isValid) {
            return next(new AppError("Coupon is no longer valid", 400));
        }

        discountPercentage = cart.coupon.discountPercentage / 100;
    }

    const discountMultiplier = 1 - discountPercentage;

    const line_items = cart.items.map(item => {
        let variantDescription = "";
        if (item.variant.attributeValues?.size > 0) {
            const attrs = Array.from(item.variant.attributeValues.entries());
            variantDescription = attrs.map(([k, v]) => `${k}: ${v}`).join(", ");
        }

        const discountedUnitPrice = item.variant.price * discountMultiplier;

        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    description: variantDescription ? `Variant - ${variantDescription}` : undefined,
                    images: item.coverImage ? [
                        `${process.env.NODE_ENV === "development"
                            ? process.env.BACK_DEVELOPMENT_URL
                            : process.env.BACK_PRODUCTION_URL}/images/products/${item.coverImage}`
                    ] : []
                },
                unit_amount: Math.round(discountedUnitPrice * 100),
            },
            quantity: item.quantity
        };
    });

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
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type !== "checkout.session.completed") {
        return res.status(200).send({ received: true });
    }

    const session = event.data.object;

    const userId = session.metadata?.userId;
    const address = session.metadata?.address;
    const phone = session.metadata?.phone;

    if (session.payment_status !== "paid") {
        return res.status(200).send({ received: true });
    }

    const existingOrder = await Order.findOne({
        stripeSessionId: session.id
    });

    if (existingOrder) {
        return res.status(200).send({ received: true });
    }

    const cart = await Cart.findOne({ userId })
        .populate("items.productId", "variants")
        .populate("coupon.couponId");

    if (!cart || cart.items.length === 0) {
        await refundWithIdempotency(session.payment_intent, session.id);

        return res.status(200).send({
            error: "Cart empty, refunded"
        });
    }

    const { error } = await validateCartItems(cart);

    if (error) {
        await refundWithIdempotency(session.payment_intent, session.id);

        return res.status(200).send({
            error: "Cart validation failed, refunded"
        });
    }

    try {
        await createOrderService(
            userId,
            { address, phone },
            true,
            cart,
            session.id,
            session.payment_intent
        );

        return res.status(200).send({ received: true });
    } catch (err) {
        await refundWithIdempotency(session.payment_intent, session.id);

        return res.status(200).send({
            error: "Order creation failed, refunded"
        });
    }
};