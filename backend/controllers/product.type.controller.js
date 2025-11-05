import productType from "../models/product.type.model.js";
import {
  createOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
} from "./factoryHandler.js";
import catchAsync from "../util/catchAsync.js";

export const productTypeSanitizer = (req, res, next) => {
  const { name, attributes } = req.body;
  req.body = { name, attributes };
  next();
};
export const createProductType = createOne(productType);
export const getProductType = getOne(productType);
export const getAllProductTypes = getAll(productType);
export const updateProductType = updateOne(productType);
export const deleteProductType = deleteOne(productType);
