import React from 'react';
import Navbar from '../components/Navbar';
import Course from '../components/Course';
import Footer from '../components/Footer';

function Courses() {
  return (
    <div >
      <Navbar />
      <div className="pt-16">
        <Course />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

export default Courses;