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
  },
  {
    timestamps: true /* To save created time in data base */,
  }
);

const categorys = mongoose.model("categorys", categorySchema);
export default categorys;
