import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // ✅ 1. RESTORED STICKY STATE
  const [sticky, setSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ 2. RESTORED SCROLL EFFECT
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
    // ✅ 3. RESTORED FIXED POSITIONING CLASSES
    <div className={`bg-white dark:bg-slate-900 fixed top-0 left-0 right-0 z-50 ${sticky ? "shadow-xl" : ""}`}>
      <div className="navbar max-w-screen-2xl mx-auto px-4 md:px-20 flex justify-between items-center py-3">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CourseFlow
        </a>

        {/* Menu items for large screens */}
        <ul className="hidden lg:flex space-x-6 font-medium text-gray-700 dark:text-gray-300">
          <li><a href="/">Home</a></li>
          <li><a href="/Course">Course</a></li>
          <li><a href="/AiQuiz">AI Quiz</a></li>
          <li><a href="/AboutMain">About</a></li>
        </ul>

        {/* Right side items */}
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
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-800 hidden md:block"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-sky-700 text-white px-3 py-2 rounded-md hover:bg-slate-800 hidden md:block"
            >
              Signup / Login
            </button>
          )}

          {/* Hamburger Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 dark:text-gray-300">
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 absolute top-full left-0 w-full shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4 font-medium text-gray-700 dark:text-gray-300">
            <li><a href="/" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="/Course" onClick={() => setMenuOpen(false)}>Course</a></li>
            <li><a href="/AiQuiz" onClick={() => setMenuOpen(false)}>AI Quiz</a></li>
            <li><a href="/AboutMain" onClick={() => setMenuOpen(false)}>About</a></li>
            <li className="md:hidden">
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-800">
                  Logout
                </button>
              ) : (
                <button onClick={() => { navigate("/auth"); setMenuOpen(false); }} className="bg-sky-700 text-white px-3 py-2 rounded-md hover:bg-slate-800">
                  Signup / Login
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;