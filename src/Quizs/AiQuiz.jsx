import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Quiz from '../components/Quiz';
import Footer from '../components/Footer';

function AiQuiz() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setDarkMode(theme === "dark");
  }, []);

  return (
    <div className={`${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
      <Navbar />
      <div className="flex justify-center items-center pt-24 px-4">
        <Quiz darkMode={darkMode} />
      </div>
      <Footer />
    </div>
  );
}

export default AiQuiz;
