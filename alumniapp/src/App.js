import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Menu, X, Mail, Calendar, Building, GraduationCap, Linkedin } from 'lucide-react';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('login'); 

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans text-slate-800">
      {/* BACKGROUND SECTION */}
      <div className="absolute inset-0 z-0 bg-[#0a1e50]">
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 60 10 M 0 30 L 60 30 M 0 50 L 60 50" stroke="white" strokeWidth="0.5" fill="none"/>
              <path d="M 10 0 L 10 60 M 30 0 L 30 60 M 50 0 L 50 60" stroke="white" strokeWidth="0.5" fill="none"/>
              <path d="M 0 60 L 60 0" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/60 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* NAVIGATION BAR */}
        <nav className="flex items-center justify-between px-8 py-6 w-full text-white">
          <div className="text-2xl font-bold tracking-wide">AlumniConnect.</div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <a href="#" className="hover:text-blue-200 transition-colors">HOME</a>
            <button 
              onClick={() => setCurrentView('login')}
              className={`hover:text-blue-200 transition-colors ${currentView === 'login' ? 'border-b-2 border-white pb-1' : ''}`}
            >
              LOG IN
            </button>
          </div>
          <button onClick={toggleMobileMenu} className="md:hidden text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex items-center justify-center p-4">
          {currentView === 'login' ? (
            <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Welcome back, ${formData.username}!`);
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.userType);
      } else {
        alert(data.message || "Invalid Username or Password");
      }
    } catch (error) {
      alert("Error: Backend not running on localhost:5000");
    }
  };

  return (
    <div className="bg-white w-full max-w-[500px] p-10 shadow-2xl animate-fade-in-up">
      <h2 className="text-4xl font-bold text-center mb-10 text-black">Log in</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <User size={20} className="absolute left-3 top-3 text-gray-500" />
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full bg-gray-200 py-3 pl-10 outline-none italic" required />
        </div>
        <div className="relative group">
          <Lock size={20} className="absolute left-3 top-3 text-gray-500" />
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full bg-gray-200 py-3 pl-10 outline-none italic" required />
        </div>
        <button type="submit" className="w-full bg-black text-white py-3 font-medium shadow-lg hover:bg-gray-800 transition-all">Log in</button>
        <div className="text-center text-sm text-gray-600">
          or <button type="button" onClick={onSwitchToRegister} className="underline font-semibold">Sign up</button>
        </div>
      </form>
    </div>
  );
}

function RegisterForm({ onSwitchToLogin }) {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({ 
    username: '', email: '', password: '', confirmPassword: '', year: '', department: '', collegeName: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords match error!");

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }), 
      });
      if (response.ok) {
        alert("Registration Saved to MongoDB!");
        onSwitchToLogin();
      }
    } catch (error) {
      alert("Backend connection failed.");
    }
  };

  return (
    <div className="bg-white w-full max-w-[500px] p-10 shadow-2xl animate-fade-in-up">
      <h2 className="text-4xl font-bold text-center mb-8 text-black">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex bg-gray-200 p-1 mb-4">
          <button type="button" onClick={() => setUserType('student')} className={`flex-1 py-2 ${userType === 'student' ? 'bg-white shadow' : ''}`}>Student</button>
          <button type="button" onClick={() => setUserType('alumni')} className={`flex-1 py-2 ${userType === 'alumni' ? 'bg-white shadow' : ''}`}>Alumni</button>
        </div>
        <input name="username" placeholder="Username" onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <input name="year" type="number" placeholder={userType === 'alumni' ? "Year of Passing" : "Current Year"} onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <input name="department" placeholder="Department" onChange={handleChange} className="w-full bg-gray-200 py-3 px-4 outline-none italic" required />
        <button type="submit" className="w-full bg-black text-white py-3 font-medium shadow-lg hover:bg-gray-800 transition-all">Register</button>
        <div className="text-center text-sm text-gray-600">
          Already have an account? <button type="button" onClick={onSwitchToLogin} className="underline font-semibold">Log in</button>
        </div>
      </form>
    </div>
  );
}