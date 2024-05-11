import asyncHandler from "express-async-handler";
import { isValidObjectId } from "mongoose";
import checkMongoID from "../services/checkMongoId.mjs";
import { successResponse } from "../services/responseHandler.mjs";
import {
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
export const getAllTag = asyncHandler(async (req, res, next) => {
  const result = await getAllTagService();

  // response with result
  successResponse(res, {
    statusCode: 200,
    message: "Tag data fetched successfully.",
    payload: {
      result,
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
  const result = await createTagService(name, slug);

  // response with result
  successResponse(res, {
    statusCode: 201,
    message: "Tag created successfully.",
    payload: {
      result,
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
      result,
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
      result,
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
      result,
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

export const bulkDeleteTag = asyncHandler(async (req, res, next) => {
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
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Deleted Data.",
    payload: {
      result,
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
