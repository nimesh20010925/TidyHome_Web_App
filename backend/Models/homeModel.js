import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    homeName: { type: String, required: true, trim: true },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Home must have an owner
    },
    number_of_members: { type: Number, required: true, min: 1 },
    homePhone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    // Store members as an array of user IDs
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Home status (active/inactive)
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Home", homeSchema);
