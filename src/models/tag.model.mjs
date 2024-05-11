import mongoose from "mongoose";

// create tag schema
const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Tag name is required."],
      unique: [true, "Tag name must be unique"],
      minLength: [1, "Tag Name must be at least 3 characters"],
      maxLength: [30, "Tag Name is too large"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
      trim: true,
      unique: [true, "Tag slug can be unique."],
    },
  },
  {
    timestamps: true,
  }
);

tagSchema.pre("validate", function (next) {
  this.slug = this.name.split(" ").join("-").toLowerCase().trim();
  next();
});

export default mongoose.model("Tag", tagSchema);
