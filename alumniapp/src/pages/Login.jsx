import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Inside src/pages/Login.jsx

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
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userRole', data.userType);
      
      // SAVE USERNAME HERE
      localStorage.setItem('userName', data.username); 
      
      navigate('/dashboard');
    } else {
      alert(data.message || "Invalid Credentials");
    }
  } catch (error) {
    alert("Backend error. Is the server running?");
  }
};

  return (
    // Flex container centered. overflow-y-auto handles small screens if card gets too tall.
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      
      {/* CARD: Increased max-width to 600px and padding to p-16 for that "premium" feel */}
      <div className="bg-white w-full max-w-[600px] p-12 md:p-16 shadow-2xl rounded-[2.5rem] transform transition-all duration-500 hover:scale-[1.01] hover:shadow-teal-500/10 animate-fade-in-up">
        
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-lg">Enter your details to access your account</p>
        </div>

        {/* Form Spacing increased to space-y-8 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* USERNAME INPUT */}
          <div className="relative group">
            <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
               <User size={24} />
            </div>
            <input 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-6 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 placeholder-gray-400 text-lg font-medium" 
              required 
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="relative group">
             <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
               <Lock size={24} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              className="w-full bg-slate-50 text-slate-800 py-4 pl-14 pr-14 rounded-2xl border-2 border-transparent focus:bg-white focus:border-teal-500 focus:shadow-lg outline-none transition-all duration-300 placeholder-gray-400 text-lg font-medium" 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-5 top-4 text-gray-400 hover:text-slate-700 transition-colors"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          {/* BUTTONS SECTION */}
          <div className="space-y-4 pt-2">
            <button 
              type="submit" 
              className="w-full bg-black text-white py-4 rounded-2xl text-lg font-bold tracking-wide shadow-lg hover:bg-gray-900 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              Log in
            </button>
            
            <div className="w-full flex items-center justify-center gap-3 opacity-60 py-2">
               <div className="h-px bg-gray-300 flex-1"></div>
               <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Or</span>
               <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <button 
              type="button" 
              className="w-full bg-[#0077b5] text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold shadow-md hover:bg-[#00669c] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <Linkedin size={24} /> 
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* SIGN UP LINK */}
          <div className="text-center text-base text-gray-500 mt-6">
            New to AlumniConnect?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/register')} 
              className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all ml-1"
            >
              Create an account
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}