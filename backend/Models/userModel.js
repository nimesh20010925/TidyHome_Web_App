import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    answer: { type: String, required: true },
    role: {
      type: String,
      enum: ["homeOwner", "homeMember"],
      default: "homeMember",
    },
    homeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      default: null, // Assigned when a home member is added
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
