import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.userId = String(payload.userId);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}
