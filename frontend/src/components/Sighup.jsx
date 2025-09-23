import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    // ✅ 1. ADD STATE FOR INLINE MESSAGES
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear message on new input
        if (message.text) {
            setMessage({ text: "", type: "" });
        }
    };

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
                // ✅ 2. SET SUCCESS MESSAGE INSTEAD OF ALERT
                setMessage({ text: data.message, type: "success" });

                if (isLogin) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // Update navbar without a full page reload
                    window.dispatchEvent(new Event("login")); 
                }
                
                // Navigate home after a short delay to allow user to see the message
                setTimeout(() => {
                    navigate("/");
                }, 1500);

            } else {
                // ✅ 3. SET ERROR MESSAGE INSTEAD OF ALERT
                setMessage({ text: data.message || "Something went wrong", type: "error" });
            }
        } catch (err) {
            console.error("Error:", err);
            // ✅ 4. SET SERVER ERROR MESSAGE
            setMessage({ text: "Server error. Please try again.", type: "error" });
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ fullName: "", email: "", password: "" });
        setShowPassword(false);
        // Clear any previous messages
        setMessage({ text: "", type: "" });
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
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
                            <User className="absolute left-3 top-9 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                        <Mail className="absolute left-3 top-9 text-gray-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
                        <Lock className="absolute left-3 top-9 text-gray-400" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                            className="w-full pl-10 pr-10 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    {/* ✅ 5. RENDER THE MESSAGE HERE */}
                    {message.text && (
                        <p className={`text-sm text-center font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message.text}
                        </p>
                    )}

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