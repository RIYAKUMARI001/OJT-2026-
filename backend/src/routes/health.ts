import type { Application } from "express";
import { connectMongo } from "../db/mongo.js";

export function registerHealthRoutes(app: Application) {
  app.get("/health", async (_req, res) => {
    let mongo = "disconnected";
    try {
      await connectMongo();
      mongo = "connected";
    } catch {
      mongo = "error";
    }

    res.json({
      ok: true,
      mongo,
      timestamp: new Date().toISOString()
    });
  });
}

