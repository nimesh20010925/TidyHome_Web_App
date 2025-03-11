import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    homeName: { type: String, required: true, trim: true },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Home must have an owner
    },
    number_of_members: { type: Number, required: true },
    homePhone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Home", homeSchema);
