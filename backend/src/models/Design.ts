import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    roomType: { type: String, required: true },
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    wallColor: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Design = mongoose.model("Design", designSchema);
