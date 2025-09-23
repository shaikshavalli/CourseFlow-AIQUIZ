import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login({ onClose }) {
  
    const API_URL = import.meta.env.VITE_API_URL

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  //  Apply theme
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  
  useEffect(() => {
    setFormData({ email: "", password: "" });
    setMessage("");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "❌ Login failed");
        return;
      }

      setMessage("✅ Login successful!");
      localStorage.setItem("user", JSON.stringify(data.user));

      setFormData({ email: "", password: "" });

      setTimeout(() => {
        if (onClose) onClose();
        navigate("/", { replace: true });
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error("❌ Error logging in:", err);
      setMessage("❌ Server error. Please try again later.");
    }
  };

  const closeLogin = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {message && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white z-50
          ${message.includes("successful") ? "bg-green-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}

      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={closeLogin}
      ></div>

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 z-10">
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <LogIn size={24} className="text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 text-gray-700 dark:text-gray-300">
          <span>Don't have an account? </span>
          <button
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            onClick={() => navigate("/Signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
