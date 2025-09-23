import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sticky, setSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("login", updateLogin);
    window.addEventListener("logout", updateLogin);
    return () => {
      window.removeEventListener("login", updateLogin);
      window.removeEventListener("logout", updateLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("logout"));
    navigate("/");
  };

  return (
    <div className={`bg-white dark:bg-slate-900 fixed top-0 left-0 right-0 z-50 ${sticky ? "shadow-xl" : ""}`}>
      <div className="navbar max-w-screen-2xl mx-auto px-4 md:px-20 flex justify-between items-center py-3">

        {/* Logo */}
        <a className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CourseFlow
        </a>

        {/* Menu items */}
        <ul className="hidden lg:flex space-x-6 font-medium text-gray-700 dark:text-gray-300">
          <li><a href="/">Home</a></li>
          <li><a href="/Course">Course</a></li>
          <li><a href="/AiQuiz">AI Quiz</a></li>
          <li><a href="/AboutMain">About</a></li>
        </ul>

        <div className="flex space-x-3 items-center">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            {theme === "light" ? "🌞" : "🌙"}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-800"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-sky-700 text-white px-3 py-2 rounded-md hover:bg-slate-800"
            >
              Signup / Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
