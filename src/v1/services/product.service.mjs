import { isValidObjectId } from "mongoose";
import brandModel from "../../models/brand.model.mjs";
import categoryModel from "../../models/category.model.mjs";
import productModel from "../../models/product.model.mjs";
import tagModel from "../../models/tag.model.mjs";
import deleteImage from "../../helper/deleteImage.mjs";
import filterQuery from "../../utils/filterQuery.mjs";
import pagination from "../../utils/pagination.mjs";
import createError from "http-errors";
import e from "express";

// get all product service
export const getAllProductService = async (req, searchFields) => {
  // query filter
  const {
    queries: { skip, limit, fields, sortBy },
    filters,
  } = filterQuery(req, searchFields);

  const result = await productModel
    .find(filters)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sortBy)
    .populate("brand category tags")
    .lean()
    .then((products) => {
      return products.map((product) => {
        return {
          ...product,
          links: {
            self: `/api/v1/products/${product.slug}`,
            "add-to-card": `/api/v1/products/add-to-card/${product.slug}`,
          },
        };
      });
    });

  // product data not found
  if (!result.length) throw createError(404, "Couldn't find any product data.");

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

// create product service
export const createProductService = async (req, images) => {
  const { brand, category, tags } = req.body;

  // brand id check &  data is exist or not
  if (!isValidObjectId(brand)) throw createError(400, "Brand id is not valid.");
  const brandData = await brandModel.exists({ _id: brand });
  if (!brandData) throw createError(404, "Brand data not found.");

  // categories id check &  data is exist or not
  if (!isValidObjectId(category))
    throw createError(400, "Category id is not valid.");
  const categoryData = await categoryModel.exists({ _id: category });
  if (!categoryData) throw createError(404, "Category data not found.");

  // tags id check &  data is exist or not
  for (let tag of tags) {
    if (!isValidObjectId(tag)) {
      throw createError(400, "Tag id is not valid.");
    }
    // data is exist or not
    const result = await tagModel.exists({ _id: tag });
    if (!result) throw createError(404, "Tag data not found.");
  }

  // create product
  const result = await productModel.create({
    images,
    ...req.body,
    creator: req.me._id,
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
export const deleteProductService = async (slug) => {
  // find by id and delete
  const result = await productModel.findOneAndDelete({ slug }).lean();
  if (!result) throw createError(404, "Couldn't find any product data.");

  // delete images
  result.images.forEach((filename) => {
    deleteImage(`/public/images/products/${filename}`);
  });

  return result;
};

// bulk delete product service
export const bulkDeleteProductService = async (ids) => {
  // check data is present or not
  await Promise.all(
    ids.map(async (id) => {
      const result = await productModel.findById(id);
      if (!result)
        throw createError(404, `Couldn't find Product Data with id = ${id}`);
    })
  );

  const result = await productModel.deleteMany({ _id: { $in: ids } });

  // delete image
  result.forEach((product) => {
    product.images.forEach((filename) => {
      deleteImage(`/public/images/products/${filename}`);
    });
  });

  return result;
};

// product add to wishlist service
export const addProductToWishListService = async (req) => {
  // find product by id
  const product = await productModel.exists({ _id: req.params.id });
  if (!product) throw createError(404, "Couldn't find any product data.");

  // check product is already in wishlist or not
  if (req.me.wishList.includes(req.params.id)) {
    throw createError(400, "Product is already in your wishlist.");
  }

  // add product to wishlist
  product.wishList.push(req.params.id);
  await req.me.save();
};

// product remove from wishlist servic
export const removeProductFromWishListService = async (req) => {
  // product exists or not
  const product = await productModel.exists({ _id: req.params.id });
  if (!product) throw createError(404, "Couldn't find any product data.");

  // check product is already in wishlist or not
  if (!req.me.wishList.includes(req.params.id)) {
    throw createError(400, "Product is not in your wishlist.");
  }

  // remove product from wishlist
  product.wishList = product.wishList.filter(
    (id) => id.toString() !== req.params.id
  );
  await req.user.save();
};
