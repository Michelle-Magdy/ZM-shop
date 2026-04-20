import FAQ from "../models/faq.model.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";


export const getAllFAQ = getAll(FAQ);

export const addFAQ = createOne(FAQ);

export const deleteFAQ = deleteOne(FAQ);

export const updateFAQ = updateOne(FAQ);