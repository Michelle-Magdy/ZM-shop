import Cart from "../models/cart.model.js";
import Stripe from "stripe";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const validateCart = async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId })
        .populate("items.productId", "variants");

    if (!cart)
        return next(new AppError("User cart doesn't exist", 404));

    let priceChanged = false;

    for (const item of cart.items) {
        const DBVariant = item.productId.variants.find(
            v => v.sku === item.variant.sku
        );

        if (!DBVariant || !DBVariant.isActive) {
            return res.status(409).json({
                status: "error",
                message: `${item.variant.sku} is no longer available`,
            });
        }

        if (DBVariant.stock < item.quantity) {
            return res.status(409).json({
                status: "error",
                message: `${DBVariant.sku} has insufficient stock`,
            });
        }

        if (item.variant.price !== DBVariant.price) {
            item.variant.price = DBVariant.price;
            priceChanged = true;
        }
    }

    if (priceChanged) {
        await cart.save();
    }

    req.cart = cart;
    req.priceChanged = priceChanged;
    next();
};
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
        }
    });

    res.status(200).json({
        priceChanged: req.priceChanged,
        url: session.url
    });
});


