import Image from "next/image";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "@/features/cart/cartSlice";


export default function CartItem({ item }) {
    const dispatch = useDispatch();
    const { quantity, stock } = useSelector((state) => {
        const currentItem = state.cart.items.find(
            (it) => it.variant.sku === item.variant.sku,
        );
        return {
            quantity: currentItem.quantity,
            stock: currentItem.variant.stock,
        };
    }, shallowEqual); 


    const handleIncreaseQuantity = () => {
        dispatch(increaseQuantity({ sku: item.variant.sku }));
    };

    const handleDecreaseQuantity = () => {
        dispatch(decreaseQuantity({ sku: item.variant.sku }));
    };

    const handleRemoveItem = () => {
        dispatch(removeFromCart({ sku: item.variant.sku }));
    };

    return (
        <div className="bg-(--color-card) rounded-lg p-4 shadow-sm border border-badge flex flex-col sm:flex-row gap-4">
            {/* Product Image */}
            <Link
                href={`product/${item.slug}`}
                className="shrink-0 relative w-36 h-36"
            >
                <Image
                    src={`${PRODUCT_IMAGE_URL}/products/${item.coverImage}`}
                    alt={item.title}
                    className="object-cover rounded-md"
                    fill
                    sizes="96px"
                    unoptimized
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-(--color-primary-text) font-ubuntu">
                        {item.title}
                    </h3>
                    {Object.entries(item.variant.attributeValues).map(
                        ([key, value]) => (
                            <p
                                className="text-sm text-secondary-text my-3"
                                key={key}
                            >
                                {`${key}: `}
                                <span className="text-(--color-primary-text)">
                                    {value}
                                </span>
                            </p>
                        ),
                    )}

                    <p className="text-lg font-bold dark:font-semibold text-(--color-primary) dark:text-primary-text mt-2">
                        ${item.variant.price.toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-badge rounded-lg overflow-hidden">
                        <button
                            onClick={handleDecreaseQuantity}
                            disabled={quantity === 1}
                            className="px-3 py-2 hover:bg-primary-hover hover:text-white text-(--color-primary-text) transition-colors duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <span className="px-3 py-2 text-(--color-primary-text) font-medium min-w-12 text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncreaseQuantity}
                            disabled={quantity >= stock}
                            className="px-3 py-2 hover:bg-primary-hover hover:text-white text-(--color-primary-text) transition-colors duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={handleRemoveItem}
                        className="p-2 text-secondary-text hover:text-red-500 transition-colors duration-200"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
