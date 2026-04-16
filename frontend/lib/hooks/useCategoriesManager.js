import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/api/categories";
import { getStats } from "@/lib/api/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function useCategoriesManager() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useQuery({
    queryFn: getStats,
    queryKey: ["categories", "stats"],
  });

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const categories = useMemo(() => {
    const normalized = normalizeCategories(data);
    if (normalized.length > 0) {
      return normalized;
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old) => {
        const normalized = normalizeCategories(old);
        return normalized.filter((cat) => cat._id !== id);
      });

      return { previousCategories };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, category }) => updateCategory(id, category),
    onMutate: async ({ id, category }) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old) => {
        const normalized = normalizeCategories(old);
        return replaceCategory(normalized, id, category);
      });

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onMutate: async (category) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old) => {
        const normalized = normalizeCategories(old);
        return [...normalized, withTempId(category)];
      });

      return { previousCategories };
    },
    onError: (_error, _category, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (parent = null) => {
    setSubmitError("");
    setEditingCategory(parent ? { parent: parent._id } : null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSubmitError("");
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setSelectedForDelete(category);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setSubmitError("");
  };

  const confirmDelete = () => {
    if (!selectedForDelete?._id) {
      return;
    }

    deleteMutation.mutate(selectedForDelete._id);
    setSelectedForDelete(null);
  };

  const submitCategory = async (formData) => {
    setSubmitError("");

    try {
      if (editingCategory?._id) {
        await updateMutation.mutateAsync({
          id: editingCategory._id,
          category: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      closeModal();
    } catch (error) {
      setSubmitError(error?.message || "Failed to save category");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const collapseAll = () => setExpandedNodes({});

  return {
    categoriesQuery: {
      categories,
      isLoading,
      isError,
      error,
    },
    statsQuery: {
      stats,
      isLoading: isStatsLoading,
      isError: isStatsError,
      error: statsError,
    },
    showModal,
    editingCategory,
    expandedNodes,
    selectedForDelete,
    isSubmitting,
    submitError,
    handleAdd,
    handleEdit,
    handleDelete,
    closeModal,
    setSelectedForDelete,
    toggleExpand,
    confirmDelete,
    submitCategory,
    collapseAll,
  };
}

function normalizeCategories(source) {
  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.data)) {
    return source.data;
  }

  if (Array.isArray(source?.categories)) {
    return source.categories;
  }

  return [];
}

function replaceCategory(categories, id, partialCategory) {
  return categories.map((category) => {
    if (category._id === id) {
      return { ...category, ...partialCategory };
    }

    const children = getChildren(category);
    if (children.length === 0) {
      return category;
    }

    return {
      ...category,
      children: replaceCategory(children, id, partialCategory),
    };
  });
}

function getChildren(category) {
  if (Array.isArray(category.children)) {
    return category.children;
  }

  if (Array.isArray(category.subcategories)) {
    return category.subcategories;
  }

  return [];
}

function withTempId(category) {
  return {
    _id: `temp-${Date.now()}`,
    ...category,
    subcategories: [],
    slugPath: category.slug ? [category.slug] : [],
  };
}
