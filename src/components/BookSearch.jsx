import React, { useState } from "react";

function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/books/search?q=${query}`);
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Books</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter book name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="w-full h-48 object-cover mb-3"
            />
            <h2 className="font-bold">{book.volumeInfo.title}</h2>
            <p className="text-sm text-gray-600">
              {book.volumeInfo.authors?.join(", ")}
            </p>
            <a
              href={book.volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Read Book
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookSearch;
