import mongoose from "mongoose";

// create tag schema
const cartSchema = mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["completed", "pending", "cancelled"],
        message: "{VALUE} is invalid for status",
      },
    },
    billingAddress: {
      address: {
        country: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
      },
      contact: {
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    },
    totals: {
      quantity: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
        default: 0,
      },
      subTotal: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
