import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import checkMongoID from "../../helper/checkMongoId.mjs";
import { successResponse } from "../../helper/responseHandler.mjs";
import {
  bulkDeleteTagService,
  createTagService,
  deleteTagServiceById,
  getAllTagService,
  getTagBySlugService,
  updateTagServiceById,
} from "../services/tag.service.mjs";

/**
 *
 * @apiDescription    Get all tag  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/tag
 * @apiAccess         Public
 *
 * @apiParams         [ page = number ]     default page = 1
 * @apiParams         [ limit = number ]    min = 1, default = 10
 *
 * @apiSuccess        { Status, Message, Result :[Page, TotalTag, Data:[] ] }
 * @apiFailed         { StatusCode, Message, Stack }
 * @apiError          ( Not Found 404 )   No tag data found
 *
 */
export const getAllTag = asyncHandler(async (req, res) => {
  // search query fields
  const searchFields = ["name", "slug", "_id"];

  // default page and limit value
  req.query.page = Number(req.query.page) || 1;
  req.query.limit = Number(req.query.limit) || 10;

  const { result, pagination } = await getAllTagService(req, searchFields);

  // response with result
  successResponse(res, {
    statusCode: 200,
    message: "Tag data fetched successfully.",
    payload: {
      pagination,
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Create a New tag  Data
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/tag
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
export const createTag = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;

  // create new tag
  const result = await createTagService(name, slug, req.me._id);

  // response with result
  successResponse(res, {
    statusCode: 201,
    message: "Tag created successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Get  a Single tag  Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/tag/:id
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
 * @apiError          ( Not Found 404 )      tag Data not found
 *
 */
export const getTagBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // data validation
  const result = await getTagBySlugService(slug);

  // response send with data
  successResponse(res, {
    statusCode: 200,
    message: "Tag data fetched successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Delete  tag  Data by id
 * @apiMethod         DELETE
 *
 * @apiBody
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
 * @apiError          ( Not Found 404 )       tag Data not found
 *
 */
export const deleteTagById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // id validation
  checkMongoID(id);

  // find by id and delete
  const result = await deleteTagServiceById(id);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Tag data deleted successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Update a Single tag  Data
 * @apiMethod         PUT / PATCH
 *
 * @apiRoute          /api/v1/tag/:id
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
 * @apiError          ( Not Found 404 )      tag Data not found
 *
 */
export const updateTagById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // id validation
  checkMongoID(id);

  const options = {
    $set: {
      name: req.body.name,
      slug: req.body.name && req.body.name.toLowerCase().split(" ").join("-"),
    },
  };
  const result = await updateTagServiceById(id, options);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Tag data updated successfully.",
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

export const bulkDeleteTag = async (req, res, next) => {
  // id validation
  if (!req.body.ids) throw createError(404, "Please Provide ids.");

  // has ids or not
  if (!req.body.ids.length) throw createError(400, "Please Provide ids.");

  //   id validation
  req.body.ids.forEach((id) => {
    if (!isValidObjectId(id))
      throw createError(400, `${id} is not a valid id.`);
  });

  const result = await bulkDeleteTagService(req.body.ids);

  //  respond send with data
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Deleted Data.",
    payload: {
      result,
    },
  });
};
