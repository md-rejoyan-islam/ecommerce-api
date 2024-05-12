import mongoose from "mongoose";

// create product schema
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [1, "Name must be at least 3 characters"],
      maxLength: [30, "Name is too large"],
    },
    title: {
      type: String,
      trim: true,
      required: true,
      minLength: [1, "Title must be at least 3 characters"],
      maxLength: [30, "Title is too large"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: [true, "Slug must be unique"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    description: {
      short: {
        type: String,
        required: [true, "Short description is required"],
        trim: true,
      },
      long: {
        type: String,
        trim: true,
        required: [true, "Long description is required"],
      },
    },
    price: {
      regular: {
        type: Number,
        required: [true, "Regular price is required"],
        validate: {
          validator: (value) => value > 0,
          message: (props) =>
            `${props.value} is not a valid price! Price must be greater than 0`, // props.value is the value of the field
        },
      },
      sale: {
        type: Number,
        validate: {
          validator: (value) => value > 0,
          message: (props) =>
            `${props.value} is not a valid price! Price must be greater than 0`, // props.value is the value of the field
        },
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      validate: {
        validator: (value) => value > 0,
        message: (props) =>
          `${props.value} is not a valid quantity! Quantity must be greater than 0`, // props.value is the value of the field
      },
    },
    sold: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
      },
      fee: {
        type: Number,
        default: 0,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
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
