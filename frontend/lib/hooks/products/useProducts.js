"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "../../api/products";

export function useProducts(catSlug = "all", filters = {}) {
  return useQuery({
    queryFn: () => getProductsByCategory(catSlug, filters),
    queryKey: ["products", filters],
    staleTime: 5000,
  });
}
