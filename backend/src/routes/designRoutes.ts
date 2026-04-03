import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createDesign, listDesigns, deleteDesign } from "../controllers/designController.js";

const router = Router();

router.post("/", requireAuth, createDesign);
router.get("/", requireAuth, listDesigns);
router.delete("/:id", requireAuth, deleteDesign);

export default router;
