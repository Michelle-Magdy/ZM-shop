import APIFeatures from "../util/apiFeatures.js";
import catchAsync from "../util/catchAsync.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Model.findByIdAndDelete(id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const update = req.body;
    const updatedDocument = await Model.findByIdAndUpdate(id, update, {
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
    console.log("cat", object);

    const newDocument = await Model.create(object ? object : req.body);

    res.status(201).json({
      status: "Success",
      data: {
        document: newDocument,
      },
    });
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return res.status(404).json({
        status: "Fail",
        message: "document not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        document,
      },
    });
  });

export const getAll = (Model, config = {}) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(config), req.query);
    const documents = await features.executeAll();

    res.status(200).json({
      status: "Success",
      results: documents.length,
      data: {
        documents,
      },
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
