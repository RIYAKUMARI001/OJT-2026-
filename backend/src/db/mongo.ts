import mongoose from "mongoose";
import { env } from "../config/env.js";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongo(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connecting) return connecting;

  connecting = mongoose.connect(env.MONGODB_URI);
  try {
    return await connecting;
  } finally {
    connecting = null;
  }
}

