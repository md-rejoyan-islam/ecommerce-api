import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { defaultImagePath } from "../app/secret.js";
import hashPassword from "../utils/hashPassword.js";
import { isEmail } from "../helper/helper.js";

// user schema

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [3, "Name can not be less than 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      unique: [true, "Email already exist"],
      lowercase: true,
      validate: {
        validator: (value) => {
          return isEmail(value);
        },
        message: "Please enter a valid email.",
      },
    },
    phone: {
      type: String,
      trim: true,
      unique: [true, "Phone Number already exist"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      set: (value) => {
        return hashPassword(value);
      },
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is invalid for gender",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "User address is required!"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required!"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      lowercase: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      default: defaultImagePath,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
