import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "" });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {isLogin ? "Login" : "Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <User className="absolute left-3 top-10 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Mail className="absolute left-3 top-10 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <Lock className="absolute left-3 top-10 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isLogin ? "Enter your password" : "Create a strong password"}
              className="w-full pl-10 pr-10 py-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
