import mongoose from "mongoose";

// create user schema
const brandSchema = mongoose.Schema(
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
    brand_photo: {
      type: String,
      trim: true,
      required: true,
    },
    description: String,
    status: {
      type: Boolean,
      default: false,
    },
    trash: {
      type: Boolean,
      default: false,
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
// brandSchema.pre("save", function (next) {
//   this.slug = this.name.split(" ").join("-").toLowerCase().trim();
//   next();
// });



export default mongoose.model("Brand", brandSchema);

 