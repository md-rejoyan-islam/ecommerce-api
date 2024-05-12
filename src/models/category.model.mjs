import mongoose from "mongoose";
import { defaultCatImagePath } from "../app/secret.mjs";

// create user schema
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "Category already exist."],
      minLength: [1, "Name must be at least 3 characters"],
      maxLength: [30, "Name is too large"],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
      default: defaultCatImagePath,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("validate", function (next) {
  this.slug = this.name.split(" ").join("-").toLowerCase().trim();
  next();
});

export default mongoose.model("Category", categorySchema);
