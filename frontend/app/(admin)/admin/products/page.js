// app/admin/products/page.jsx
"use client";

import { useState } from "react";

export default function ProductsPage() {
  // TODO: Fetch products from your API
  // const { products, pagination, loading, deleteProduct } = useYourDataFetching();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with your actual data
  const products = [
    {
      _id: "1",
      title: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      price: 109999,
      compareAtPrice: 119999,
      stock: 30,
      status: "active",
      coverImage: null,
      categoryIds: ["1", "2"],
      ratingStats: { average: 4.5, count: 128 },
      variants: [{}, {}, {}, {}, {}, {}], // 6 variants
      variantDimensions: ["color", "size"],
      isFeatured: true,
      isBestSeller: true,
      createdAt: "2024-01-15",
    },
    {
      _id: "2",
      title: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      price: 99900,
      stock: 45,
      status: "active",
      ratingStats: { average: 4.8, count: 256 },
      variants: [{}, {}, {}],
      variantDimensions: ["storage", "color"],
      isFeatured: false,
      isBestSeller: true,
    },
    {
      _id: "3",
      title: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      price: 34900,
      stock: 12,
      status: "draft",
      ratingStats: { average: 4.6, count: 89 },
      variants: [],
      variantDimensions: [],
    },
  ];

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id) => {
    // TODO: Call your delete API
    // await deleteProduct(id);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-500/10 text-green-600",
      draft: "bg-yellow-500/10 text-yellow-600",
      archived: "bg-gray-500/10 text-gray-600",
      discontinued: "bg-red-500/10 text-red-600",
    };
    return styles[status] || styles.draft;
  };

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-primary-text)">
            Products
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="px-6 py-2.5 bg-(--color-primary) text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          + Add Product
        </a>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 bg-(--color-card) border border-badge rounded-xl p-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text">
              🔍
            </span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* TODO: Add category filter dropdown with your categories */}
          <select className="px-4 py-2 rounded-lg border border-badge bg-(--color-background) text-(--color-primary-text)">
            <option value="">All Categories</option>
          </select>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-text">
              {selectedProducts.length} selected
            </span>
            <button
              onClick={() => {
                // TODO: Bulk delete
              }}
              className="px-4 py-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-(--color-card) border border-badge rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-badge/50">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-badge"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Variants
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-primary-text)">
                Rating
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-(--color-primary-text)">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-badge">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-badge/30 transition-colors group"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleSelectProduct(product._id)}
                    className="rounded border-badge"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-badge flex items-center justify-center text-2xl">
                      {product.coverImage ? "📷" : "📦"}
                    </div>
                    <div>
                      <h4 className="font-medium text-(--color-primary-text)">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-secondary-text">
                          {product.slug}
                        </span>
                        {product.isFeatured && (
                          <span className="text-xs px-2 py-0.5 bg-(--color-primary)/10 text-(--color-primary) rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                      product.status,
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-(--color-primary-text)">
                      {formatPrice(product.price)}
                    </p>
                    {product.compareAtPrice > product.price && (
                      <p className="text-sm text-secondary-text line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`font-medium ${
                      product.stock < 10
                        ? "text-error"
                        : "text-(--color-primary-text)"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {product.variants?.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-(--color-primary-text)">
                        {product.variants.length} variants
                      </span>
                      <div className="flex gap-1">
                        {product.variantDimensions?.map((dim) => (
                          <span
                            key={dim}
                            className="text-xs px-2 py-0.5 bg-badge rounded"
                          >
                            {dim}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-secondary-text">
                      No variants
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-(--color-primary-text) font-medium">
                      {product.ratingStats?.average || 0}
                    </span>
                    <span className="text-secondary-text text-sm">
                      ({product.ratingStats?.count || 0})
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/admin/products/${product.slug}`}
                      className="px-3 py-1.5 text-sm bg-badge text-(--color-primary-text) rounded-lg hover:bg-(--color-primary) hover:text-white transition-colors"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1.5 text-sm bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-badge">
          <p className="text-sm text-secondary-text">
            Showing 1 to {products.length} of 100 results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-badge text-secondary-text hover:bg-badge disabled:opacity-50">
              Previous
            </button>
            <span className="px-4 py-2 text-(--color-primary-text)">
              Page 1 of 10
            </span>
            <button className="px-4 py-2 rounded-lg border border-badge text-(--color-primary-text) hover:bg-badge">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
