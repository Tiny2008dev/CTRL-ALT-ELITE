import React, { useState } from 'react';
import { User, Lock, Mail, Calendar, Eye, EyeOff, GraduationCap, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({ 
    username: '', email: '', password: '', confirmPassword: '', 
    year: '', department: '', collegeName: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

    try {
      const response = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }), 
      });
      if (response.ok) {
        alert("Registration Successful!");
        navigate('/'); // Redirect to Login
      } else {
        const data = await response.json();
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      alert("Backend connection failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-12">
      
      {/* CARD: Wider (650px) and more padding for the larger form */}
      <div className="bg-white w-full max-w-[650px] p-12 md:p-16 shadow-2xl rounded-[2.5rem] transform transition-all duration-500 hover:scale-[1.005] hover:shadow-teal-500/10 animate-fade-in-up">
        
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Create Account
          </h2>
          <p className="text-slate-500 text-lg">Join the alumni network today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* USER TYPE TOGGLE - Modern Pill Style */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative">
            {/* Animated Background Pill (Optional complexity, kept simple for now) */}
            <button 
              type="button" 
              onClick={() => setUserType('student')} 
              className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all duration-300 ${userType === 'student' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Student
            </button>
            <button 
              type="button" 
              onClick={() => setUserType('alumni')} 
              className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all duration-300 ${userType === 'alumni' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Alumni
            </button>
          </div>

          {/* USERNAME */}
          <div className="relative group">
            <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
               <User size={24} />
            </div>
            <input name="username" placeholder="Username" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
          </div>

          {/* EMAIL */}
          <div className="relative group">
            <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
               <Mail size={24} />
            </div>
            <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
          </div>

          {/* ROW: PASSWORD & CONFIRM (To save vertical space) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                 <Lock size={24} />
              </div>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-10 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-slate-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                 <Lock size={24} />
              </div>
              <input type="password" name="confirmPassword" placeholder="Confirm" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
            </div>
          </div>

          {/* YEAR & DEPARTMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="relative group">
               <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  <Calendar size={24} />
               </div>
               <input name="year" type="number" placeholder={userType === 'alumni' ? "Grad Year" : "Current Year"} onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
             </div>

             <div className="relative group">
               <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  <GraduationCap size={24} />
               </div>
               <input name="department" type="text" placeholder="Department" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
             </div>
          </div>
          
          {/* COLLEGE NAME */}
          <div className="relative group">
            <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
               <Building size={24} />
            </div>
            <input name="collegeName" type="text" placeholder="College Name" onChange={handleChange} className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 font-medium text-lg" required />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl text-lg font-bold tracking-wide shadow-lg hover:bg-gray-900 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
              Register
            </button>
          </div>
          
          <div className="text-center text-base text-gray-500">
            Already have an account? <button type="button" onClick={() => navigate('/')} className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all ml-1">Log in</button>
          </div>

        </form>
      </div>
    </div>
  );
}