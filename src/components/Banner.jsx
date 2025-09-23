import React, { useState, useEffect } from "react";
import banner from "/Banner2.png";
import { useNavigate } from "react-router-dom";
import "./Banner.css"; // flip styles

function Banner() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const updateLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));

    window.addEventListener("login", updateLogin);
    window.addEventListener("logout", updateLogin);
    window.addEventListener("storage", updateLogin);

    return () => {
      window.removeEventListener("login", updateLogin);
      window.removeEventListener("logout", updateLogin);
      window.removeEventListener("storage", updateLogin);
    };
  }, []);

  // Decide button action
  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/aiquiz"); 
    } else {
      navigate("/auth"); 
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row">
      {/* Left Content */}
      <div className="w-full order-2 md:order-1 md:w-1/2">
        <div className="space-y-8 mt-8 md:mt-60 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Knowledge Books — <span className="text-blue-400">Learn & Grow Every Day..</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Explore insightful books that expand your thinking, boost your knowledge,
            and inspire your journey toward growth and success.
          </p>

          {/* Button */}
          <div className="flex justify-center md:justify-start mt-4">
            <button
              className={`w-40 py-3 px-6 ${
                isLoggedIn ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105`}
              onClick={handleButtonClick}
            >
              {isLoggedIn ? "AI Quiz" : "Get Started"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full order-1 md:w-1/2 flex justify-center items-center">
        <img src={banner} alt="banner" className="object-contain h-3/4" />
      </div>
    </div>
  );
}

export default Banner;
