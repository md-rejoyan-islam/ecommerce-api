import asyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import hashPassword from "../../utils/hashPassword.js";
import { successResponse } from "../../v1/services/responseHandler.js";
import checkMongoID from "../../v1/services/checkMongoId.js";
import fs from "fs";
fs.promises;

import findData from "../../v1/services/findData.js";
import deleteImage from "../../helper/deleteImage.js";
import filterQuery from "../../utils/filterQuery.js";
import pagination from "../../utils/pagination.js";

/**
 *
 * @apiDescription    Get All Register User Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/users
 * @apiAccess          Private ( Authenticated Role )
 *
 * @apiParams         [ page = number ]     default page = 1
 * @apiParams         [ limit = number ]    min = 1, default = 10
 * @apiParams         [ search query ]
 *
 *
 * @apiSuccess        { success : true , message, pagination , data }
 * @apiFailed         { success : false, error : { status : code , message} }
 * @apiError          ( Not Found 404 )   No Brand data found
 *
 */

export const getAllUsers = asyncHandler(async (req, res) => {
  // search query fields
  const searchFields = ["name", "email", "phone"];

  // query filter
  const {
    queries: { skip, limit, fields, sortBy },
    filters,
  } = filterQuery(req, searchFields);

  // find users data and add links
  const users = await userModel
    .find(filters)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .select("-password -__v")
    .sort(sortBy)
    .then((users) => {
      return users.map((user) => {
        delete user._doc.password;
        delete user._doc.__v;
        return {
          ...user._doc,
          links: {
            self: `/api/v1/users/${user._id}`,
          },
        };
      });
    });

  // if no data found
  if (!users.length) throw createError.NotFound("couldn't find any user data");

  // pagination object
  const paginationObject = await pagination({
    limit,
    page: req.query.page,
    skip,
    model: userModel,
    filters,
  });

  // response
  return successResponse(res, {
    statusCode: 200,
    message: "User data fetched successfully",
    payload: {
      pagination: paginationObject,
      data: users,
    },
  });
});

/**
 *
 * @apiDescription    Find User By ID
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/users/:id
 * @apiAccess          Private ( Authenticated Role )
 *
 * @apiParams         [ ID ]
 *
 * @apiSuccess        { success : true , message, data }
 * @apiFailed         { success : false, error : { status : code , message} }
 * @apiError          ( Not Found 404 )   No Brand data found
 *
 */

export const findUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // validate user
  const user = await userModel.findById(req.params.id).select("-password -__v");

  // validate user
  if (!user) throw createError.NotFound("Couldn't find any user data.");

  // response
  successResponse(res, {
    statusCode: 200,
    message: "Single user data fetched successfully",
    payload: {
      data: user,
    },
  });
});

// create user
export const createUser = asyncHandler(async (req, res) => {
  // validate user
  const user = await userModel.create(req.body);

  // response
  res.status(200).json({
    Status: "Success",
    Message: "User created",
    Data: user,
  });
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // id validation
  if (!isValidObjectId(req.params.id)) {
    throw createError(400, "Invalid id");
  }

  // validate user
  const user = await userModel.find({ email });

  // validate user
  if (!user) {
    throw createError(400, "No user found");
  }

  // if password is provided
  req.body.password && (req.body.password = hashPassword(req.body.password));

  // update options
  const options = {
    $set: {
      ...req.body,
    },
  };
  // update user
  const updatedUser = await userModel.findByIdAndUpdate(
    req.params.id,
    options,
    {
      new: true,
      runValidators: true,
    }
  );

  // response
  res.status(200).json({
    Status: "Success",
    Message: "User updated",
    Data: updatedUser,
  });
});

// delete user
export const deleteUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoId(req.params.id);

  // find user
  const user = await findData(userModel, { _id: req.params.id });

  // image delete
  const userImagePath = user?.photo;

  userImagePath && deleteImage(userImagePath);

  // delete user
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);

  // response
  return successResponse(res, {
    statusCode: 200,
    message: "User deleted successfully",
    payload: {
      data: deletedUser,
    },
  });
});
