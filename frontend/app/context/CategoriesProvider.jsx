'use client';
import { createContext, useContext } from "react";

const CategoriesContext = createContext([]);

export default function CategoriesProvider({ children, categories }) {
  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => useContext(CategoriesContext);
