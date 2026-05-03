// models/Category.js
import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, index: true },
    amazonId: {
      type: String
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    description: String,
    namePath: { type: [String], index: true },
    slugPath: { type: [String], index: true },
    image: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ----------- VIRTUALS -----------
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});
categorySchema.index(
  { name: 1 },
  {
    partialFilterExpression: {
      isDeleted: false,
    },
  },
);

categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

// =====================================
// 1) PRE SAVE (works for doc.save())
// =====================================
categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (!parent) return next(new Error("Parent category not found"));

    this.namePath = [...parent.namePath, this.name];
    this.slugPath = [...parent.slugPath, this.slug];
  } else {
    this.namePath = [this.name];
    this.slugPath = [this.slug];
  }

  next();
});

// =====================================
// 2) PRE FINDONEANDUPDATE (for update queries)
// =====================================
categorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.isDeleted !== undefined) return next();

  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  const docToUpdate = await this.model.findOne(this.getQuery());
  if (!docToUpdate) return next(new Error("Category not found"));

  const parentId =
    update.parent && update.parent !== "" ? update.parent : docToUpdate.parent;

  if (parentId) {
    const parent = await this.model.findById(parentId); // ✅ FIXED
    if (!parent) return next(new Error("Parent category not found"));

    update.namePath = [...parent.namePath, update.name ?? docToUpdate.name];
    update.slugPath = [...parent.slugPath, update.slug ?? docToUpdate.slug];
  } else {
    update.namePath = [update.name ?? docToUpdate.name];
    update.slugPath = [update.slug ?? docToUpdate.slug];
  }

  this.setUpdate(update);
  next();
});
export default mongoose.model("Category", categorySchema);
