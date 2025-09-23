import React from "react";

function Card({ item }) {
  const handleOpenBook = () => {
    if (item.bookUrl) {
      window.open(item.bookUrl, "_self"); 
    } else {
      alert("No book link available!");
    }
  };

  return (
    <div
      className="card mt-4 my-3 p-4 cursor-pointer rounded-2xl shadow-xl hover:border-indigo-500 transition-colors hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white dark:border"
    >
      <figure className="w-full h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 overflow-hidden rounded-t-lg">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-center"
          onClick={handleOpenBook} 
        />
      </figure>

      <div className="card-body flex flex-col justify-between">
        <h2 className="card-title text-balance">
          {item.name}
          <div className="badge badge-secondary bg-blue-500">
            {item.category}
          </div>
        </h2>
        <p className="text-sm">{item.title}</p>

        <div className="card-actions justify-between mt-2">
          <div className="badge badge-outline text-xs">
            {item.price === 0 ? "Free" : `₹${item.price}`}
          </div>

          {/* ✅ Open Book Button */}
          <button
            onClick={handleOpenBook}
            className="badge badge-outline text-xs hover:bg-blue-500 hover:text-white duration-200 px-3 py-1 rounded"
          >
            📖 Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
