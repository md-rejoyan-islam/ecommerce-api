import asyncHandler from "express-async-handler";
import createError from "http-errors";
import categoryModel from "../../models/category.model.mjs";
import deleteImage from "../../helper/deleteImage.js";

// get all category service
export const getAllCategoryService = asyncHandler(async () => {
  // get all category data
  const categories = await categoryModel.find({}).lean();

  // category data not found
  if (!categories.length || categories.length === 0) {
    throw createError(404, "Couldn't find any category data.");
  }

  return categories;
});

// create category service
export const createCategoryService = asyncHandler(async (req) => {
  const { body, file } = req;

  console.log(file);
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
  });

  return category;
});

// get category by id service
export const getCategoryByIdService = asyncHandler(async (slug) => {
  const category = await categoryModel.findOne({ slug }).lean();

  if (!category) throw createError(404, "Couldn't find any category data.");
  return category;
});

//delete category by id service
export const deleteCategoryByIdService = asyncHandler(async (id) => {
  // find and delete data
  const result = await categoryModel.findByIdAndDelete(id).lean();

  if (!result) throw createError(404, "Couldn't find any category data.");

  return result;
});

// update category by id service
export const updateCategoryByIdService = asyncHandler(async (id, options) => {
  const result = await categoryModel
    .findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
      context: "query",
    })
    .lean();

  if (!result) throw createError(404, "Couldn't find any category data.");

  return result;
});
