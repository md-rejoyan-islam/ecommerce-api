import mongoose from "mongoose";
import { defaultBrandImagePath } from "../app/secret.mjs";

// create user schema
const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, " Brand name must be unique"],
      minLength: [1, "Brand name must be at least 3 characters"],
      maxLength: [30, "Brand name is too large"],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Slug must be unique"],
    },
    image: {
      type: String,
      default: defaultBrandImagePath,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required."],
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is invalid for status",
      },
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.pre("validate", function (next) {
  this.slug = this.name.split(" ").join("-").toLowerCase().trim();
  next();
});

export default mongoose.model("Brand", brandSchema);
