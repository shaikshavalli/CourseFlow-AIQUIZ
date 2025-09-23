import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

function Quiz({ darkMode }) {
  const API_URL = import.meta.env.VITE_API_URL
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const startQuiz = async () => {
    if (!file || !level) return alert("Please upload a PDF and select a difficulty level.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions || []);
        setQuizStarted(true);
        setTimeLeft(300); // 5 minutes
        setCurrentIndex(0);
        setTimeUp(false);
        setResults(null);
        setAnswers({});
      } else {
        throw new Error(data.error || "Failed to generate quiz.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
  };
  
  const submitQuiz = useCallback(() => {
    if (!quizStarted || results) return;

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      if (!userAnswer) {
        unattemptedCount++;
      } else {
        // ✅ CORRECTED LOGIC: Directly use the answer index from the backend
        const correctOption = q.options[q.answer];
        if (userAnswer === correctOption) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const accuracy = questions.length > 0 ? ((correctCount / questions.length) * 100).toFixed(1) : 0;

    setResults({ correct: correctCount, wrong: wrongCount, unattempted: unattemptedCount, accuracy });
    setQuizStarted(false);
    localStorage.removeItem("quizState");
  }, [quizStarted, results, questions, answers]);


  // Timer effect
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      setTimeUp(true);
      submitQuiz();
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, submitQuiz]);

  const handleAnswer = (answer) =>
    setAnswers({ ...answers, [currentIndex]: answer });

  const nextQuestion = () => {
    if (currentIndex < (questions?.length || 0) - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  // Chart Data
  const chartData = results
    ? [
        { name: "Correct", value: results.correct, color: "#34d399" },
        { name: "Wrong", value: results.wrong, color: "#f87171" },
        { name: "Unattempted", value: results.unattempted, color: "#fbbf24" },
      ]
    : [];

  const bgClass = darkMode
    ? "dark:bg-slate-900 dark:text-white"
    : "bg-gray-100 text-gray-900";
  const cardClass = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-900";

  // Load quiz state from localStorage
  useEffect(() => {
    const savedQuiz = localStorage.getItem("quizState");
    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz);
      setQuizStarted(parsed.quizStarted);
      setQuestions(parsed.questions || []);
      setAnswers(parsed.answers || {});
      setTimeLeft(parsed.timeLeft || 0);
      setCurrentIndex(parsed.currentIndex || 0);
      setResults(parsed.results || null);
      setTimeUp(parsed.timeUp || false);
    }
  }, []);

  // Save quiz state (optimized)
  useEffect(() => {
    const state = { quizStarted, questions, answers, timeLeft, currentIndex, results, timeUp };
    localStorage.setItem("quizState", JSON.stringify(state));
  }, [quizStarted, questions, answers, currentIndex, results, timeUp, timeLeft]);

  return (
    <div className={`min-h-screen w-full p-4 ${bgClass}`}>
      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-50 text-3xl font-bold space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              ⏳
            </motion.div>
            <span className="text-xl">Generating Quiz...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Up */}
      {timeUp && !results && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-600 text-white text-center p-3 mb-4 rounded-md font-bold"
        >
          ⏰ Time’s Up! Submitting your quiz...
        </motion.div>
      )}

      {/* Upload Section */}
      {!quizStarted && !loading && !results && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-3xl mx-auto p-6 md:p-8 rounded-xl shadow-lg space-y-6 ${cardClass}`}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Gemini PDF Quiz</h1>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`w-full p-3 md:p-4 border rounded-lg text-sm md:text-base ${
              darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
            }`}
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={`w-full p-3 md:p-4 border rounded-lg text-sm md:text-base ${
              darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
            }`}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button
            onClick={startQuiz}
            className={`w-full p-3 md:p-4 rounded-lg text-sm md:text-base ${
              darkMode ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Start Quiz
          </button>
        </motion.div>
      )}

      {/* Quiz Section */}
      {quizStarted && questions?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`max-w-4xl mx-auto p-4 md:p-6 rounded-xl shadow-lg ${cardClass}`}>
          <div className="flex justify-between font-bold text-sm md:text-lg mb-4 flex-wrap gap-2">
            <span>Time Left: {formatTime(timeLeft)}</span>
            <span>
              Question {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <motion.div key={currentIndex} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="font-semibold mb-4 text-base md:text-lg">{questions[currentIndex]?.question}</p>
            {questions[currentIndex]?.options?.map((opt, j) => (
              <label key={j} className="block ml-2 md:ml-4 mt-2 cursor-pointer text-sm md:text-base">
                <input
                  type="radio"
                  name={`q-${currentIndex}`}
                  value={opt}
                  checked={answers[currentIndex] === opt}
                  onChange={() => handleAnswer(opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </motion.div>

          <div className="flex justify-between mt-6 flex-wrap gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Previous
            </button>
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                  darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                  darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-6xl mx-auto p-4 md:p-6 rounded-xl shadow-lg mt-6 ${cardClass}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Quiz Results</h2>
          <div className="flex flex-wrap justify-around text-sm md:text-base gap-4 mb-6">
            <div>Total: {questions.length}</div>
            <div>Correct: {results.correct}</div>
            <div>Wrong: {results.wrong}</div>
            <div>Unattempted: {results.unattempted}</div>
            <div>Accuracy: {results.accuracy}%</div>
          </div>

          {/* Bar Chart */}
          <div className="w-full h-[300px] md:h-[450px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                <YAxis allowDecimals={false} stroke={darkMode ? "#fff" : "#000"} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                <Legend wrapperStyle={{ color: darkMode ? "#fff" : "#000" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="w-full h-[300px] md:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={50} label>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", color: darkMode ? "#fff" : "#000" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={() => {
              setResults(null);
              setFile(null);
              setLevel("");
              setAnswers({});
              setQuestions([]);
              setQuizStarted(false);
              setTimeUp(false);
              localStorage.removeItem("quizState");
            }}
            className={`mt-6 w-full p-3 md:p-4 rounded-lg text-sm md:text-base ${
              darkMode ? "bg-green-500 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Take Another Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default Quiz;