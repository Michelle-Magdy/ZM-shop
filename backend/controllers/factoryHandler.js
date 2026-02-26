import { log } from "console";
import APIFeatures from "../util/apiFeatures.js";
import catchAsync from "../util/catchAsync.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) await Model.findByIdAndDelete(id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  });

import mongoose from "mongoose";

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { slug, id } = req.params;
    const update = req.body;

    let filter;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: slug };
    } else {
      filter = { slug: slug };
    }

    const updatedDocument = await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: {
        document: updatedDocument,
      },
    });
  });

export const createOne = (Model, object = null) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(object ? object : req.body);

    res.status(201).json({
      status: "Success",
      data: {
        document: newDocument,
      },
    });
  });
export const getOne = (Model, filter = null, populateOptions = null) =>
  catchAsync(async (req, res, next) => {
    // Check for id or slug in params
    const { id, slug } = req.params;
    let query;

    // If custom filter is provided, use it
    if (filter) {
      query = Model.findOne(filter);
    }
    // Search by id if present
    else if (id) {
      query = Model.findOne({ _id: id });
    }
    // Search by slug if present
    else if (slug) {
      query = Model.findOne({ slug });
    }
    // Neither id nor slug provided
    else {
      return res.status(400).json({
        status: "Fail",
        message: "Please provide an id or slug",
      });
    }

    // Apply population if provided
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;

    if (!document) {
      return res.status(404).json({
        status: "Fail",
        message: "Document not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: document,
    });
  });
export const getAll = (Model, config = {}) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model, req.query)
      .filter()
      .search()
      .attributes()
      .variants()
      .sort()
      .limitFields()
      .paginate();

    const result = await features.execute(Model, config);

    res.status(200).json({
      status: "Success",
      results: result.documents.length,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.documents,
    });
  });

export const softDeleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Model.findByIdAndUpdate(id, { isDeleted: true });

    res.status(204).json({
      status: "Success",
      data: null,
    });
  });
