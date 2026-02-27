import Stripe from "stripe";
import catchAsync from "../util/catchAsync.js";
import { createOrderService } from "../services/order.service.js";
import Cart from "../models/cart.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = catchAsync(async (req, res, next) => {
    const cart = req.cart;
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
                    // images: item.coverImage ? [`http://localhost:5000/images/products/${item.coverImage}`] : [],
                    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh3CYjiccTjNuV8TfekJQTliblU0S7tzQTIQ&s"]
                },
                unit_amount: Math.round(item.variant.price * 100), // cents
            },
            quantity: item.quantity,
            adjustable_quantity: {
                enabled: true,
                minimum: 1,
                maximum: item.variant.stock,
            },

        };
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cart`,
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


export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // make sure raw body is available, not parsed JSON
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
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
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            // Optionally issue refund if cart empty
            await stripe.refunds.create({ payment_intent: session.payment_intent });
            return res.status(400).send({ error: "Cart empty, refund issued" });
        }

        // ✅ Revalidate stock & price
        const { error } = await validateCartItems(cart);
        if (error) {
            // Refund if validation fails
            await stripe.refunds.create({ payment_intent: session.payment_intent });
            return res.status(409).send({ error: error.message });
        }

        try {
            // ✅ Transaction-safe order creation
            await createOrderService(userId, { address, phone }, true, cart, session.id);
        } catch (err) {
            console.log("Error creating order from webhook:", err);
            // Optional: refund on failure
            await stripe.refunds.create({ payment_intent: session.payment_intent });
            return res.status(500).send({ error: "Order creation failed, refund issued" });
        }
    }

    // Respond 200 to acknowledge receipt of webhook
    res.status(200).send({ received: true });
};