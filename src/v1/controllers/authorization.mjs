import e from "express";
import userModel from "../../models/user.model.js";
import mongoose from "mongoose";

export const authorization = (...role) => {
  return async (req, res, next) => {
    if (!role.includes(req?.me?.role)) {
      return res.status(403).json({
        Status: "Failed",
        message: "You don't have permission to perform this action",
      });
    }

    // make sure the user is authorized

    const id = req?.params?.id;

    if (id) {
      if (
        req?.me?.role === "admin" ||
        req?.me?._id.toString().split('"')[0] === id
      ) {
        return next();
      }
      return res.status(403).json({
        Status: "Failed",
        message: "You don't have permission to perform this action",
      });
    }

    next();
  };
};
