import asyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import { createError } from "../../utils/createError.js";
import { isValidObjectId } from "mongoose";
import hashPassword from "../../utils/hashPassword.js";
import { successResponse } from "../../v1/services/responseHandler.js";
import checkMongoId from "../../v1/services/checkMongoId.js";
import fs from "fs";
fs.promises;

import findData from "../../v1/services/findData.js";
import deleteImage from "../../helper/deleteImage.js";

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
  // search query
  const search = req.query.search || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  // filters
  const searchRegExp = new RegExp(".*" + search + ".*", "i");

  const filters = {
    isAdmin: { $ne: true },
    $or: [
      { name: { $regex: searchRegExp } },
      { email: { $regex: searchRegExp } },
      { phone: { $regex: searchRegExp } },
    ],
  };

  // options
  const options = {
    password: 0,
  };

  // validate user
  const users = await userModel
    .find(filters, options)
    .limit(limit)
    .skip((page - 1) * limit);

  // count documents
  const count = await userModel.countDocuments();

  if (!users.length) throw createError(404, "couldn't find any user data");

  // pagination
  const pagination = {
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previousPage: page - 1 > 0 ? page - 1 : null,
    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
  };

  // response
  return successResponse(res, {
    statusCode: 200,
    message: "User data fetched successfully",
    payload: {
      pagination,
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
  checkMongoId(req.params.id);

  // validate user
  const user = await findData(userModel, { _id: req.params.id });

  // response
  res.status(200).json({
    Status: "Success",
    Message: "Single user",
    Data: user,
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
