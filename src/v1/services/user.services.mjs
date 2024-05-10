import asyncHandler from "express-async-handler";
import createError from "http-errors";
import userModel from "../../models/user.model.mjs";
import deleteImage from "../../helper/deleteImage.js";

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

  // // image delete
  const userImagePath = deletedUser?.photo;

  userImagePath && deleteImage(userImagePath);

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
