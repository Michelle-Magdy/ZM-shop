import Faq from "../models/faq.model.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";

export const getAllFAQ = getAll(Faq);

export const addFAQ = createOne(Faq);

export const deleteFAQ = deleteOne(Faq);

export const updateFAQ = updateOne(Faq);
