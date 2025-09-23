import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /quiz
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const content = req.file.buffer.toString("utf-8");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a quiz in JSON format with 5 questions.
Each question should have:
- "question"
- "options" (array of 4)
- "answer" (correct option)
Based on this text:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let quiz;
    try {
      quiz = JSON.parse(text); 
    } catch {
      quiz = { raw: text }; 

    res.json({ quiz });
  } catch (err) {
    console.error("❌ Quiz error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
