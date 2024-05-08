import { isValidObjectId } from "mongoose";
import tagModel from "../../models/tag.model.js";
import Tag from "../../models/tag.model.js";
import { createError } from "../../utils/createError.js";

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
export const allTag = async (req, res, next) => {
  try {
    const result = await Tag.find();
    // if result is empty
    if (!result.length) throw createError(404, "Couldn't find any tag data.");

    // response with result
    res.status(200).json({
      Status: "Success",
      Message: "All tags data",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const addTag = async (req, res, next) => {
  try {
    const { body, file } = req;

    // all field validation
    if (!body.name) {
      // throw error
      throw createError(400, "All fields are required.");
    }

    // name validation
    const beforeData = await tagModel.findOne({ name: body.name });

    if (beforeData) {
      throw createError(400, "Tag name already exists.");
    }

    // create new tag
    const result = await tagModel.create({
      ...body,
    });

    // response with result
    res.status(201).json({
      Status: "Success",
      Message: "Added a new Tag",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const singleTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid tag id.");

    // data validation
    const beforeData = await tagModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find ant tag ");

    // find by id
    const result = await Tag.findById(id);

    // response send with data
    res.status(201).json({
      Status: "Success",
      Message: "Single Tag product",
      Data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid tag id.");

    // data validation
    const beforeData = await tagModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find ant tag ");

    // find by id and delete
    const result = await Tag.findByIdAndDelete(id);

    // response send
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
export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    // id validation
    if (!isValidObjectId(id)) throw createError(400, "Invalid tag id.");

    // data validation
    const beforeData = await tagModel.findById(id);
    if (!beforeData) throw createError(404, "Couldn't find ant tag ");
    const options = {
      $set: {
        ...req.body,
      },
    };
    const result = await Tag.findByIdAndUpdate(id, options, {
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

export const bulkDeleteTag = async (req, res, next) => {
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

export const bulkUpdateTag = async (req, res, next) => {
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
