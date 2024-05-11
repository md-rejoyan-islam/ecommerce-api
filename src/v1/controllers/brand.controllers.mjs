import brandModel from "../../models/brand.model.mjs";
import { createError } from "../../utils/createError.js";

import { unlinkSync } from "fs";
import { isValidObjectId } from "mongoose";

import asyncHandler from "express-async-handler";
import { successResponse } from "../services/responseHandler.mjs";

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

export const addBrand = asyncHandler(async (req, res) => {
  const { body, file } = req;

  // all field validation
  if (!body.name || !body.description) {
    // if image uploaded then delete image
    file && unlinkSync(`api/public/images/brands/${file?.filename}`);

    // throw error
    throw createError(400, "All fields are required.");
  }

  // name validation
  const beforeData = await brandModel.findOne({ name: body.name });

  if (beforeData) {
    file && unlinkSync(`api/public/images/brands/${file?.filename}`);
    throw createError(400, "Brand name already exists.");
  }

  // create new brand
  const result = await brandModel.create({
    ...body,
    brand_photo: req?.file?.filename,
  });

  // response with result
  res.status(201).json({
    Status: "Success",
    Message: "Added a new brand",
    Data: result,
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
export const singleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // id validation
  if (!isValidObjectId(id)) throw createError(400, "Invalid brand id.");

  // data validation
  const beforeData = await brandModel.findById(id);
  if (!beforeData) throw createError(404, "Brand not found.");

  // find single brand
  const result = await brandModel.findById(id);

  // response with result
  res.status(201).json({
    Status: "Success",
    Message: "Single brand product",
    Data: result,
  });
  // try {
  //   const { id } = req.params;

  //   // id validation
  //   if (!isValidObjectId(id)) throw createError(400, "Invalid brand id.");

  //   // data validation
  //   const beforeData = await brandModel.findById(id);
  //   if (!beforeData) throw createError(404, "Brand not found.");

  //   // find single brand
  //   const result = await brandModel.findById(id);

  //   // response with result
  //   res.status(201).json({
  //     Status: "Success",
  //     Message: "Single brand product",
  //     Data: result,
  //   });
  // } catch (error) {
  //   next(error);
  // }
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
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // id validation
  if (!isValidObjectId(id)) throw createError(400, "Invalid brand id.");

  // data validation
  const beforeData = await brandModel.findById(id);
  if (!beforeData) throw createError(404, "Brand not found.");

  // brand delete
  const result = await brandModel.findByIdAndDelete(id);

  // delete image

  unlinkSync(`api/public/images/brands/${result?.brand_photo}`);

  res.status(201).json({
    Status: "Success",
    Message: "Successfully deleted",
    Data: result,
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
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // id validation
  if (!isValidObjectId(id)) throw createError(400, "Invalid brand id.");

  // data validation
  const beforeData = await brandModel.findById(id);
  if (!beforeData) throw createError(404, "Brand not found.");
  console.log(req.body);
  const options = {
    $set: {
      ...req.body,
      brand_photo: req?.file?.filename,
    },
  };
  const result = await brandModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
  });

  // before image delete
  req?.file?.filename &&
    unlinkSync(`api/public/images/brands/${beforeData?.brand_photo}`);

  res.status(201).json({
    Status: "Success",
    Message: "Successfully Updated",
    Data: result,
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
  if (req.body.ids.length === 0) throw customError(400, "Please Provide ids.");

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
