import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`http://localhost:5000/books/details/${id}`);
      const data = await res.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{book.volumeInfo?.title}</h1>
      <p className="italic">{book.volumeInfo?.authors?.join(", ")}</p>
      <img src={book.volumeInfo?.imageLinks?.thumbnail} alt={book.volumeInfo?.title} />
      <p className="mt-4">{book.volumeInfo?.description}</p>
      <a
        href={book.volumeInfo?.previewLink}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600"
      >
        Read Preview
      </a>
    </div>
  );
}

export default BookDetails;
