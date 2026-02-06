import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <--- IMPORT FOOTER
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events'; 
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Donations from './pages/Donations';

export default function App() {
  return (
    <Router>
      {/* flex flex-col min-h-screen: 
         This ensures the footer sticks to the bottom if content is short 
      */}
      <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans text-slate-800">
        
        {/* --- PERSISTENT BACKGROUND --- */}
        <div className="fixed inset-0 z-0 bg-[#0a1e50]">
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                 <path d="M 0 10 L 60 10 M 0 30 L 60 30 M 0 50 L 60 50" stroke="white" strokeWidth="0.5" fill="none"/>
                 <path d="M 10 0 L 10 60 M 30 0 L 30 60 M 50 0 L 50 60" stroke="white" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/60 mix-blend-multiply"></div>
        </div>

        {/* --- CONTENT & LAYOUT --- */}
        {/* z-10 ensures content sits above the background */}
        <div className="relative z-10 flex flex-col flex-grow">
          
          <Navbar /> 

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/events" element={<Events />} />
              <Route path="/posts" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/donations" element={<Donations />} />
            </Routes>
          </main>

          <Footer /> {/* <--- ADDED FOOTER HERE */}

        </div>

      </div>
    </Router>
  );
}