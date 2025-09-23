import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';

function Freebooks() {
  const [freebooks, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses'); 
        // filter free books
        const data = response.data.filter((data) => data.category === "Free");
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 mt-auto">
      <div>
        <h1 className="font-semibold text-3xl pb-4">Free Offered Books...</h1>
        <p className="md:text-xl">
          Unlock the power of knowledge with books that expand your mind and shape your future.
          Learn, explore, and grow with wisdom from the greatest thinkers — all at your fingertips.
          Best of all, every book is available absolutely free of cost.
        </p>
      </div>

      <div className="pt-10">
        <Slider {...settings}>
          {freebooks.map((item) => (
            <div key={item._id} className="px-2"> 
              <Card item={item} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Freebooks;
