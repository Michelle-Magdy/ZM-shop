export default function DeleteCategoryModal({ category, onClose, onConfirm }) {
  if (!category) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-(--color-card) rounded-2xl shadow-2xl w-full max-w-md p-6 animate-enter">
        <div className="text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗑️</span>
          </div>
          <h3 className="text-lg font-semibold text-(--color-primary-text) mb-2">
            Delete Category?
          </h3>
          <p className="text-secondary-text mb-6">
            Are you sure you want to delete "{category.name}"? This will also
            delete all subcategories and cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-badge text-(--color-primary-text) hover:bg-badge transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 rounded-lg bg-error text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
