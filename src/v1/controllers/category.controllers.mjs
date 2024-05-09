import { log } from "console";
import categoryModel from "../../models/category.model.mjs";
import Category from "../../models/category.model.mjs";
import { createError } from "../../utils/createError.js";

import { unlinkSync } from "fs";
import { isValidObjectId } from "mongoose";

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

export const allCategories = async (req, res, next) => {
  try {
    // get all category data
    const result = await Category.find();

    // category data not found
    if (!result.length)
      throw createError(404, "Couldn't find any category data.");

    // respond send with data
    res.status(200).json({
      Status: "Success",
      Message: "All Categories Data",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const addCategory = async (req, res, next) => {
  try {
    const { body, file } = req;

    // all field validation
    if (!body.name || !body.description) {
      // if image uploaded then delete image
      file && unlinkSync(`api/public/images/categories/${file?.filename}`);

      // throw error
      throw createError(400, "All fields are required.");
    }

    // name validation
    const beforeData = await categoryModel.findOne({ name: body.name });

    if (beforeData) {
      file && unlinkSync(`api/public/images/categories/${file?.filename}`);
      throw createError(400, "Category name already exists.");
    }

    // create new category
    const result = await categoryModel.create({
      ...body,
      category_photo: req?.file?.filename,
    });

    // response with result
    res.status(201).json({
      Status: "Success",
      Message: "Added a new Category",
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
export const singleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid category id.");

    // data validation
    const beforeData = await categoryModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any category data.");

    // category data find by id
    const result = await Category.findById(id);

    // response send with json data
    res.status(201).json({
      Status: "Success",
      Message: "Single category product",
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
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid category id.");

    // data validation
    const beforeData = await categoryModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any category data.");

    // find by id
    const result = await categoryModel.findByIdAndDelete(id);

    // response send with data
    res.status(201).json({
      Status: "Success",
      Message: "Deleted a category",
      Data: result,
    });
  } catch (error) {
    next(createError(error.message, 400));
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
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid category id.");

    // data validation
    const beforeData = await categoryModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find any category data.");
    const options = {
      $set: {
        ...req.body,
        category_photo_photo: req?.file?.filename,
      },
    };
    const result = await Category.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      Status: "Success",
      Message: "Successfully Updated",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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

export const bulkDeleteCategory = async (req, res, next) => {
  try {
    // has ids or not
    if (req.body.ids.length === 0)
      throw customError(400, "Please Provide ids.");

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
  } catch (error) {
    next(error);
  }
};

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

export const bulkUpdateCategory = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
