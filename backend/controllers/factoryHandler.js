import { redis } from "../redis/client.js";
import { getKey } from "../redis/keyHelper.js";
import APIFeatures from "../util/apiFeatures.js";
import catchAsync from "../util/catchAsync.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({
        status: "Fail",
        message: "Document not found",
      });
    }

    await redis.del(getKey(Model.modelName, id));

    res.status(204).json({
      status: "Success",
      data: null,
    });
  });

export const updateOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const { slug, id } = req.params;
    const update = req.body;

    let filter, redisKey;

    if (id) {
      filter = { _id: id };
      redisKey = getKey(Model.modelName, id);
    } else {
      filter = { slug: slug };
      redisKey = getKey(Model.modelName, slug);
    }

    const updatedDocument = await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({
        status: "Fail",
        message: "Document not found",
      });
    }

    if (redisKey)
      await redis.del(redisKey)

    if (options.afterUpdate) {
      await options.afterUpdate(updatedDocument, req);
    }

    res.status(200).json({
      status: "Success",
      data: {
        document: updatedDocument,
      },
    });
  });

export const createOne = (Model, object = null, options={}) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(object ? object : req.body);
    if(options.afterCreate && newDocument)
      await options.afterCreate(newDocument);

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
    let query, cachedValue, redisKey;

    // If custom filter is provided, use it
    if (filter) {
      query = Model.findOne(filter);
    }

    // Search by id if present
    else if (id) {
      if (!populateOptions) {
        redisKey = getKey(Model.modelName, id);
        cachedValue = await redis.get(redisKey);
      }

      if (!cachedValue)
        query = Model.findById(id);
    }
    // Search by slug if present
    else if (slug) {
      if (!populateOptions) {
        redisKey = getKey(Model.modelName, slug);
        cachedValue = await redis.get(redisKey);
      }

      if (!cachedValue)
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

    let document;

    if (!cachedValue) {
      document = await query;

      if (!document) {
        return res.status(404).json({
          status: "Fail",
          message: "Document not found",
        });
      }

      if (redisKey) {
        await redis.setEx(redisKey, 3600, JSON.stringify(document));
      }
    } else {
      document = JSON.parse(cachedValue);
    }

    res.status(200).json({
      status: "Success",
      data: document,
    });
  });

export const getAll = (Model, config = {}) =>
  catchAsync(async (req, res, next) => {
    const { populateOptions, extraSelections, ...baseFilter } = config;
    const features = new APIFeatures(Model, req.query)
      .filter()
      .search()
      .attributes()
      .variants()
      .sort()
      .limitFields()
      .paginate();

    if (populateOptions) features.populate(populateOptions);

    if (extraSelections) features.extraSelect(extraSelections);

    const result = await features.execute(Model, baseFilter);

    res.status(200).json({
      status: "Success",
      results: result.documents.length,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.documents,
    });
  });

export const softDeleteOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const { id, slug } = req.params;
    let document;
    if (id) {
      document = await Model.findByIdAndUpdate(id, { isDeleted: true });
      await redis.del(getKey(Model.modelName, id));
    } else {
      document = await Model.findOneAndUpdate({ slug }, { isDeleted: true });
      await redis.del(getKey(Model.modelName, slug));
    }

    if(options.afterDelete)
      await options.afterDelete(document)

    res.status(204).json({
      status: "Success",
      data: null,
    });
  });
