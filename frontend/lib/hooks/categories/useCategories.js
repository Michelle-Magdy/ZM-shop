import { getCategories } from "@/lib/api/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    gcTime: 5 * 1000 * 60,
  });
}
