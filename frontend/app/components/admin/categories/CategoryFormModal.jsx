import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function CategoryFormModal({
  isOpen,
  editingCategory,
  categories,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError = "",
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: "",
      image: null,
    },
  });

  useEffect(() => {
    reset({
      name: editingCategory?.name || "",
      slug: editingCategory?.slug || "",
      description: editingCategory?.description || "",
      parent: editingCategory?.parent || "",
      image: null,
    });
  }, [editingCategory, reset, isOpen]);

  const selectedImage = watch("image");
  const selectedFile = selectedImage?.[0] || null;
  const selectedFileName = selectedFile?.name || "";
  const selectedParent = watch("parent");

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return "";
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const submitForm = (values) => {
    const payload = new FormData();

    payload.append("name", values.name.trim());
    payload.append("description", values.description?.trim() || "");

    payload.append("parent", values.parent || "");

    if (values.image?.[0]) {
      payload.append("image", values.image[0]);
    }

    onSubmit(payload);
  };

  const imageValidation = register("image", {
    validate: {
      fileType: (files) => {
        const file = files?.[0];
        if (!file) {
          return true;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        return (
          allowedTypes.includes(file.type) ||
          "Only JPG, PNG, and WEBP images are allowed"
        );
      },
      fileSize: (files) => {
        const file = files?.[0];
        if (!file) {
          return true;
        }

        const maxBytes = 2 * 1024 * 1024;
        return file.size <= maxBytes || "Image must be 2MB or smaller";
      },
    },
  });

  if (!isOpen) {
    return null;
  }

  const excludedParentIds = getCategoryAndDescendantIds(
    categories,
    editingCategory?._id,
  );

  const parentOptions = flattenCategories(categories).filter(
    (category) => !excludedParentIds.has(category._id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-(--color-card) rounded-2xl shadow-2xl w-full max-w-2xl animate-enter">
        <div className="flex items-center justify-between px-6 py-4 border-b border-badge">
          <h3 className="text-lg font-semibold text-(--color-primary-text)">
            {editingCategory?._id ? "Edit Category" : "Add Category"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-badge text-secondary-text"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-primary-text) mb-1.5">
                  Name <span className="text-error">*</span>
                </label>
                <input
                  {...register("name", {
                    required: "Category name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
                  placeholder="e.g., Electronics"
                />
                {errors.name && (
                  <p className="text-xs text-error mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-(--color-primary-text) mb-1.5">
                  Parent Category
                </label>
                <select
                  {...register("parent")}
                  className="w-full px-4 py-2.5 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
                >
                  <option value={""}>None (Root Category)</option>
                  {parentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.namePath?.join(" > ") || option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-primary-text) mb-1.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) focus:outline-none focus:border-(--color-primary) resize-none"
                  placeholder="Category description..."
                />
              </div>
            </div>
            {selectedParent === "" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-(--color-primary-text) mb-1.5">
                  Category Image
                </label>
                <label
                  htmlFor="category-image"
                  className="block border-2 border-dashed border-badge rounded-xl p-6 text-center hover:border-(--color-primary)/50 transition-colors cursor-pointer"
                >
                  <input
                    id="category-image"
                    type="file"
                    {...imageValidation}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={selectedParent !== ""}
                  />
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm text-secondary-text">
                    Click to browse image
                  </p>
                  {selectedFileName ? (
                    <p className="text-xs text-(--color-primary-text) mt-1 truncate">
                      {selectedFileName}
                    </p>
                  ) : (
                    <p className="text-xs text-secondary-text mt-1">
                      JPG, PNG, WEBP
                    </p>
                  )}
                </label>

                {errors.image && (
                  <p className="text-xs text-error mt-2">
                    {errors.image.message}
                  </p>
                )}

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="mt-3 h-28 w-full object-cover rounded-lg border border-badge"
                  />
                )}

                {!previewUrl && editingCategory?.image && (
                  <p className="mt-2 text-xs text-secondary-text truncate">
                    Current image: {editingCategory.image}
                  </p>
                )}
              </div>
            )}
            {selectedParent !== "" && (
              <p className="bg-amber-100 border-2 border-amber-300 text-amber-800 mt-2 p-4 col-span-2 text-center rounded-md">
                cannot add image to child category
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-badge">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-secondary-text hover:bg-badge transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-(--color-primary) text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? editingCategory?._id
                  ? "Updating..."
                  : "Creating..."
                : editingCategory?._id
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function flattenCategories(categories = []) {
  const list = [];

  const walk = (nodes = []) => {
    nodes.forEach((node) => {
      list.push(node);
      walk(getChildren(node));
    });
  };

  walk(categories);

  return list;
}

function getChildren(node) {
  if (Array.isArray(node.children)) {
    return node.children;
  }

  if (Array.isArray(node.subcategories)) {
    return node.subcategories;
  }

  return [];
}

function getCategoryAndDescendantIds(categories = [], categoryId) {
  const ids = new Set();

  if (!categoryId) {
    return ids;
  }

  const walk = (nodes = [], shouldCollect = false) => {
    nodes.forEach((node) => {
      const isTarget = node?._id === categoryId;
      const collectThisNode = shouldCollect || isTarget;

      if (collectThisNode && node?._id) {
        ids.add(node._id);
      }

      walk(getChildren(node), collectThisNode);
    });
  };

  walk(categories);

  return ids;
}
