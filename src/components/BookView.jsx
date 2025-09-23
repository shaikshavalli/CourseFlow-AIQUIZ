// BookView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BookView() {
  const { id } = useParams(); // get book ID from URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/auth"); // redirect if not logged in
      return;
    }

    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!book) return <p className="text-center mt-10">Book not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.image}
          alt={book.title}
          className="w-full md:w-1/3 object-cover rounded-lg shadow-md"
        />
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold">{book.name}</h1>
          <h2 className="text-xl text-gray-500 dark:text-gray-300">{book.title}</h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Category: <span className="font-semibold">{book.category}</span>
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Price: <span className="font-semibold">{book.price}</span>
          </p>

          {/* You can add more book details or description here */}
        </div>
      </div>
    </div>
  );
}

export default BookView;
