// hooks/useBulkActions.js
import { useCallback } from "react";

// strategies/bulkActions.js
export const bulkActionStrategies = {
  activate: {
    type: "update",
    getUpdates: () => ({ status: "active" }),
    getSuccessMessage: (count) => `${count} products activated`,
  },

  archive: {
    type: "update",
    getUpdates: () => ({ status: "archived" }),
    getSuccessMessage: (count) => `${count} products archived`,
  },

  delete: {
    type: "delete",
    getSuccessMessage: (count) => `${count} products deleted`,
    confirmMessage: (count) => `Delete ${count} products?`,
  },

  setFeatured: {
    type: "update",
    getUpdates: () => ({ isFeatured: true }),
    getSuccessMessage: (count) => `${count} products set as featured`,
  },

  setBestSeller: {
    type: "update",
    getUpdates: () => ({ isBestSeller: true }),
    getSuccessMessage: (count) => `${count} products set as bestseller`,
  },

  deactivate: {
    type: "update",
    getUpdates: () => ({ status: "inactive" }),
    getSuccessMessage: (count) => `${count} products deactivated`,
  },
};

export function useBulkActions(
  selectedProducts,
  setSelectedProducts,
  mutations,
) {
  const { bulkUpdate, bulkDelete } = mutations;

  const execute = useCallback(
    (actionKey) => {
      const strategy = bulkActionStrategies[actionKey];

      if (!strategy) {
        throw new Error(`Unknown action: ${actionKey}`);
      }

      const count = selectedProducts.length;

      const options = {
        onSuccess: () => {
          toast.success(strategy.getSuccessMessage(count));
          setSelectedProducts([]);
        },
        onError: (err) => toast.error(err.message),
      };

      if (strategy.type === "delete") {
        bulkDelete.mutate({ slugs: selectedProducts }, options);
      } else {
        bulkUpdate.mutate(
          { slugs: selectedProducts, updates: strategy.getUpdates() },
          options,
        );
      }
    },
    [selectedProducts, setSelectedProducts, bulkUpdate, bulkDelete],
  );

  const canExecute = useCallback(
    (actionKey) => {
      return selectedProducts.length > 0 && !!bulkActionStrategies[actionKey];
    },
    [selectedProducts.length],
  );

  return { execute, canExecute, strategies: bulkActionStrategies };
}
