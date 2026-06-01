import express from "express";
import { generateInterviewQuestions } from "../controllers/aiController.js";
const router = express.Router();
router.post("/interview", generateInterviewQuestions);

export default router;
