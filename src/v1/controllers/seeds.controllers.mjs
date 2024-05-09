import asyncHandler from "express-async-handler";

import seedsUsers from "../../../data/seeds.users.js";
import { successResponse } from "../services/responseHandler.js";
import userModel from "../../models/user.model.js";

export const seedsUser = asyncHandler(async (req, res, next) => {
  // delete all existing users
  await userModel.deleteMany({});

  // insert seeds data
  const users = await userModel.create(seedsUsers).then((data) => {
    return data.map((user) => {
      delete user._doc.password;
      delete user._doc.__v;
      delete user._doc.createdAt;
      delete user._doc.updatedAt;
      delete user._doc.isAdmin;
      delete user._doc.role;
      return user._doc;
    });
  });

  // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalUsers: users.length,
      data: users,
    },
  });
});
