import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// --- PAGES ---
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Feed from './pages/Feed';         
import Accounts from './pages/Accounts'; // <--- 1. ADD THIS IMPORT
import Profile from './pages/Profile';   
import Donations from './pages/Donations'; 
import Mentorship from './pages/Mentorship'; 
import PublicProfile from './pages/PublicProfile'; 
import Leaderboard from './pages/Leaderboard'; 

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans text-slate-800 bg-[#031130]">
        
        {/* --- GLOBAL BACKGROUND DECOR --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="relative z-10 flex flex-col flex-grow">
          
          <Navbar /> 

          <main className="flex-grow">
            <Routes>
              {/* AUTH ROUTES */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* APP ROUTES */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/posts" element={<Feed />} />
              <Route path="/events" element={<Events />} />
              
              {/* --- 2. ADD THIS ROUTE --- */}
              <Route path="/accounts" element={<Accounts />} />
              {/* ------------------------- */}

              <Route path="/profile" element={<Profile />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/user/:username" element={<PublicProfile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </div>
    </Router>
  );
}