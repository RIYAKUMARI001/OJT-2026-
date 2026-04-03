import type { Response } from "express";
import type { AuthedRequest } from "../middleware/requireAuth.js";
import { Design } from "../models/Design.js";

export const createDesign = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, roomType, width, length, wallColor, items } = req.body as {
      title?: string;
      roomType?: string;
      width?: number;
      length?: number;
      wallColor?: string;
      items?: string[];
    };

    if (!roomType || width == null || length == null || !wallColor) {
      res.status(400).json({ error: "roomType, width, length, wallColor required" });
      return;
    }

    const design = await Design.create({
      userId,
      title: title || `${roomType} · ${width}×${length} ft`,
      roomType,
      width,
      length,
      wallColor,
      items: Array.isArray(items) ? items : [],
    });

    res.status(201).json({
      id: design._id,
      title: design.title,
      roomType: design.roomType,
      width: design.width,
      length: design.length,
      wallColor: design.wallColor,
      items: design.items,
      createdAt: design.createdAt,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("createDesign:", e);
    res.status(500).json({ error: "Could not save design" });
  }
};

export const listDesigns = async (req: AuthedRequest, res: Response) => {
  try {
    const list = await Design.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      designs: list.map((d) => ({
        id: d._id,
        title: d.title,
        roomType: d.roomType,
        width: d.width,
        length: d.length,
        wallColor: d.wallColor,
        items: d.items,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("listDesigns:", e);
    res.status(500).json({ error: "Could not load designs" });
  }
};

export const deleteDesign = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const design = await Design.findOneAndDelete({ _id: id, userId });

    if (!design) {
      res.status(404).json({ error: "Design not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Design deleted" });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("deleteDesign:", e);
    res.status(500).json({ error: "Could not delete design" });
  }
};
