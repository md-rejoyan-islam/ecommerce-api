import createError from "http-errors";
import categoryModel from "../../models/category.model.mjs";
import deleteImage from "../../helper/deleteImage.mjs";
import pagination from "../../utils/pagination.mjs";

// get all category service
export const getAllCategoryService = async (req, searchFields) => {
  // query filter
  const {
    queries: { skip, limit, fields, sortBy },
    filters,
  } = filterQuery(req, searchFields);

  // get all category data
  const categories = await categoryModel
    .find(filters)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sortBy)
    .lean()
    .then((categories) => {
      return categories.map((category) => {
        return {
          ...category,
          links: {
            self: `/api/v1/categories/${category.slug}`,
          },
        };
      });
    });

  // category data not found
  if (!categories.length)
    throw createError(404, "Couldn't find any category data.");

  // pagination object
  const paginationObject = await pagination({
    limit,
    page: req.query.page,
    skip,
    model: categoryModel,
    filters,
  });

  return {
    result: categories,
    pagination: paginationObject,
  };
};

// create category service
export const createCategoryService = async (req) => {
  const { body, file } = req;

  // name validation
  const beforeData = await categoryModel.findOne({ name: body.name });

  if (beforeData) {
    file && deleteImage(file.path);
    throw createError(400, "Category name already exists.");
  }

  // create new category
  const category = await categoryModel.create({
    ...body,
    image: req?.file?.filename,
    creator: req.me._id,
  });

  return category;
};

// get category by id service
export const getCategoryByIdService = async (slug) => {
  const category = await categoryModel.findOne({ slug }).lean();

  if (!category) throw createError(404, "Couldn't find any category data.");
  return category;
};

//delete category by id service
export const deleteCategoryByIdService = async (id) => {
  // find and delete data
  const result = await categoryModel.findByIdAndDelete(id).lean();

  if (!result) throw createError(404, "Couldn't find any category data.");

  // delete image
  result.image && deleteImage(`/public/images/categories/${result.image}`);

  return result;
};

// update category by id service
export const updateCategoryByIdService = async (id, options) => {
  const result = await categoryModel
    .findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
      context: "query",
    })
    .lean();

  if (!result) throw createError(404, "Couldn't find any category data.");

  // delete image
  options.$set.image &&
    deleteImage(`/public/images/categories/${result.image}`);

  return result;
};

// multiple categories delete service
export const bulkDeleteCategoryService = async (ids) => {
  // check data is present or not
  await Promise.all(
    ids.map(async (id) => {
      const result = await brandModel.findById(id);
      if (!result)
        throw createError(404, `Couldn't find Brand Data with id = ${id}`);
    })
  );

  const result = await brandModel.deleteMany({ _id: { $in: req.body.ids } });

  // delete image
  result.forEach((category) => {
    category.image &&
      deleteImage(`/public/images/categories/${category?.image}`);
  });

  return result;
};
