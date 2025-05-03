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
      type: String,
      required: false,
    },
    homeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true, // Ensure every category is tied to a home
    },
  },
  {
    timestamps: true,
  }
);

// Ensure category_name is unique within a home
categorySchema.index({ category_name: 1, homeID: 1 }, { unique: true });

const categorys = mongoose.model("categorys", categorySchema);
export default categorys;