"use client";

import CategoryFormModal from "../../../components/admin/categories/CategoryFormModal";
import CategoryStats from "../../../components/admin/categories/CategoryStats";
import CategoryTree from "../../../components/admin/categories/CategoryTree";
import DeleteCategoryModal from "../../../components/admin/categories/DeleteCategoryModal";
import useCategoriesManager from "../../../../lib/hooks/useCategoriesManager";

export default function CategoriesPage() {
  const {
    categoriesQuery,
    statsQuery,
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
  } = useCategoriesManager();

  if (categoriesQuery.isLoading)
    return (
      <div className="bg-(--color-card) border border-badge rounded-xl p-4 text-sm text-secondary-text">
        Loading categories...
      </div>
    );

  if (categoriesQuery.isError)
    return (
      <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-sm text-error">
        Failed to load categories
        {categoriesQuery.error?.message
          ? `: ${categoriesQuery.error.message}`
          : "."}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-primary-text)">
            Categories
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Manage your product categories and hierarchy
          </p>
        </div>
        <button
          onClick={() => handleAdd()}
          className="px-6 py-2.5 bg-(--color-primary) text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          + Add Category
        </button>
      </div>

      <CategoryStats statsQuery={statsQuery} />

      <CategoryTree
        categories={categoriesQuery?.categories}
        expandedNodes={expandedNodes}
        onToggleExpand={toggleExpand}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCollapseAll={collapseAll}
      />

      <CategoryFormModal
        isOpen={showModal}
        editingCategory={editingCategory}
        categories={categoriesQuery.categories}
        onClose={closeModal}
        onSubmit={submitCategory}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <DeleteCategoryModal
        category={selectedForDelete}
        onClose={() => setSelectedForDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
