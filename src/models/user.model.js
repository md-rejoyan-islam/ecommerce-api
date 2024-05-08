import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { defaultImagePath } from "../app/secret.js";

// user schema

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      unique: [true, "Email already exist"],
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
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
      trim: true,
      set: (v) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(v, salt);
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
