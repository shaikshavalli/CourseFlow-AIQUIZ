import React, { useEffect, useState } from "react";

function SavedBooks() {
      const API_URL = import.meta.env.VITE_API_URL

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      const res = await fetch(`${API_URL}/books/saved`);
      const data = await res.json();
      setBooks(data);
    };
    fetchSavedBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Saved Books</h2>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book._id} className="border p-3 rounded">
            <img src={book.thumbnail} alt={book.title} />
            <h3 className="font-bold">{book.title}</h3>
            <p>{book.authors?.join(", ")}</p>
            <a href={book.previewLink} target="_blank" rel="noreferrer" className="text-blue-500">
              Preview
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedBooks;
