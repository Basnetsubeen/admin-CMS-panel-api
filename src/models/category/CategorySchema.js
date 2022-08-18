import mongoose from "mongoose";

const catgorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive", //active, inactive
    },
    name: {
      type: String,
      require: true,
      maxLength: 50,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
      index: 1, //for ascending or descending
      maxLength: 50,
      trim: true, // white space after the string
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Category", catgorySchema);
