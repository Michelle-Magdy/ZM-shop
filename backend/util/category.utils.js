import { log } from "console";
import Category from "../models/category.model.js";

export const buildCategoryTree = async () => {
  // 1️⃣ Fetch all categories once
  const allCategories = await Category.find({ isDeleted: false }).lean();

  // 2️⃣ Build a map for quick lookup
  const map = {};
  allCategories.forEach((cat) => {
    map[cat._id.toString()] = { ...cat, subcategories: [] };
  });

  // 3️⃣ Create the hierarchy
  const tree = [];

  allCategories.forEach((cat) => {
    if (cat.parent) {
      // if the category has a parent, attach it to the parent's subcategories array
      map[cat.parent.toString()].subcategories.push(map[cat._id.toString()]);
    } else {
      // if no parent, it's a root category
      tree.push(map[cat._id.toString()]);
    }
  });

  // 4️⃣ Return the complete tree
  return tree;
};

// Recursively get all subcategory IDs for a given parent
export const findCategoryDescendantsIDs = async (parentId) => {
  const allCategories = await Category.find({ isDeleted: false }).lean();

  const descendants = [];
  const map = {};

  allCategories.forEach((cat) => {
    if (!map[cat.parent]) map[cat.parent] = [];
    map[cat.parent].push(cat._id.toString());
  });

  const collect = (id) => {
    if (map[id]) {
      for (const childId of map[id]) {
        descendants.push(childId);
        collect(childId);
      }
    }
  };

  collect(parentId.toString());

  return descendants;
};

export const getAllSubcategories = async (parentId) => {
  // 1️⃣ Get direct children
  const children = await Category.find({
    parent: parentId,
    isDeleted: false,
  }).lean();

  // 2️⃣ If none, return empty array
  if (children.length === 0) return [];
  // console.log(children);

  // 3️⃣ Recursively get grandchildren
  const allDescendants = [];

  for (const child of children) {
    const subChildren = await getAllSubcategories(child._id);
    allDescendants.push({
      ...child,
      subcategories: subChildren,
    });
  }

  return allDescendants;
};
