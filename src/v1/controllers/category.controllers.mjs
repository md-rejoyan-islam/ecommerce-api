import asyncHandler from "express-async-handler";
import categoryModel from "../../models/category.model.mjs";
import Category from "../../models/category.model.mjs";
import { createError } from "../../utils/createError.js";

import { unlinkSync } from "fs";
import { isValidObjectId } from "mongoose";
import {
  createCategoryService,
  deleteCategoryByIdService,
  getAllCategoryService,
  getCategoryByIdService,
  updateCategoryByIdService,
} from "../services/category.service.mjs";
import { successResponse } from "../services/responseHandler.mjs";
import { log } from "console";
import checkMongoID from "../services/checkMongoId.js";

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

export const getAllCategories = asyncHandler(async (_, res) => {
  const categories = await getAllCategoryService();

  // respond send with data
  successResponse(res, {
    statusCode: 200,
    message: "Category data fetched successfully",
    payload: {
      data: categories,
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
export const createCategory = asyncHandler(async (req, res) => {
  const category = await createCategoryService(req);

  // response with result
  successResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    payload: {
      data: category,
    },
  });
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
export const getCategoryById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // data validation
  const category = await getCategoryByIdService(req.params.id);

  // response send with json data
  successResponse(res, {
    statusCode: 200,
    message: "Category data fetched successfully",
    payload: {
      data: category,
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
export const deleteCategoryById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // find and delete data
  const result = await deleteCategoryByIdService(req.params.id);

  // response send with data
  successResponse(res, {
    statusCode: 200,
    message: "Category data deleted successfully",
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
export const updateCategoryById = asyncHandler(async (req, res, next) => {
  // id validation
  checkMongoID(req.params.id);

  const options = {
    $set: {
      ...req.body,
      image: req?.file?.filename,
      slug: req.body.name && req.body.name.toLowerCase().split(" ").join("-"),
    },
  };
  const result = await updateCategoryByIdService(req.params.id, options);

  // response send with data
  successResponse(res, {
    statusCode: 200,
    message: "Category data updated successfully",
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

export const bulkDeleteCategory = asyncHandler(async (req, res, next) => {
  // has ids or not
  if (req.body.ids.length === 0) throw customError(400, "Please Provide ids.");

  //   id validation
  req.body.ids.forEach((id) => {
    if (!isValidObjectId(brand.id))
      throw customError(400, `${brand.id} is not a valid id.`);
  });

  // check data is present or not
  await Promise.all(
    req.body.ids.map(async (id) => {
      const result = await Brand.findById(id);
      if (!result)
        throw customError(404, `Couldn't find Brand Data with id = ${id}`);
    })
  );

  const result = await bulkDeleteBrandService(req.body.ids);

  //  respond send with data
  successResponse(res, {
    statusCode: 200,
    message: "Category data deleted successfully",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Update multiple Brand  Data by ids
 * @apiMethod         PUT / PATCH
 *
 * @apiAccess         Admin
 *
 * @apiHeaders        { string } Authorization   User's access token
 *
 * @apiBody           { brands :[ {id:"id1",data:{ data } }, { id:"id2",data:{ data} } ]  }
 *
 * @apiSuccess        { Status ,Message, Data:[] }
 * @apiFailed         { StatusCode, Message, Stack }
 *
 * @apiError          ( Bad Request 400 )    Invalid syntax / parameters
 * @apiError          ( unauthorized 401 )    Unauthorized Only authenticated users can access the data
 * @apiError          ( Forbidden 403 )       Forbidden Only admins can access the data
 * @apiError          ( Not Found 404 )       Brand Data not found
 *
 */

export const bulkUpdateCategory = asyncHandler(async (req, res, next) => {
  // has ids or not
  if (req.body.brands.length === 0)
    throw customError(400, "Please Provide brands");

  //   id validation
  req.body.brands.forEach((brand) => {
    if (!isValidObjectId(brand.id))
      throw customError(400, `${brand.id} is not a valid id.`);
  });

  // check data is present or not
  await Promise.all(
    req.body.brands.map(async (brand) => {
      const result = await Brand.findById(brand.id);
      if (!result)
        throw customError(
          404,
          `Couldn't find Brand Data with id = ${brand.id}`
        );
    })
  );

  const result = await bulkUpdateBrandService(req.body.brands);

  //  respond send with data
  successResponse(res, {
    statusCode: 200,
    message: "Category data updated successfully",
    payload: {
      data: result,
    },
  });
});
