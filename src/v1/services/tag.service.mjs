import createError from "http-errors";
import tagModel from "../../models/tag.model.mjs";
import filterQuery from "../../utils/filterQuery.mjs";
import pagination from "../../utils/pagination.mjs";

// get all tag service
export const getAllTagService = async (req, searchFields) => {
  // query filter
  const {
    queries: { skip, limit, fields, sortBy },
    filters,
  } = filterQuery(req, searchFields);

  const result = await tagModel
    .find(filters)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sortBy)
    .lean()
    .then((tags) => {
      return tags.map((tag) => {
        return {
          ...tag,
          links: {
            self: `/api/v1/tags/${tag.slug}`,
          },
        };
      });
    });

  // if result is empty
  if (!result.length) throw createError(404, "Couldn't find any tag data.");

  // pagination object
  const paginationObject = await pagination({
    limit,
    page: req.query.page,
    skip,
    model: productModel,
    filters,
  });

  return {
    result,
    pagination: paginationObject,
  };
};

// create tag service
export const createTagService = async (name, slug) => {
  // name validation
  const beforeData = await tagModel.findOne({ name }).lean();

  if (beforeData) {
    throw createError(400, "Tag name already exists.");
  }

  // create new tag
  const result = await tagModel.create({
    name,
    slug: slug
      ? slug.toLowerCase().split(" ").join("-")
      : name.toLowerCase().split(" ").join("-"),
  });

  return result;
};

// get tag by slug service

export const getTagBySlugService = async (slug) => {
  // data validation
  const result = await tagModel.findOne({ slug }).lean();
  if (!result) throw createError(404, "Couldn't find ant tag data.");

  return result;
};

// delete tag service
export const deleteTagServiceById = async (id) => {
  // find by id and delete
  const result = await tagModel.findByIdAndDelete(id);
  if (!result) throw createError(404, "Couldn't find any tag data.");

  return result;
};

// update tag service by id
export const updateTagServiceById = async (id, options) => {
  const result = await tagModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!result) throw createError(404, "Couldn't find ant tag data. ");

  return result;
};

// bulk delete tag service
export const bulkDeleteTagService = async (ids) => {
  // check data is present or not
  await Promise.all(
    ids.map(async (id) => {
      const result = await tagModel.exists({ _id: id });
      if (!result)
        throw createError(404, `Couldn't find Brand Data with id = ${id}`);
    })
  );

  const result = await tagModel.deleteMany({ _id: { $in: ids } });

  return result;
};
