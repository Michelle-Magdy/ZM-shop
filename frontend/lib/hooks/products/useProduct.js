import { getProduct } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProduct(slug) {
  return useQuery({
    queryFn: () => getProduct(slug),
    queryKey: ["product", slug],
    enabled: !!slug,
  });
}
