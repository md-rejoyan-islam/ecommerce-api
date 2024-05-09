import asyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import hashPassword from "../../utils/hashPassword.js";
import { successResponse } from "../../v1/services/responseHandler.js";
import checkMongoID from "../../v1/services/checkMongoId.js";
import fs from "fs";
fs.promises;

import deleteImage from "../../helper/deleteImage.js";
import filterQuery from "../../utils/filterQuery.js";
import pagination from "../../utils/pagination.js";
import findData from "../services/findData.js";

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
  const user = await findData({
    model: userModel,
    filter: { _id: req.params.id },
    options: { password: 0, __v: 0, role: 0 },
  });

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
export const updateUserById = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // id validation

  checkMongoID(req.params.id);

  // validate user
  const user = await userModel.findById(req.params.id);

  // validate user
  if (!user) {
    throw createError(404, "Couldn't find any user data.");
  }

  // // if password is provided
  // req.body.password && (req.body.password = hashPassword(req.body.password));

  console.log(req.file);

  // image update
  if (req.file) {
    req.body.photo = req.file.path;
  }

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

  // delete previous image
  if (req.file && user.photo) {
    deleteImage(user.photo);
  }

  // response
  successResponse(res, {
    statusCode: 200,
    message: "User data updated successfully",
    payload: {
      data: updatedUser,
    },
  });
  // res.status(200).json({
  //   Status: "Success",
  //   Message: "User updated",
  //   Data: updatedUser,
  // });
});

// delete user
export const deleteUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // find user
  const user = await findData({
    model: userModel,
    filter: { _id: req.params.id },
  });

  // if admin user
  if (user[0]?.role === "admin") {
    throw createError(400, "You can't delete admin user.");
  }

  // image delete
  const userImagePath = user[0]?.photo;

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
