import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateQuiz = async (req, res) => {
  try {
    if (!req.file) {
      console.error("⚠️ No file uploaded. req.body:", req.body);
      return res.status(400).json({ error: "No file uploaded. Use key 'file' in form-data." });
    }

    const content = req.file.buffer.toString("utf-8");

    const prompt = `
      Create a quiz in JSON format with 5 multiple-choice questions.
      Respond ONLY with valid JSON (no markdown, no explanations).
      Based on this text:\n\n${content}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Gemini raw output:", text);

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Gemini did not return valid JSON",
        raw: text
      });
    }

    res.json(quiz);
  } catch (err) {
    console.error("❌ Crash:", err);
    res.status(500).json({ error: err.message });
  }
};
