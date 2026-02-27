"use client";
import CartItem from "./CartItem";

export default function CartItems({ items }) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItem item={item} key={item.variant.sku} />
            ))}
        </div>
    );
}
