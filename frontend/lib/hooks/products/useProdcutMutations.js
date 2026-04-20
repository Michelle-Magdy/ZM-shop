import {
  bulkUpdateProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaOldRepublic } from "react-icons/fa6";

export function useProductMutations(filters = null) {
  let productsQueryKey = ["products"];
  if (filters) {
    productsQueryKey = ["products", filters];
  }
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createProduct,

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });

      const previousData = queryClient.getQueryData(productsQueryKey);

      queryClient.setQueryData(productsQueryKey, (old) => ({
        ...old, // Keep pagination fields
        data: [newProduct, ...(old?.data || [])], // Add to beginning
        results: (old?.results || 0) + 1, // Update count
        totalCount: (old?.totalCount || 0) + 1, // Update total
      }));

      return { previousData };
    },

    onError: (error, newProduct, context) => {
      queryClient.setQueryData(productsQueryKey, context.previousData);
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ slug, data }) => updateProduct(slug, data),
    onMutate: async ({ slug, data }) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });
      await queryClient.cancelQueries({
        queryKey: ["product", slug],
      });

      const previousProducts = queryClient.getQueryData(productsQueryKey);
      const previousProduct = queryClient.getQueryData(["product", slug]);
      // update products list
      queryClient.setQueryData(productsQueryKey, (old) => ({
        ...old,
        data:
          old?.data?.map((p) => (p.slug === slug ? { ...p, ...data } : p)) ||
          [],
      }));

      // update single updated product
      queryClient.setQueryData(["product", slug], (old) => ({
        ...old,
        ...data,
      }));

      return { previousProducts, previousProduct };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(productsQueryKey, context.previousProducts);

      queryClient.setQueryData(
        ["product", variables.slug],
        context.previousProduct,
      );
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (deletedSlug) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });

      const previousProducts = queryClient.getQueryData(productsQueryKey);

      queryClient.setQueryData(productsQueryKey, (old) => ({
        ...old,
        data: old?.data.filter((p) => p.slug !== deletedSlug),
      }));

      return { previousProducts };
    },

    onError: (error, deletedSlug, context) => {
      queryClient.setQueryData(productsQueryKey, context.previousProducts);
    },
    onSettled: (data, err, deletedSlug, context) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
    },
  });

  const bulkUpdate = useMutation({
    mutationFn: ({ slugs, updates }) => bulkUpdateProducts(slugs, updates),
    onMutate: async ({ slugs, updates }) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });

      const previousProducts = queryClient.getQueryData(productsQueryKey);

      queryClient.setQueryData(previousProducts, (old) => ({
        ...old,
        data:
          old?.data?.map((p) =>
            slugs.includes(p.slug) ? { ...p, ...updates } : p,
          ) || [],
      }));
      return { previousProducts, slugs };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(productsQueryKey, context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: ({ slugs }) => bulkUpdateProducts(slugs),
    onMutate: async ({ slugs }) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });

      const previousProducts = queryClient.getQueryData(productsQueryKey);

      queryClient.setQueryData(previousProducts, (old) => ({
        ...old,
        data: old?.data?.filter((p) => !slugs.includes(p.slug)) || [],
        results: (old?.results || 0) - slugs.length,
        totalCount: (old?.totalCount || 0) - slugs.length,
      }));
      return { previousProducts, slugs };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(productsQueryKey, context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
    },
  });

  return {
    create,
    remove,
    update,
    bulkDelete,
    bulkUpdate,
  };
}
