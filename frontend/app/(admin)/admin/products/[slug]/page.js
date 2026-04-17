// src/app/admin/products/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

// Form Components
import { FormInput } from "../../../../components/admin/products/form/FormInput";
import { FormTextarea } from "../../../../components/admin/products/form/FormTextarea";
import { FormSelect } from "../../../../components/admin/products/form/FormSelect";
import { FormToggle } from "../../../../components/admin/products/form/FormToggle";
import { FormChipSelect } from "../../../../components/admin/products/form/FormChipSelect";
import { ImageUpload } from "../../../../components/admin/products/form/ImageUpload";
import { AttributeBuilder } from "../../../../components/admin/products/form/AttributeBuilder";
import { VariantManager } from "../../../../components/admin/products/form/VariantManager";
import { SEOSection } from "../../../../components/admin/products/form/SEOSection";

// ============================================
// PRODUCT FORM PAGE (CREATE/EDIT)
// ============================================

export default function ProductFormPage({ params }) {
  const router = useRouter();
  const { slug } = useParams();
  console.log(slug);

  const isEdit = slug && slug !== "new";

  // Form State
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    slug: "",
    status: "draft",

    // Pricing
    price: "",
    olderPrice: "",
    stock: 0,

    // Media
    coverImage: "",
    images: [],

    // Categorization
    productTypeId: "",
    categoryIds: [],
    vendorId: "vendor_001", // TODO: Get from auth context

    // Attributes
    attributeDefinitions: [],
    attributes: [],
    variantDimensions: [],

    // Variants
    variants: [],
    defaultVariant: null,

    // Flags
    isFeatured: false,
    isBestSeller: false,
  });

  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data on mount
  useEffect(() => {
    loadFormData();
  }, [params.id]);

  const loadFormData = async () => {
    try {
      // TODO: Replace with actual API calls
      const [cats, types] = await Promise.all([
        fetchCategories(),
        fetchProductTypes(),
      ]);
      setCategories(
        cats.categories.map((c) => ({ value: c._id, label: c.name })),
      );
      setProductTypes(
        types.productTypes.map((t) => ({ value: t._id, label: t.name })),
      );

      if (isEdit) {
        const { product } = await fetchProductById(params.id);
        setFormData({
          ...product,
          price: product.price / 100, // Convert cents to dollars for display
          olderPrice: product.olderPrice ? product.olderPrice / 100 : "",
        });
      }
    } catch (error) {
      console.error("Failed to load form data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle nested changes
  const handleNestedChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.price && formData.price !== 0) {
      newErrors.price = "Price is required";
    }
    if (!formData.coverImage) {
      newErrors.coverImage = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save product
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      // Prepare data for API (convert dollars to cents)
      const apiData = {
        ...formData,
        price: Math.round(formData.price * 100),
        olderPrice: formData.olderPrice
          ? Math.round(formData.olderPrice * 100)
          : null,
        hasVariants: formData.variants.length > 0,
      };

      if (isEdit) {
        // TODO: Replace with actual API call
        await updateProduct(params.id, apiData);
      } else {
        // TODO: Replace with actual API call
        await createProduct(apiData);
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      // TODO: Show error toast
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-(--color-primary)" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/products")}
            className="p-2 hover:bg-(--color-badge)/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-(--color-primary-text)" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-(--color-primary-text)">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-(--color-secondary-text)">
              {isEdit
                ? "Update product details and variants"
                : "Create a new product listing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FormSelect
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
              { value: "discontinued", label: "Discontinued" },
            ]}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <FormInput
                label="Product Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
                placeholder="Enter product name"
              />

              <FormTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your product..."
                hint="Supports HTML formatting"
              />
            </div>
          </section>

          {/* Media */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <ImageUpload
              images={formData.images}
              coverImage={formData.coverImage}
              onImagesChange={(images) => handleNestedChange("images", images)}
              onCoverChange={(cover) => handleNestedChange("coverImage", cover)}
            />
            {errors.coverImage && (
              <p className="text-sm text-(--color-error) mt-2">
                {errors.coverImage}
              </p>
            )}
          </section>

          {/* Pricing */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <FormInput
                label="Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
                prefix="$"
                placeholder="0.00"
              />
              <FormInput
                label="Compare at Price"
                name="olderPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.olderPrice}
                onChange={handleChange}
                prefix="$"
                placeholder="0.00"
                hint="Original price for comparison"
              />
              <FormInput
                label="Base Stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                hint="Used when no variants"
              />
            </div>
          </section>

          {/* Attributes */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <AttributeBuilder
              definitions={formData.attributeDefinitions}
              onDefinitionsChange={(defs) =>
                handleNestedChange("attributeDefinitions", defs)
              }
              attributes={formData.attributes}
              onAttributesChange={(attrs) =>
                handleNestedChange("attributes", attrs)
              }
              variantDimensions={formData.variantDimensions}
              onVariantDimensionsChange={(dims) =>
                handleNestedChange("variantDimensions", dims)
              }
            />
          </section>

          {/* Variants */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <VariantManager
              variants={formData.variants}
              onVariantsChange={(variants) =>
                handleNestedChange("variants", variants)
              }
              variantDimensions={formData.variantDimensions}
              attributeDefinitions={formData.attributeDefinitions}
              basePrice={formData.price ? Math.round(formData.price * 100) : 0}
              baseStock={formData.stock}
            />
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Organization
            </h2>
            <div className="space-y-4">
              <FormSelect
                label="Product Type"
                name="productTypeId"
                value={formData.productTypeId}
                onChange={handleChange}
                options={productTypes}
                placeholder="Select type..."
              />

              <FormChipSelect
                label="Categories"
                options={categories}
                selected={formData.categoryIds}
                onChange={(ids) => handleNestedChange("categoryIds", ids)}
                multiple
              />
            </div>
          </section>

          {/* Flags */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Product Flags
            </h2>
            <div className="space-y-4">
              <FormToggle
                label="Featured Product"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  handleNestedChange("isFeatured", e.target.value)
                }
                hint="Show in featured section"
              />
              <FormToggle
                label="Best Seller"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={(e) =>
                  handleNestedChange("isBestSeller", e.target.value)
                }
                hint="Mark as popular item"
              />
            </div>
          </section>

          {/* SEO */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <SEOSection
              title={formData.title}
              slug={formData.slug}
              onSlugChange={(slug) => handleNestedChange("slug", slug)}
            />
          </section>
        </div>
      </form>
    </div>
  );
}
