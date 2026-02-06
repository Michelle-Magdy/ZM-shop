import { CiShoppingCart } from "react-icons/ci";

export default function Header() {
    return (
        <div className="flex justify-between items-center p-5">
            <h1 className="text-4xl font-bold">ZM Shop</h1>
            <div className="flex">
                <CiShoppingCart size={45} />
                <span className="-ml-2.5 -mt-2">0</span>
            </div>
        </div>
    );
}
