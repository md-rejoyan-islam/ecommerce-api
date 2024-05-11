import mongoose from "mongoose";

// create product schema
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "name must be unique"],
      minLength: [1, "Name must be at least 3 characters"],
      maxLength: [30, "Name is too large"],
    },
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: [1, "Title must be at least 3 characters"],
      maxLength: [30, "Title is too large"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    description: {
      short_desc: {
        type: String,
        required: [true, "Short description is required"],
        trim: true,
      },
      long_desc: {
        type: String,
        trim: true,
        required: [true, "Long description is required"],
      },
    },
    price: {
      regular_price: {
        type: Number,
        required: [true, "Regular price is required"],
      },
      sale_price: {
        type: Number,
      },
    },

    stock: {
      type: Number,
      required: [true, "Stock number is required"],
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
    },
    rating: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("validate", function (next) {
  this.slug = this.name.split(" ").join("-").toLowerCase().trim();
  next();
});

export default mongoose.model("Product", productSchema);
