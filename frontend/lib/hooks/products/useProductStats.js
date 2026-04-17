import { getProductStats } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProductStats() {
  return useQuery({
    queryKey: ["products", "stats"],
    queryFn: getProductStats,
  });
}
