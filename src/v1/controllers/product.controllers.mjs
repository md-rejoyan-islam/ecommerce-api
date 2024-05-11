import { isValidObjectId } from "mongoose";
import productModel from "../../models/product.model.mjs";
import createError from "http-errors";

import { unlinkSync } from "fs";
import asyncHandler from "express-async-handler";
import { successResponse } from "../services/responseHandler.mjs";

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
export const allProduct = asyncHandler(async (req, res) => {
  const result = await productModel.find().lean();

  // category data not found
  if (!result.length) throw createError(404, "Couldn't find any product data.");

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
export const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      long_desc,
      short_desc,
      regular_price,
      sale_price,
      categories,
      brand,
      tags,
    } = req.body;

    // all field validation
    if (
      !name ||
      !long_desc ||
      !short_desc ||
      !regular_price ||
      !sale_price ||
      !brand ||
      !tags ||
      !categories
    ) {
      // throw error
      throw createError(400, "All fields are required.");
    }

    // name validation
    const beforeData = await productModel.findOne({ name });

    // if found any error
    let error = {
      status: false,
      msg: "",
    };

    // name validation
    if (beforeData && !error.status) {
      error.status = true;
      error.msg = "Product name already exists.";
    }

    // product image validation
    if (req.files.product_photo[0].size > 400000 && !error.status) {
      error.status = true;
      error.msg = "Maximum image size is 400KB";
    }

    // product gallery image validation
    !error.status &&
      req.files.product_gallery_photo.find((photo) => {
        if (photo.size > 400000) {
          error.status = true;
          error.msg = "Maximum image size is 400KB";
        }
      });

    // error show
    if (error.status) {
      // product photo delete
      unlinkSync(
        `api/public/images/products/${req.files.product_photo[0]?.filename}`
      );
      // gallery photo delete
      req.files.product_gallery_photo.forEach((photo) => {
        unlinkSync(`api/public/images/products/${photo?.filename}`);
      });
      throw createError(400, error.msg);
    }
    // product-photo
    const photo = req.files["product_photo"][0].filename;

    const gallery = [];
    [...req.files["product_gallery_photo"]].forEach((item) =>
      gallery.push(item.filename)
    );

    const result = await productModel.create({
      ...req.body,
      tags: tags.indexOf('"') !== -1 ? JSON.parse(tags) : tags,
      categories:
        categories.indexOf('"') !== -1 ? JSON.parse(categories) : categories,
      product_photo: photo,
      product_gallery_photo: gallery,
    });

    // response send with data
    res.status(201).json({
      Status: "Success",
      Message: "Added new product",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const singleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid product id.");

    // data validation
    const beforeData = await productModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any product data.");

    // category data find by id
    const result = await productModel.findById(id);
    res.status(201).json({
      Status: "Success",
      Message: "Single Product ",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid product id.");

    // data validation
    const beforeData = await productModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any product data.");

    // find by id and delete
    const result = await productModel.findByIdAndDelete(id);

    // images delete
    if (result) {
      // product photo delete
      unlinkSync(`api/public/images/products/${beforeData?.product_photo}`);
      // gallery photo delete
      beforeData?.product_gallery_photo.forEach((filename) => {
        unlinkSync(`api/public/images/products/${filename}`);
      });
    }
    res.status(201).json({
      Status: "Success",
      Message: "Successfully deleted",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid product id.");

    // data validation
    const beforeData = await productModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any product data.");

    console.log(req.body);

    const options = {
      $set: {
        ...req.body,
        product_photo:
          req?.files["product_photo"] &&
          req?.files["product_photo"][0]?.filename,
      },
    };

    const result = await productModel.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });

    if (req.files["product_photo"] && req.files["product_photo"][0]?.filename) {
      // product photo delete
      unlinkSync(`api/public/images/products/${beforeData?.product_photo}`);
    }
    res.status(201).json({
      Status: "Success",
      Message: "Successfully Updated",
      Data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
