import mongoose, { mongo } from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    olderPrice: Number,
    stock: { type: Number, default: 1, min: 0 },
    coverImage: { type: String, required: true },
    images: [String],
    description: String,
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    categoryIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    ],
    attributeDefinitions: [
      {
        key: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        type: {
          type: String,
          required: true,
          enum: [
            "string",
            "number",
            "boolean",
            "select",
            "color",
            "date",
            "range",
          ],
        },
        options: [{ type: String, trim: true }],
        unit: String,
        isFilterable: {
          type: Boolean,
          default: false,
        },
        isvariantDimensions: { type: Boolean, default: false },
        isRequired: { type: Boolean, default: false },
        displayName: String,
      },
    ],
    attributes: [
      {
        key: {
          type: String,
          required: true,
        },
        value: mongoose.Schema.Types.Mixed,
        displayValue: String,
      },
    ],
    variantDimensions: [{ type: String, index: true, trim: true }],
    variants: [
      {
        sku: { type: String, required: true, unique: true, index: true },
        attributeValues: [
          {
            key: { type: String, required: true },
            value: mongoose.Schema.Types.Mixed,
            _id: false, // Optional: don't create _id for subdocuments
          },
        ],
        price: { type: Number, required: true, min: 0 },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        isActive: { type: Boolean, default: true },
      },
    ],

    slug: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    // Ratings (denormalized)
    ratingStats: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      distribution: {
        type: Map,
        of: Number,
        default: new Map([
          ["5", 0],
          ["4", 0],
          ["3", 0],
          ["2", 0],
          ["1", 0],
        ]),
      },
    },

    viewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "archived", "discontinued"],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
productSchema.virtual("hasVariants").get(function () {
  return this.variantDimensions && this.variantDimensions.length > 0;
});

productSchema.virtual("formattedPrice").get(function () {
  return (this.basePrice / 100).toFixed(2);
});

productSchema.virtual("priceRange").get(function () {
  if (!this.hasVariants || !this.variants?.length) {
    return { min: this.price, max: this.price };
  }
  const prices = this.variants.filter((v) => v.isActive).map((v) => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

// indeces
productSchema.index({ status: 1, categoryIds: 1, isDeleted: 1 });
productSchema.index({ status: 1, isDeleted: 1, "ratingStats.average": -1 });
productSchema.index({ title: "text", description: "text" });
productSchema.index({ "variants.attributeValues": 1 }); // for variant filtering

productSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true, // strip special characters except replacements
      remove: /[*+~.()'"!:@]/g,
    });
    let slug = baseSlug;
    let counter = 1;
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
    next();
  }
});

// validation for variants
productSchema.pre("save", function (next) {
  if (this.hasVariants) {
    if (!this.variants || this.variants.length === 0) {
      // Fixed: variants.length instead of variantDimensions.length
      return next(
        new Error("Products with variants must have at least one variant"),
      );
    }

    for (const variant of this.variants) {
      for (const dim of this.variantDimensions) {
        // Fix: attributeValues is an array, not a Map
        const hasAttribute = variant.attributeValues.some(
          (attr) => attr.key === dim,
        );
        if (!hasAttribute) {
          return next(
            new Error(`Variant ${variant.sku} missing value for ${dim}`),
          );
        }
      }
    }
  }
  next();
});

productSchema.index({ title: 1 });
productSchema.index({ description: 1 });
productSchema.index({ slug: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
