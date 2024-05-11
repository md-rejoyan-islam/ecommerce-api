import brandModel from "../../models/brand.model.mjs";
import createError from "http-errors";

import { isValidObjectId } from "mongoose";

import asyncHandler from "express-async-handler";
import { successResponse } from "../services/responseHandler.mjs";
import deleteImage from "../../helper/deleteImage.js";
import checkMongoID from "../services/checkMongoId.js";

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
  const result = await brandModel.find().lean();

  // if result is empty
  if (!result.length) throw createError(404, "Couldn't find any brand data.");

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All brands data fetch successfully.",
    payload: {
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
  const { body, file } = req;

  const { name, description, slug } = req.body;

  // name validation
  const beforeData = await brandModel.findOne({ name });

  if (beforeData) {
    deleteImage(`/public/images/brands/${file.filename}`);
    throw createError(400, "Brand name already exists.");
  }

  // create new brand
  const result = await brandModel.create({
    name,
    description,
    slug,
    image: req?.file?.filename,
  });

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
  const { slug } = req.params;

  // data validation
  const result = await brandModel.findOne({ slug });
  if (!result) throw createError(404, "Couldn't find any brand data.");

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
  const result = await brandModel.findByIdAndDelete(req.params.id);

  // if brand data not found
  if (!result) throw createError(404, "Couldn't find any brand data.");

  // delete image
  deleteImage(`/public/images/brands/${result?.brand_photo}`);

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
      slug: req.body.slug,
      description: req.body.description,
      image: req.file && req?.file?.filename,
    },
  };
  const result = await brandModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
  });

  // if brand data not found
  if (!result) throw createError(404, "Couldn't find any brand data.");

  // before image delete
  req?.file?.filename && deleteImage(`/public/images/brands/${result?.image}`);

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

export const bulkDeleteBrand = asyncHandler(async (req, res) => {
  // has ids or not
  if (req.body.ids.length === 0) throw customError(404, "Please Provide ids.");

  //   id validation
  req.body.ids.forEach((id) => {
    if (!isValidObjectId(id))
      throw customError(400, `${id} is not a valid id.`);
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
  res.status(200).json({
    Status: "Success",
    Message: "Successfully Deleted Data.",
    Data: result,
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

export const bulkUpdateBrand = asyncHandler(async (req, res) => {
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
  res.status(200).json({
    Status: "Success",
    Message: "Successfully Updated Data.",
    Data: result,
  });
});
