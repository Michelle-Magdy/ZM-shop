// src/app/admin/products/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation
import { Package, Loader2 } from "lucide-react";

// Components
import { ProductStats } from "../../../components/admin/products/ProductStats";
import { FilterBar } from "../../../components/admin/products/FilterBar";
import { ProductCard } from "../../../components/admin/products/ProductCard";
import { ProductTableRow } from "../../../components/admin/products/ProductTableRow";
import { DeleteModal } from "../../../components/admin/products/DeleteModal";

// API
import {
  toggleProductFlag,
  bulkUpdateProducts,
} from "../../../../lib/api/products";
import { useProducts } from "@/lib/hooks/products/useProducts";
import { useProductMutations } from "@/lib/hooks/products/useProdcutMutations";
import toast from "react-hot-toast";
import { useBulkActions } from "@/lib/hooks/products/useBulkActions";
import PaginationClient from "@/app/components/PaginationClient";

// ============================================
// MAIN PRODUCTS PAGE COMPONENT
// ============================================

export default function ProductsPage() {
  const router = useRouter(); // Initialize router for navigation

  // State
  const [filters, setFilters] = useState({
    status: "",
    category: "all",
    search: "",
    page: 1,
    limit: 12,
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // custom hooks
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProducts(filters.category || "all", filters);
  const { remove, update, create, bulkDelete, bulkUpdate } =
    useProductMutations(filters);
  const { execute, canExecute } = useBulkActions(
    selectedProducts,
    setSelectedProducts,
    { bulkDelete, bulkUpdate },
  );
  // Handle product selection for bulk actions
  const handleSelectProduct = (productSlug) => {
    setSelectedProducts((prev) =>
      prev.includes(productSlug)
        ? prev.filter((slug) => slug !== productSlug)
        : [...prev, productSlug],
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.results) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.data.map((p) => p.slug));
    }
  };

  // Handle delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (productSlug) => {
    if (!productToDelete) return;
    remove.mutate(productSlug, {
      onSuccess: () => {
        setProductToDelete(null);
        setDeleteModalOpen(false);
        toast.success("Product deleted successfully");
      },
      onError: (err) => {
        console.log(err);
        toast.error(`Failed to delete product ${err}`);
      },
    });
  };

  // Handle edit - Navigate to edit page
  const handleEdit = (product) => {
    // Navigate to edit page with product ID
    router.push(`/admin/products/${product.slug}`);
  };

  // Handle add new - Navigate to create page
  const handleAddNew = () => {
    // Navigate to new product page with "new" as ID
    router.push("/admin/products/new");
  };

  // Handle toggle flags (featured, bestseller)
  const handleToggleFlag = async (productSlug, flag, value) => {
    if (!productSlug || !flag) return;
    update.mutate(
      {
        slug: productSlug,
        data: {
          [flag]: value,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Product updated successfully!`);
        },
        onError: (err) => {
          console.log(err);
          toast.error(`Failed to delete product ${err}`);
        },
      },
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (!canExecute(action)) {
      toast.warning("No products selected");
      return;
    }
    execute(action);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-primary-text)">
            Products
          </h1>
          <p className="text-(--color-secondary-text) mt-1">
            Manage your product inventory and variants
          </p>
        </div>
      </div>

      {/* Stats */}
      <ProductStats />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddNew={handleAddNew}
        selectedCount={selectedProducts.length}
        onBulkAction={handleBulkAction}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-(--color-primary)" size={40} />
        </div>
      ) : products.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-(--color-secondary-text)">
          <Package size={64} className="mb-4 opacity-30" />
          <h3 className="text-lg font-medium text-(--color-primary-text)">
            No products found
          </h3>
          <p className="mt-1">
            Try adjusting your filters or add a new product
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.data.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleFlag={handleToggleFlag}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-(--color-badge)/20 border-b border-(--color-badge)/30">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.data.length &&
                      products.data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-(--color-badge) text-(--color-primary) focus:ring-(--color-primary)"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Updated
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-(--color-secondary-text)">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.data.map((product) => (
                <ProductTableRow
                  key={product.slug}
                  product={product}
                  isSelected={selectedProducts.includes(product.slug)}
                  onSelect={handleSelectProduct}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleFlag={handleToggleFlag}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && products.data.length > 0 && (
        <PaginationClient
          currentPage={products.currentPage}
          totalPages={products.totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {/* Delete Modal */}
      <DeleteModal
        product={productToDelete}
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
