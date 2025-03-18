import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_image: {
      type: String,
      required: true,
    },
    category_type: {
      type: String,
      required: true,
    },
    category_name: {
      type: String,
      required: true,
    },
    category_discription: {
        type: String,
        required: true,
      },
    date: {
      type: Date,
      required: true,
    },

  },
  {
    timestamps: true,  /* To save created time in data base */
  }
);

export const category = mongoose.model("categorys", categorySchema);
