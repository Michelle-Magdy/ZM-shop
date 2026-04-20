// src/app/admin/products/[slug]/page.jsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  ImageIcon,
  CornerDownLeft,
} from "lucide-react";

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
import { useCategories } from "@/lib/hooks/categories/useCategories";
import { useProduct } from "@/lib/hooks/products/useProduct";
import { useProductMutations } from "@/lib/hooks/products/useProdcutMutations";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthenticationProvider";

// ============================================
// ZOD SCHEMA - Matches Mongoose Model
// ============================================
const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  status: z.enum(["draft", "active", "archived", "discontinued"]),
  price: z.coerce.number().min(0, "Price must be positive"),
  olderPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(1),
  coverImage: z.any(),
  images: z.array(z.any()).max(5, "Maximum 5 gallery images allowed"),
  categoryIds: z.array(z.string()),
  attributeDefinitions: z.array(z.any()),
  attributes: z.array(z.any()),
  variantDimensions: z.array(z.string()),
  variants: z.array(z.any()),
  defaultVariant: z.any().nullable(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  // vendorId: z.string(),
});

// ============================================
// PRODUCT FORM PAGE (CREATE/EDIT)
// ============================================
export default function ProductFormPage() {
  const router = useRouter();
  const { slug } = useParams();
  const { user } = useAuth();

  const isEdit = slug && slug !== "new";

  // Data fetching hooks
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useProduct(isEdit ? slug : null);

  // mutations
  const { create, update } = useProductMutations();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      price: 0,
      olderPrice: 0,
      stock: 1,
      coverImage: null,
      images: [],
      categoryIds: [],

      attributeDefinitions: [],
      attributes: [],
      variantDimensions: [],
      variants: [],
      defaultVariant: null,
      isFeatured: false,
      isBestSeller: false,
      isDeleted: false,
    },
  });

  // Watch values
  const watchedPrice = watch("price");
  const watchedStock = watch("stock");
  const watchedTitle = watch("title");
  const watchedImages = watch("images");
  const watchedVariantDimensions = watch("variantDimensions");

  // Populate form when product data loads
  useEffect(() => {
    if (isEdit && productData?.data) {
      const product = productData.data;

      const priceInDollars = product.price ? product.price / 100 : 0;
      const olderPriceInDollars = product.olderPrice
        ? product.olderPrice / 100
        : null;

      const variantsWithDollarPrices =
        product.variants?.map((variant) => ({
          ...variant,
          price: variant.price ? variant.price / 100 : 0,
        })) || [];

      const defaultVariantWithDollarPrice = product.defaultVariant
        ? {
            ...product.defaultVariant,
            price: product.defaultVariant.price
              ? product.defaultVariant.price / 100
              : 0,
          }
        : null;

      // Convert legacy string images to object format
      const coverImageObj =
        typeof product.coverImage === "string"
          ? { url: product.coverImage }
          : product.coverImage || { url: "" };

      const imagesObj = (product.images || []).map((img) =>
        typeof img === "string" ? { url: img } : img,
      );

      reset({
        ...product,
        price: priceInDollars,
        olderPrice: olderPriceInDollars,
        variants: variantsWithDollarPrices,
        defaultVariant: defaultVariantWithDollarPrice,
        coverImage: coverImageObj,
        images: imagesObj,
        categoryIds: product.categoryIds || [],
        attributeDefinitions: product.attributeDefinitions || [],
        attributes: product.attributes || [],
        variantDimensions: product.variantDimensions || [],
      });
    }
  }, [productData, isEdit, reset]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Prepare categories options
  const categoryOptions =
    categoriesData?.data?.map((c) => ({
      value: c._id,
      label: c.name,
    })) || [];

  const product = productData?.data;

  // Form submission handler
  // const onSubmit = (data) => {
  //   try {
  //     const variantsWithCents = data.variants.map((variant) => ({
  //       ...variant,
  //       price: Math.round(variant.price * 100),
  //     }));

  //     const defaultVariantWithCents = data.defaultVariant
  //       ? {
  //           ...data.defaultVariant,
  //           price: Math.round(data.defaultVariant.price * 100),
  //         }
  //       : null;

  //     const apiData = {
  //       ...data,
  //       price: Math.round(data.price * 100),
  //       olderPrice: data.olderPrice ? Math.round(data.olderPrice * 100) : null,
  //       variants: variantsWithCents,
  //       defaultVariant: defaultVariantWithCents,
  //       images: data.images.map((image) => image.file || image.url),
  //       coverImage: data.coverImage.file || data.coverImage.url,
  //     };

  //     console.log(apiData);
  //     if (isEdit) {
  //       update.mutate(
  //         { slug: slug, data: apiData },
  //         {
  //           onSuccess: (data) => {
  //             console.log(data);

  //             toast.success(
  //               `${data.data.document.title} is updated successfully!`,
  //             );
  //           },
  //           onError: () => {
  //             toast.error(`${data.data.document.title} failed to update`);
  //           },
  //         },
  //       );
  //     } else {
  //       create.mutate(apiData, {
  //         onSuccess: (data) => {
  //           toast.success(
  //             `${data.data.document.title} is updated successfully!`,
  //           );
  //         },
  //         onError: () => {
  //           toast.error(`Cannot create the new product`);
  //         },
  //       });
  //     }

  //     // router.push("/admin/products");
  //   } catch (error) {
  //     console.error("Failed to save product:", error);
  //   }
  // };

  const onSubmit = (data) => {
    try {
      const normalizedImages = (data.images || []).filter(Boolean);
      const hasNewCoverImage = data.coverImage?.file instanceof File;

      const formData = new FormData();

      // === Basic Fields ===
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("status", data.status);
      formData.append("price", Math.round(data.price * 100));
      formData.append("stock", data.stock);
      formData.append("isFeatured", data.isFeatured);
      formData.append("isBestSeller", data.isBestSeller);
      formData.append("isDeleted", data.isDeleted);
      formData.append("vendorId", user?.id || user?._id);

      if (data.olderPrice) {
        formData.append("olderPrice", Math.round(data.olderPrice * 100));
      }

      // === Arrays ===
      data.categoryIds.forEach((id) => formData.append("categoryIds", id));
      data.variantDimensions.forEach((dim) =>
        formData.append("variantDimensions", dim),
      );

      // === Complex Objects (stringified) ===
      formData.append(
        "variants",
        JSON.stringify(
          data.variants.map((variant) => ({
            ...variant,
            price: Math.round(variant.price * 100),
          })),
        ),
      );
      const selectedDefault =
        data.defaultVariant ||
        data.variants.find((v) => v.isActive) ||
        data.variants[0] ||
        null;

      if (selectedDefault) {
        formData.append(
          "defaultVariant",
          JSON.stringify({
            sku: selectedDefault.sku,
            price: Math.round(selectedDefault.price * 100),
            stock: selectedDefault.stock,
            attributeValues: selectedDefault.attributeValues,
          }),
        );
      }

      formData.append(
        "attributeDefinitions",
        JSON.stringify(data.attributeDefinitions),
      );
      formData.append("attributes", JSON.stringify(data.attributes));

      // === Images: Match your backend's expected field names ===

      // Send existing image URLs as JSON string in 'images' field
      // Your backend's resizeImages uses req.body.existingImages
      const existingImageUrls = normalizedImages
        .filter((img) => img?.url && !(img.file instanceof File))
        .map((img) => img.url);

      if (existingImageUrls.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImageUrls));
      }

      // Send new cover image with field name 'coverImage' (matches uploadImages config)
      if (hasNewCoverImage) {
        formData.append("coverImage", data.coverImage.file);
      } else if (data.coverImage?.url) {
        // If no new file, send existing URL so sanitizer can use it
        formData.append("coverImage", data.coverImage.url);
      }

      // Send new gallery images with field name 'images' (matches uploadImages config)
      normalizedImages.forEach((image) => {
        if (image?.file instanceof File) {
          formData.append("images", image.file);
        }
      });

      if (process.env.NODE_ENV === "development") {
        console.log("=== FormData Entries ===");
        for (let [key, value] of formData.entries()) {
          console.log(
            `${key}:`,
            value instanceof File ? `File(${value.name})` : value,
          );
        }
      }

      console.log(Object.fromEntries(formData.entries()));

      if (isEdit) {
        update.mutate(
          { slug: slug, data: formData },
          {
            onSuccess: (response) => {
              toast.success(
                `${response.data.document.title} updated successfully!`,
              );
              router.push("/admin/products");
            },
            onError: (error) => {
              toast.error(
                `Failed to update: ${error.message || "Unknown error"}`,
              );
            },
          },
        );
      } else {
        create.mutate(formData, {
          onSuccess: (response) => {
            toast.success(
              `${response.data.document.title} created successfully!`,
            );
            router.push("/admin/products");
          },
          onError: (error) => {
            toast.error(
              `Failed to create: ${error.message || "Unknown error"}`,
            );
          },
        });
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product");
    }
  };

  // Loading state
  if ((isEdit && productLoading) || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-(--color-primary)" size={40} />
      </div>
    );
  }

  // Error state
  if (productError || categoriesError) {
    return (
      <div className="flex items-center justify-center h-96 text-(--color-error)">
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="p-2 hover:bg-(--color-badge)/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-(--color-primary-text)" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-(--color-primary-text)">
              {isEdit
                ? `Edit: ${product?.title || "Product"}`
                : "Add New Product"}
            </h1>
            <p className="text-(--color-secondary-text)">
              {isEdit
                ? `Editing ${product?.slug ? `(slug: ${product.slug})` : ""}`
                : "Create a new product listing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "archived", label: "Archived" },
                  { value: "discontinued", label: "Discontinued" },
                ]}
              />
            )}
          />
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
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
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Product Title"
                    {...field}
                    error={fieldState.error?.message}
                    required
                    placeholder={
                      isEdit
                        ? product?.title || "Enter product name"
                        : "Enter product name"
                    }
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <FormTextarea
                    required
                    label="Description"
                    {...field}
                    rows={6}
                    placeholder={
                      isEdit
                        ? product?.description || "Describe your product..."
                        : "Describe your product..."
                    }
                  />
                )}
              />
            </div>
          </section>

          {/* Cover Image - Separate Section */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon size={20} className="text-(--color-primary)" />
              <h2 className="text-lg font-semibold text-(--color-primary-text)">
                Cover Image
              </h2>
            </div>
            <p className="text-sm text-(--color-secondary-text) mb-4">
              Main product image displayed in listings and cards
            </p>
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  isCover={true}
                  images={field.value ? [field.value] : []}
                  coverImage={field.value}
                  onImagesChange={(imgs) => field.onChange(imgs[0] || "")}
                  onCoverChange={field.onChange}
                  maxImages={1}
                  isEdit={isEdit}
                />
              )}
            />

            {errors.coverImage && (
              <p className="text-sm text-(--color-error) mt-2">
                {errors.coverImage.message}
              </p>
            )}
          </section>

          {/* Gallery Images - Max 5 */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-(--color-primary)" />
                <h2 className="text-lg font-semibold text-(--color-primary-text)">
                  Gallery Images
                </h2>
              </div>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  (watchedImages?.length || 0) >= 5
                    ? "bg-(--color-error)/10 text-(--color-error)"
                    : "bg-(--color-badge)/20 text-(--color-secondary-text)"
                }`}
              >
                {watchedImages?.length || 0} / 5
              </span>
            </div>
            <p className="text-sm text-(--color-secondary-text) mb-4">
              Additional product images (maximum 5)
            </p>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  isCover={false} // Explicit for clarity
                  images={field.value || []}
                  coverImage={watch("coverImage")}
                  onImagesChange={field.onChange}
                  onCoverChange={(cover) => setValue("coverImage", cover)}
                  maxImages={5}
                  isEdit={isEdit}
                />
              )}
            />
            {errors.images && (
              <p className="text-sm text-(--color-error) mt-2">
                {errors.images.message}
              </p>
            )}
            {(watchedImages?.length || 0) >= 5 && (
              <p className="text-sm text-(--color-warning) mt-2">
                Maximum 5 images reached. Remove an image to add more.
              </p>
            )}
          </section>

          {/* Pricing */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <FormInput
                      label="Price ($)"
                      type="number"
                      min="0"
                      {...field}
                      error={fieldState.error?.message}
                      placeholder={
                        isEdit ? product?.formattedPrice || "0" : "0"
                      }
                    />
                  );
                }}
              />

              <Controller
                name="olderPrice"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <FormInput
                      label="Compare at Price ($)"
                      type="number"
                      min="0"
                      {...field}
                      error={fieldState.error?.message}
                      placeholder={
                        isEdit
                          ? product?.olderPrice
                            ? (product.olderPrice / 100).toFixed(2)
                            : ""
                          : "0"
                      }
                      hint="Original price for comparison"
                    />
                  );
                }}
              />

              <Controller
                name="stock"
                control={control}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Base Stock"
                    type="number"
                    min="0"
                    {...field}
                    error={fieldState.errors?.message}
                    placeholder={
                      isEdit ? product?.stock?.toString() || "1" : "1"
                    }
                    hint={
                      watchedVariantDimensions?.length > 0
                        ? "Managed by variants"
                        : "Used when no variants"
                    }
                  />
                )}
              />
            </div>
          </section>

          {/* Attributes */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <Controller
              name="attributeDefinitions"
              control={control}
              render={({ field }) => (
                <AttributeBuilder
                  definitions={field.value}
                  onDefinitionsChange={(defs) =>
                    setValue("attributeDefinitions", defs, {
                      shouldDirty: true,
                    })
                  }
                  attributes={watch("attributes")}
                  onAttributesChange={(attrs) =>
                    setValue("attributes", attrs, { shouldDirty: true })
                  }
                  variantDimensions={watch("variantDimensions")}
                  onVariantDimensionsChange={(dims) =>
                    setValue("variantDimensions", dims, { shouldDirty: true })
                  }
                />
              )}
            />
          </section>

          {/* Variants */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <Controller
              name="variants"
              control={control}
              render={({ field }) => (
                <VariantManager
                  variants={field.value}
                  onVariantsChange={(variants) =>
                    setValue("variants", variants, { shouldDirty: true })
                  }
                  defaultVariant={watch("defaultVariant")}
                  onDefaultVariantChange={(variant) =>
                    setValue("defaultVariant", variant, { shouldDirty: true })
                  }
                  variantDimensions={watchedVariantDimensions}
                  attributeDefinitions={watch("attributeDefinitions")}
                  basePrice={watchedPrice || 0}
                  baseStock={watchedStock}
                />
              )}
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
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <FormChipSelect
                    label="Categories"
                    options={categoryOptions}
                    selected={field.value}
                    onChange={(ids) => field.onChange(ids)}
                    multiple
                  />
                )}
              />
            </div>
          </section>

          {/* Flags */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
              Product Flags
            </h2>
            <div className="space-y-4">
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <FormToggle
                    label="Featured Product"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    hint="Show in featured section"
                  />
                )}
              />
              <Controller
                name="isBestSeller"
                control={control}
                render={({ field }) => (
                  <FormToggle
                    label="Best Seller"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    hint="Mark as popular item"
                  />
                )}
              />
              {isEdit && (
                <Controller
                  name="isDeleted"
                  control={control}
                  render={({ field }) => (
                    <FormToggle
                      label="Soft Deleted"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      hint="Hide from storefront"
                    />
                  )}
                />
              )}
            </div>
          </section>

          {/* SEO */}
          <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <SEOSection
                  title={watchedTitle}
                  slug={field.value}
                  onSlugChange={(slug) => field.onChange(slug)}
                  placeholder={isEdit ? product?.slug || "" : ""}
                />
              )}
            />
          </section>

          {/* Stats */}
          {isEdit && product && (
            <section className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-(--color-primary-text) mb-4">
                Statistics
              </h2>
              <div className="space-y-2 text-sm text-(--color-secondary-text)">
                <div className="flex justify-between">
                  <span>View Count:</span>
                  <span className="font-medium">{product.viewCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Count:</span>
                  <span className="font-medium">{product.salesCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Rating:</span>
                  <span className="font-medium">
                    {product.ratingStats?.average?.toFixed(1) || "0.0"} (
                    {product.ratingStats?.count || 0} reviews)
                  </span>
                </div>
                {product.hasVariants && (
                  <div className="flex justify-between text-(--color-primary)">
                    <span>Has Variants:</span>
                    <span className="font-medium">
                      Yes ({product.variants?.length || 0})
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </form>
    </div>
  );
}
