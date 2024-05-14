import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
import {
  bulkDeleteBrandService,
  createBrandService,
  deleteBrandServiceById,
  getAllBrandService,
  getBrandServiceBySlug,
  updateBrandServiceById,
} from "../services/brand.service.mjs";
import checkMongoID from "../../helper/checkMongoId.mjs";
import { successResponse } from "../../helper/responseHandler.mjs";

/**
 *
 * @apiDescription    Get all brand  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/brand
 * @apiAccess         Public
 *
 * @apiParams         [ page = number ]     default page = 1
 * @apiParams         [ limit = number ]    min = 1, default = 10
 *
 * @apiSuccess        { Status, Message, Result :[Page, TotalBrand, Data:[] ] }
 * @apiFailed         { StatusCode, Message, Stack }
 * @apiError          ( Not Found 404 )   No Brand data found
 *
 */
export const getAllBrand = asyncHandler(async (req, res) => {
  // search query fields
  const searchFields = ["name", "slug", "description", "_id"];

  // default page and limit value
  req.query.page = Number(req.query.page) || 1;
  req.query.limit = Number(req.query.limit) || 10;

  const { result, pagination } = await getAllBrandService(req, searchFields);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All brands data fetch successfully.",
    payload: {
      pagination,
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Create a New brand  Data
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/brand
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

export const createBrand = asyncHandler(async (req, res) => {
  // create new brand
  const result = await createBrandService(req);

  // response with result
  successResponse(res, {
    statusCode: 201,
    message: "Brand data created successfully",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Get  a Single brand  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/brand/:id
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
 * @apiError          ( Not Found 404 )      brand Data not found
 *
 */
export const getBrandBySlug = asyncHandler(async (req, res) => {
  const result = await getBrandServiceBySlug(req.params.slug);

  // response with result
  successResponse(res, {
    statusCode: 200,
    message: "Brand data fetch successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Delete multiple Brand  Data by id
 * @apiMethod         DELETE
 *
 * @apiBody           { ids : [id1,id2,id3]  }
 * @apiAccess         Admin
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiParams         { ObjectId }
 *
 * @apiSuccess        { Status ,Message, Data:[] }
 * @apiFailed         { Status, Error }
 *
 * @apiError          ( Bad Request 400 )    Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )    Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )       Forbidden Only admins can access the data
 * @apiError          ( Not Found 404 )       Brand Data not found
 *
 */
export const deleteBrandById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // brand delete
  const result = await deleteBrandServiceById(req.params.id);

  successResponse(res, {
    statusCode: 200,
    message: "Brand data delete successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Update a Single brand  Data
 * @apiMethod         PUT / PATCH
 *
 * @apiRoute          /api/v1/brand/:id
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
 * @apiError          ( Not Found 404 )      brand Data not found
 *
 */
export const updateBrandById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // data validation
  const options = {
    $set: {
      name: req.body.name,
      slug: req.body.name && req.body.name.toLowerCase().split(" ").join("-"),
      description: req.body.description,
      image: req.file && req?.file?.filename,
    },
  };
  const result = await updateBrandServiceById(
    req?.file?.filename,
    req.params.id,
    options
  );

  successResponse(res, {
    statusCode: 200,
    message: "Successfully update.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Delete multiple Brand  Data by id
 * @apiMethod         DELETE
 *
 * @apiBody           { ids : [id1,id2,id3]  }
 * @apiAccess         Admin
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiParams         { ObjectId }
 *
 * @apiSuccess        { Status ,Message, Data:[] }
 * @apiFailed         { Status, Error }
 *
 * @apiError          ( Bad Request 400 )    Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )    Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )       Forbidden Only admins can access the data
 * @apiError          ( Not Found 404 )       Brand Data not found
 *
 */

export const bulkDeleteBrandByIds = asyncHandler(async (req, res) => {
  // ids validation
  if (!req.body.ids) throw createError(404, "Please Provide ids.");

  // has ids or not
  if (req.body.ids.length === 0) throw createError(404, "Please Provide ids.");

  //   id validation
  req.body.ids.forEach((id) => {
    if (!isValidObjectId(id))
      throw createError(400, `${id} is not a valid id.`);
  });

  const result = await bulkDeleteBrandService(req.body.ids);

  //  respond send with data
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Deleted Data.",
    payload: {
      data: result,
    },
  });
});
