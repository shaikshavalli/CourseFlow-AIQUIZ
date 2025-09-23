import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

function Auth() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setFormData({ fullName: "", email: "", password: "" });
        navigate("/");
        window.location.reload();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Try again.");
    }
  };

  // Toggle between login/signup and reset form
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300">
        
        {/* Close button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-2xl font-bold hover:text-gray-700 dark:hover:text-white transition-colors duration-200"
        >
          ×
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white transition-colors duration-200">
          {isLogin ? "Login" : "Signup"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white transition-colors duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-slate-600 dark:text-white transition-colors duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg dark:bg-slate-600 dark:text-white transition-colors duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleMode} className="text-blue-600 hover:underline">
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
