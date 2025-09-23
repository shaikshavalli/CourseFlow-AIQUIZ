import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Home/Home';
import Courses from './Courses/Courses';
import Signup from './components/Sighup.jsx'; 
import Login from './components/Login';
import AiQuiz from './Quizs/AiQuiz.jsx';
import Freebooks from './components/Freebooks.jsx';
import BookDetails from './components/Bookdetails.jsx';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AboutMain from './Info/AboutMain.jsx';
import BookView from './components/BookView.jsx';
import BookSearch from './components/BookSearch.jsx';
import SavedBooks from './components/SavedBooks.jsx';

function App() {
  return (
    <div className='dark:bg-slate-900 dark:text-white'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Course" element={<ProtectedRoute>
              <Courses />
            </ProtectedRoute>} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/AiQuiz" element={ <ProtectedRoute>
              <AiQuiz />
            </ProtectedRoute>} />
          <Route path="/AboutMain" element={ <ProtectedRoute>
              <AboutMain />
            </ProtectedRoute>} />
          <Route path="/Freebooks" element={<Freebooks />} />
           <Route path="/saved" element={<SavedBooks />} />
           <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
            
          }
        />
           <Route path="/auth" element={<Auth />} />
           <Route path="/books/:id" element={<BookView />} />
           <Route path="/books" element={<BookSearch />} />
           <Route path="/books/:id" element={<BookDetails />} />

        </Routes>

    </div>
  );
}

export default App;
