// models/Category.js
import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null means it's a top-level category
    },
    description: {
      type: String,
    },
    namePath: {
      type: [String], // ["electronics", "phones", "android"]
      index: true,
    },
    slugPath: {
      type: [String], // ["electronics", "phones", "android"]
      index: true,
    },
    image: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

categorySchema.index({ slug: 1 });
categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

categorySchema.pre("save", async function (next) {
  if (this.isModified("name"))
    this.slug = slugify(this.name, { lower: true, strict: true });
  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (!parent) {
      return next(new Error("Parent category not found"));
    }
    this.namePath = [...parent.namePath, this.name];
    this.slugPath = [...parent.slugPath, this.slug];
  } else {
    this.namePath = [this.name];
    this.slugPath = [this.slug];
  }
});

// samsung
// electronics => mobile => samsung
//[]

// electronics: [electronics]
// mobile: [electronics, mobile]
// samsung: [electronics, mobile, samsung]

const Category = mongoose.model("Category", categorySchema);
export default Category;
