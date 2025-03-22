import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_type: {
      type: String,
      required: true,
    },
    category_name: {
      type: String,
      required: true,
    },
    category_description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category_image: {
      type: String, // Store the path or URL of the uploaded image
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const categorys = mongoose.model("categorys", categorySchema);
export default categorys;