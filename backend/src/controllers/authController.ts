import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET || "fallback", { expiresIn: "7d" });

    res.status(201).json({ token, userId: user._id, name: user.name });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("register:", error);
    const message =
      env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Registration failed";
    res.status(500).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // @ts-ignore - comparePassword is added to schema methods
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET || "fallback", { expiresIn: "7d" });

    res.status(200).json({ token, userId: user._id, name: user.name, expiresIn: "7d" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("login:", error);
    const message =
      env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Login failed";
    res.status(500).json({ error: message });
  }
};
