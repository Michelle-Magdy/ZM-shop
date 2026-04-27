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

    console.log("\n================ STRIPE WEBHOOK HIT ================");
    console.log("🟢 Webhook received at:", new Date().toISOString());

    console.log("📦 Raw body type:", typeof req.body);
    console.log("📦 Is Buffer:", Buffer.isBuffer(req.body));
    console.log("📦 Headers:", req.headers);

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("✅ Signature verified");
        console.log("📌 Event type:", event.type);
    } catch (err) {
        console.log("❌ Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Only care about checkout success
    if (event.type !== "checkout.session.completed") {
        console.log("⚠️ Ignored event type:", event.type);
        return res.status(200).send({ received: true });
    }

    const session = event.data.object;

    console.log("\n========== SESSION INFO ==========");
    console.log("🆔 Session ID:", session.id);
    console.log("💳 Payment status:", session.payment_status);
    console.log("📦 Metadata:", session.metadata);

    if (!session.metadata) {
        console.log("❌ NO METADATA FOUND");
    }

    const userId = session.metadata?.userId;
    const address = session.metadata?.address;
    const phone = session.metadata?.phone;

    console.log("\n========== EXTRACTED DATA ==========");
    console.log("👤 userId:", userId);
    console.log("🏠 address:", address);
    console.log("📞 phone:", phone);

    if (session.payment_status !== "paid") {
        console.log("❌ Payment not completed yet");
        return res.status(200).send({ received: true });
    }

    console.log("\n========== CHECKING ORDER ==========");
    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    console.log("🔍 Existing order found:", !!existingOrder);

    if (existingOrder) {
        console.log("⚠️ Order already exists → skipping");
        return res.status(200).send({ received: true });
    }

    console.log("\n========== FETCHING CART ==========");
    const cart = await Cart.findOne({ userId })
        .populate("items.productId", "variants")
        .populate("coupon.couponId");

    console.log("🛒 Cart found:", !!cart);
    console.log("📦 Cart items:", cart?.items?.length);

    if (!cart || cart.items.length === 0) {
        console.log("❌ Cart missing or empty");
        return res.status(200).send({ error: "Cart empty" });
    }

    console.log("\n========== VALIDATING CART ==========");
    const { error } = await validateCartItems(cart);

    console.log("⚠️ Validation error:", error || "none");

    if (error) {
        console.log("❌ Cart validation failed");
        return res.status(200).send({ error: error.message });
    }

    console.log("\n========== CREATING ORDER ==========");

    try {
        await createOrderService(
            userId,
            { address, phone },
            true,
            cart,
            session.id,
            session.payment_intent
        );

        console.log("🎉 ORDER CREATED SUCCESSFULLY");
    } catch (err) {
        console.log("❌ ORDER CREATION FAILED:");
        console.log(err);

        return res.status(200).send({
            error: "Order creation failed"
        });
    }

    console.log("================ WEBHOOK DONE ================\n");

    res.status(200).send({ received: true });
};