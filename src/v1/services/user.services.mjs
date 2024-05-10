import asyncHandler from "express-async-handler";
import createError from "http-errors";
import userModel from "../../models/user.model.mjs";
import deleteImage from "../../helper/deleteImage.js";
import filterQuery from "../../utils/filterQuery.js";
import pagination from "../../utils/pagination.js";

/**
 * @description get all users service
 */
export const getAllUsersService = asyncHandler(async (req, searchFields) => {
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

  // if no user found
  if (!users.length) {
    throw createError(404, "No user data found.");
  }

  // pagination object
  const paginationObject = await pagination({
    limit,
    page: req.query.page,
    skip,
    model: userModel,
    filters,
  });

  return {
    users,
    pagination: paginationObject,
  };
});

/**
 * @description create user service
 */
export const createUserService = asyncHandler(async (data) => {
  // create user
  const user = await userModel.create(data);

  return user;
});

/**
 * @description user find by id service
 */
export const findUserByIdService = asyncHandler(async (id) => {
  // find user
  const user = await userModel.findById(id).select("-password -__v -role");

  // if user not found
  if (!user) throw createError(404, "Couldn't find any user data.");

  return user;
});

/**
 * @description delete user by id service
 */

export const deleteUserByIdService = asyncHandler(async (id) => {
  // find user
  const user = await userModel.findById(id);

  // if admin user
  if (user?.role === "admin") {
    throw createError(400, "You can't delete admin user.");
  }

  // delete user
  const deletedUser = await userModel.findByIdAndDelete(id);

  if (!deletedUser) {
    throw createError(404, "Couldn't find any user data.");
  }

  return deletedUser;
});

/**
 * @description ban user by id service
 */

export const banUserByIdService = asyncHandler(async (id) => {
  // find user
  const user = await userModel.findById(id);

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
      _id: id,
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

  return updatedUser;
});

/**
 * @description unban user by id service
 */

export const unbanUserByIdService = asyncHandler(async (id) => {
  // find user
  const user = await userModel.findById(id);

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
    id,
    { isBanned: false },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  return updatedUser;
});

/**
 * @description update user by id service
 */
export const updateUserByIdService = asyncHandler(async (id, options) => {
  // update user
  const updatedUser = await userModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
    context: "query",
  });

  // if user not found
  if (!updatedUser) {
    throw createError(404, "Couldn't find any user data.");
  }

  return updatedUser;
});
