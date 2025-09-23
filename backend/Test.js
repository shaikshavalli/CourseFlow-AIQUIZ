import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import courseRouter from "./route/Course.route.js";
import userRouter from "./route/user.route.js";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer config for uploads
const upload = multer({ dest: "uploads/" });

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store your key in .env
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/**
 * 📌 Route: Upload PDF + generate quiz
 */
app.post("/api/quiz", upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Take the first uploaded file
    const filePath = path.join("uploads", req.files[0].filename);
    const dataBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Send text to OpenAI
    const prompt = `
      Generate 10 multiple-choice quiz questions from the following text.
      Format response strictly as JSON with this structure:
      {
        "questions": [
          { "question": "Q1", "options": ["A","B","C","D"], "answer": "B" },
          { "question": "Q2", "options": ["A","B","C","D"], "answer": "A" }
        ]
      }

      Text:
      ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = response.choices[0].message.content;

    let quiz;
    try {
      quiz = JSON.parse(aiText);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return res.status(500).json({ error: "AI response not in valid JSON" });
    }

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    res.json(quiz);
  } catch (err) {
    console.error("❌ Quiz generation error:", err.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// Routes
app.use("/courses", courseRouter);
app.use("/auth", userRouter);

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
