import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse-new";
import courseRouter from "./route/Course.route.js";
import userRouter from "./route/user.route.js";
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = "https://courseflow-60.onrender.com"
// --- CORS Configuration ---
// This correctly uses an environment variable for the frontend URL.
// Remember to set FRONTEND_URL in your Render dashboard.
const corsOptions = {
  origin: process.env.FRONTEND_URL ,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- File Upload Configuration (Render-Friendly) ---
// Use memoryStorage to process files as buffers instead of saving them to disk.
const upload = multer({ storage: multer.memoryStorage() });

// --- AI and Database Setup ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---

/**
 * @route   POST /api/quiz
 * @desc    Generates a quiz from an uploaded PDF file.
 * @access  Public
 */
app.post("/api/quiz", upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Access the file from memory via the buffer
    const file = req.files[0];
    const dataBuffer = file.buffer;

    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        error: "Could not extract text from the PDF. It may be a scanned image.",
      });
    }

    const level = req.body.level || "Medium";
    const prompt = `
      You are a helpful assistant. Generate exactly 10 ${level}-level multiple-choice quiz questions from the following text.
      Return ONLY valid JSON, nothing else, no explanations.
      Format strictly as:
      {
        "questions": [
          { "question": "Q1 text", "options": ["A","B","C","D"], "answer": 1 },
          { "question": "Q2 text", "options": ["A","B","C","D"], "answer": 0 }
        ]
      }
      The "answer" must be the zero-based index of the correct option. For example, if "B" is the correct answer, the value for "answer" must be 1.
      Text:
      ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const aiText = response.choices[0].message.content;
    
    // Clean potential markdown formatting from the AI response
    const cleanedAiText = aiText.replace(/```json\n?|```/g, "");
    
    const quiz = JSON.parse(cleanedAiText);
    res.json(quiz);

  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    res.status(500).json({ error: "An unexpected error occurred on the server." });
  }
});

/**
 * @route   POST /quiz/evaluate
 * @desc    Evaluates the user's quiz answers.
 * @access  Public
 */
app.post("/quiz/evaluate", (req, res) => {
  const { questions, answers } = req.body;
  if (!questions || !answers) {
    return res.status(400).json({ error: "Questions or answers missing" });
  }

  let correct = 0;
  questions.forEach((q, i) => {
    // Ensure the check is robust
    if (answers[i] === q.options[q.answer]) {
      correct++;
    }
  });

  const total = questions.length;
  const wrong = total - correct;
  res.json({ total, correct, wrong });
});

// --- Application Routers ---
app.use("/courses", courseRouter);
app.use("/auth", userRouter);

// --- Server Listener ---
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);