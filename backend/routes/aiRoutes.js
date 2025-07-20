import express from "express";
import { getSuggestion } from "../controllers/aiController.js";
const router = express.Router();
router.post("/ai-suggest", getSuggestion);

export default router;
