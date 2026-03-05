"use client"
import { createContext, useContext } from "react";

const ProductContext = createContext({
    _id: "",
    title: "",
    coverImage: "",
    ratingStats: {
        avgRating: 0,
        nReviews: 0,
        distribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        },
    },
});

export const ProductProvider = ({ product, children }) => {
    return (
        <ProductContext.Provider value={product}>
            {children}
        </ProductContext.Provider>
    );
};

const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
};

export default useProduct;