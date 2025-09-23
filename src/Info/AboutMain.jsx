import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import AboutMain1 from '../components/About.jsx'
import React from 'react'

function AboutMain() {
  return (
    <>
    <div  className="min-h-screen bg-gray-100 dark:bg-slate-900">
    <div>
        <Navbar/>
    </div>
    <div>
       <div>
        <AboutMain1 />
       </div>
    </div>
    <div>
        <Footer/>
    </div>
    </div>
    </>
  )
}

export default AboutMain