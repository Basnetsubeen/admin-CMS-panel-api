import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    name: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: 20,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    salesPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    salesStartDate: {
      type: Date,
      default: null,
    },
    salesEndDate: {
      type: Date,
      default: null,
    },
    ratings: {
      type: Number,
      max: 5,
      dafault: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", productSchema);
