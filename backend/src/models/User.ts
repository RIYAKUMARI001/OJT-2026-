import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Method to compare password
userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
