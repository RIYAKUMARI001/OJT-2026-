import cors from "cors";
import express from "express";
import helmet from "helmet";
import { registerHealthRoutes } from "./routes/health.js";
import authRoutes from "./routes/authRoutes.js";
import designRoutes from "./routes/designRoutes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  registerHealthRoutes(app);
  app.use("/auth", authRoutes);
  app.use("/designs", designRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

