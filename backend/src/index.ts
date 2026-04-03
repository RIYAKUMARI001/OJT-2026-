import mongoose from "mongoose";
import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

async function main() {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15_000,
  });
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");

  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT} (All Interfaces)`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
