import asyncHandler from "express-async-handler";
import userModel from "../../models/user.model.mjs";
import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import hashPassword from "../../utils/hashPassword.js";
import { successResponse } from "../services/responseHandler.mjs";
import checkMongoID from "../services/checkMongoId.js";
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

  // find user
  const user = await userModel
    .findById(req.params.id)
    .select("-password -__v -role");

  // if user not found
  if (!user) throw createError(404, "Couldn't find any user data.");

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
  // id validation
  checkMongoID(req.params.id);

  // buffer image
  // if (req.file) {
  //   req.body.photo = req.file.buffer.toString("base64");
  // }

  // some data remove from update
  ["role", "isAdmin", "isBanned", "_id", "createdAt", "updatedAt"].forEach(
    (field) => delete req.body[field]
  );

  // update options
  const options = {
    $set: {
      ...req.body,
      photo: req.file && req.file.path,
    },
  };
  // update user
  const updatedUser = await userModel.findByIdAndUpdate(
    req.params.id,
    options,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  // if user not found
  if (!updatedUser) {
    throw createError(404, "Couldn't find any user data.");
  }

  // delete previous image
  if (req.file && updatedUser.photo) {
    deleteImage(updatedUser.photo);
  }

  // response
  successResponse(res, {
    statusCode: 200,
    message: "User data updated successfully",
    payload: {
      data: updatedUser,
    },
  });
});

// delete user
export const deleteUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // // if admin user
  // if (req.me?.role === "admin") {
  //   throw createError(400, "You can't delete admin user.");
  // }

  // delete user
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    throw createError(404, "Couldn't find any user data.");
  }

  // // image delete
  const userImagePath = deletedUser[0]?.photo;

  userImagePath && deleteImage(userImagePath);

  // response
  return successResponse(res, {
    statusCode: 200,
    message: "User deleted successfully",
    payload: {
      data: deletedUser,
    },
  });
});

// ban user by id
export const banUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // find user
  const user = await userModel.findById(req.params.id);

  // if user not found
  if (!user) {
    throw createError(404, "Couldn't find any user data.");
  }

  // if admin user
  if (user.role === "admin") {
    throw createError(400, "You can't ban admin user.");
  }

  // check if user already banned
  if (user.isBanned) {
    throw createError(400, "User is already banned.");
  }

  // update user
  const updatedUser = await userModel.findOneAndUpdate(
    {
      _id: req.params.id,
      role: {
        $ne: "admin",
      },
    },
    { isBanned: true },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  // response
  successResponse(res, {
    statusCode: 200,
    message: "User banned successfully",
    payload: {
      data: updatedUser,
    },
  });
});

// unban user by id
export const unbanUserById = asyncHandler(async (req, res) => {
  // id validation
  checkMongoID(req.params.id);

  // find user
  const user = await userModel.findById(req.params.id);

  // if user not found
  if (!user) {
    throw createError(404, "Couldn't find any user data.");
  }

  // check if user already unbanned
  if (!user.isBanned) {
    throw createError(400, "User is already unbanned.");
  }

  // update user
  const updatedUser = await userModel.findByIdAndUpdate(
    req.params.id,
    { isBanned: false },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  // response
  successResponse(res, {
    statusCode: 200,
    message: "User unbanned successfully",
    payload: {
      data: updatedUser,
    },
  });
});
