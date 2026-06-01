import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.status(200).json({
      suggestion: response,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};