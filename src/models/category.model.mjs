import mongoose from "mongoose";

// create user schema
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "name must be unique"],
      minLength: [1, "Name must be at least 3 characters"],
      maxLength: [30, "Name is too large"],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category_photo: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: null,
    },
    trash: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
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
