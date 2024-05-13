import mongoose, { isValidObjectId } from "mongoose";
import productModel from "../../models/product.model.mjs";
import createError from "http-errors";

import { unlinkSync } from "fs";
import asyncHandler from "express-async-handler";
import { successResponse } from "../services/responseHandler.mjs";
import checkMongoID from "../services/checkMongoId.mjs";
import deleteImage from "../../helper/deleteImage.mjs";
import { log } from "console";
import brandModel from "../../models/brand.model.mjs";
import categoryModel from "../../models/category.model.mjs";
import tagModel from "../../models/tag.model.mjs";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductBySlugService,
} from "../services/product.service.mjs";

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
export const getAllProduct = asyncHandler(async (_, res) => {
  const result = await getAllProductService();

  // response send with data
  successResponse(res, {
    statusCode: 200,
    message: "Product data fetched successfully",
    payload: {
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
export const deleteProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // id validation
  checkMongoID(id);

  // find by id and delete
  const result = await deleteProductService(id);

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
export const updateProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // id validation
  checkMongoID(id);

  const options = {
    $set: {
      ...req.body,
      images:
        req?.files["product_photo"] && req?.files["product_photo"][0]?.filename,
    },
  };

  const result = await productModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!result) throw createError(404, "Couldn't find any product data.");

  if (req.files["product_photo"] && req.files["product_photo"][0]?.filename) {
    // product photo delete
    unlinkSync(`api/public/images/products/${beforeData?.product_photo}`);
  }

  successResponse(res, {
    statusCode: 200,
    message: "Product data updated successfully.",
    payload: {
      data: result,
    },
  });
});
