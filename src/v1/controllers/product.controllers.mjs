import createError from "http-errors";
import productModel from "../../models/product.model.mjs";

import asyncHandler from "express-async-handler";
import deleteImage from "../../helper/deleteImage.mjs";
import {
  addProductToWishListService,
  bulkDeleteProductService,
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductBySlugService,
  removeProductFromWishListService,
} from "../services/product.service.mjs";
import { successResponse } from "../../helper/responseHandler.mjs";

/**
 *
 * @apiDescription    Get all category  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/category
 * @apiAccess         Public
 *
 * @apiParams         [ page = number ]     default page = 1
 * @apiParams         [ limit = number ]    min = 1, default = 10
 *
 * @apiSuccess        { Status, Message, Result :[Page, TotalCategory, Data:[] ] }
 * @apiFailed         { StatusCode, Message, Stack }
 * @apiError          ( Not Found 404 )   No Brand data found
 *
 */
export const getAllProduct = asyncHandler(async (req, res) => {
  // search query fields
  const searchFields = ["name", "slug", "title", "brand", "category", "tags"];

  // default page and limit value
  req.query.page = Number(req.query.page) || 1;
  req.query.limit = Number(req.query.limit) || 10;

  // find product data
  const { result, pagination } = await getAllProductService(req, searchFields);

  // response send with data
  successResponse(res, {
    statusCode: 200,
    message: "Product data fetched successfully",
    payload: {
      pagination,
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Create a New Category  Data
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/category
 * @apiAccess         Admin
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiSuccess        { Status ,Message, Data= { } }
 * @apiFailed         { Status, Error }
 *
 * @apiError          ( unauthorized 401 )   Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403)  Forbidden Only admins can access the data
 *
 */

export const createProduct = asyncHandler(async (req, res, next) => {
  // product images
  const images = req?.files?.map(
    (file) => file.fieldname === "product_images" && file.filename
  );

  try {
    // create product
    const result = await createProductService(req, images);

    // response send with data
    successResponse(res, {
      statusCode: 201,
      message: "Product data created successfully.",
      payload: {
        data: result,
      },
    });
  } catch (error) {
    // delete images
    for (let image of images) {
      deleteImage(`public/images/products/${image}`);
    }

    throw error;
  }
});

/**
 *
 * @apiDescription    Get  a Single Category  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/category/:id
 * @apiAccess         Owner/Admin
 *
 * @apiHeaders        { string } Authorization   User's/ Admin's access token
 *
 * @apiSuccess        { Status, Message, Data:{ } }
 * @apiFailed         { StatusCode, Message, Stack }
 *
 * @apiError          ( Bad Request 400 )    Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )   Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )      Forbidden Only admins and owner can access the data
 * @apiError          ( Not Found 404 )      Category Data not found
 *
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  // data validation
  const result = await getProductBySlugService(req.params.slug);

  successResponse(res, {
    statusCode: 200,
    message: "Product data fetched successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Delete a Single Category  Data
 * @apiMethod         DELETE
 *
 * @apiRoute          /api/v1/category/:id
 * @apiAccess         Admin/ Owner
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiParams         { ObjectId }
 *
 * @apiSuccess        { Status ,Message, Data:{ } }
 * @apiFailed         { StatusCode, Message, Stack }
 *
 * @apiError          ( Bad Request 400 )     Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )    Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )       Forbidden Only admins can access the data
 * @apiError          ( Not Found 404 )       Category Data not found
 *
 */
export const deleteProductBySlug = asyncHandler(async (req, res, next) => {
  // find by id and delete
  const result = await deleteProductService(req.params.slug);

  successResponse(res, {
    statusCode: 200,
    message: "Product data deleted successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Update a Single Category  Data
 * @apiMethod         PUT / PATCH
 *
 * @apiRoute          /api/v1/category/:id
 * @apiAccess         Admin/ Owner
 *
 * @apiParams         { ObjectId }
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiSuccess        { Status ,Message, Data:{ } }
 * @apiFailed         { StatusCode, Message, Stack }
 *
 * @apiError          ( Bad Request 400 )    Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )   Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )      Forbidden Only admins can access the data
 * @apiError          ( Not Found 404 )      Category Data not found
 *
 */
export const updateProductBySlug = asyncHandler(async (req, res) => {
  // product images
  const images = req?.files?.map(
    (file) => file.fieldname === "product_images" && file.filename
  );

  // before update product data
  const product = await productModel.findOne({ slug: req.params.slug });

  const options = {
    $set: {
      ...req.body,
      price: {
        regular: req.body?.price?.regular || product.price.regular,
        sale: req.body?.price?.sale || product.price.sale,
      },
      shipping: {
        type: req.body?.shipping?.type || product?.shipping?.type,
        fee: req.body?.shipping?.fee || product?.shipping?.fee,
      },
      description: {
        short: req.body?.description?.short || product.description.short,
        long: req.body?.description?.long || product.description.long,
      },
      images: images?.length ? images : product.images ? product.images : "",
    },
  };

  const result = await productModel.findOneAndUpdate(
    { slug: req.params.slug },
    options,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  if (!result) throw createError(404, "Couldn't find any product data.");

  // delete product photo
  // if (images.length) {
  //   deleteImage(`public/images/products/${result.images}`);
  // }

  successResponse(res, {
    statusCode: 200,
    message: "Product data updated successfully.",
    payload: {
      data: result,
    },
  });
});

// bulk delete product by ids
export const bulkDeleteProductByIds = asyncHandler(async (req, res) => {
  // ids validation
  if (!req.body.ids) throw createError(404, "Please Provide ids.");

  // has ids or not
  if (!req.body.ids.length) throw createError(404, "Please Provide ids.");

  //   id validation
  const result = await bulkDeleteProductService(req.body.ids);

  successResponse(res, {
    statusCode: 200,
    message: "Product data deleted successfully.",
    payload: {
      data: result,
    },
  });
});

// product add to wishlist
export const addProductToWishList = asyncHandler(async (req, res) => {
  // prdocut add to wishlist
  await addProductToWishListService(req);

  successResponse(res, {
    statusCode: 200,
    message: "Product added to wishlist successfully.",
    payload: {
      data: req.me,
    },
  });
});

// product remove from wishlist
export const removeProductFromWishList = asyncHandler(async (req, res) => {
  await removeProductFromWishListService(req);

  successResponse(res, {
    statusCode: 200,
    message: "Product removed from wishlist successfully.",
    payload: {
      data: req.me,
    },
  });
});
