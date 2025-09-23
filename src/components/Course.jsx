import React, { useEffect, useState } from "react";
import Card from "./Card";

function Course() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("❌ Error fetching courses:", err));
  }, []);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="mt-28 items-center justify-center text-center">
        <h1 className="text-2xl md:text-4xl">
          Explore our collection of books across{" "}
          <span className="btn-ghost text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            all categories
          </span>
          ....
        </h1>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Course;
