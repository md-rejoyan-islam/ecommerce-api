import { isValidObjectId } from "mongoose";
import brandModel from "../../models/brand.model.mjs";
import categoryModel from "../../models/category.model.mjs";
import productModel from "../../models/product.model.mjs";
import tagModel from "../../models/tag.model.mjs";
import deleteImage from "../../helper/deleteImage.mjs";

// get all product service
export const getAllProductService = async () => {
  const result = await productModel.find().lean();

  // product data not found
  if (!result.length) throw createError(404, "Couldn't find any product data.");

  return result;
};

// create product service
export const createProductService = async (req, images) => {
  const { brand, category, tags } = req.body;

  // brand id check &  data is exist or not
  if (!isValidObjectId(brand)) throw createError(400, "Brand id is not valid.");
  const brandData = await brandModel.findById(brand);
  if (!brandData) throw createError(404, "Brand data not found.");

  // categories id check &  data is exist or not
  if (!isValidObjectId(category))
    throw createError(400, "Category id is not valid.");
  const categoryData = await categoryModel.findById(category);
  if (!categoryData) throw createError(404, "Category data not found.");

  // tags id check &  data is exist or not
  for (let tag of tags) {
    if (!isValidObjectId(tag)) {
      throw createError(400, "Tag id is not valid.");
    }
    // data is exist or not
    const result = await tagModel.findById(tag).lean();
    if (!result) throw createError(404, "Tag data not found.");
  }

  // create product
  const result = await productModel.create({
    images,
    ...req.body,
  });

  return result;
};

// get product by slug service
export const getProductBySlugService = async (slug) => {
  const result = await productModel.findOne({ slug }).lean();
  if (!result) throw createError(404, "Couldn't find any product data.");
  return result;
};

// delete product service
export const deleteProductService = async (id) => {
  // find by id and delete
  const result = await productModel.findByIdAndDelete(id).lean();
  if (!result) throw createError(404, "Couldn't find any product data.");

  // delete images
  result.images.forEach((filename) => {
    deleteImage(`/public/images/products/${filename}`);
  });

  return result;
};
