import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  // --- CRITICAL FIX 1: CLEAR STORAGE ON LOAD ---
  // This ensures no data from a previous user lingers
  useEffect(() => {
    localStorage.clear(); 
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = () => {
    // 1. Configuration (Taken from your screenshot)
    const googleClientId = '852267957215-2e9l35kb9hfk7rvsio8gf34ehl94vt7k.apps.googleusercontent.com';
    const redirectUri = 'https://ctrl-alt-elite-bcknd.onrender.com/api/auth/google/callback';
    const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    
    // 2. Redirect to Google
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // --- CRITICAL FIX 2: SAVE ALL USER DATA ---
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.userType);
        localStorage.setItem('userName', data.username);
        
        // Save Profile Data
        localStorage.setItem('userPic', data.profilePic || ''); 
        localStorage.setItem('userCollege', data.collegeName || 'Borcelle University');
        localStorage.setItem('userDept', data.department || '');
        localStorage.setItem('userJobRole', data.currentJobRole || 'Alumni'); 
        
        // Redirect Logic
        setTimeout(() => {
          if (data.userType === 'Admin') {
            console.log("👑 Admin Login Detected - Redirecting to Panel");
            navigate('/admin');
          } else {
            console.log("✅ User Login Detected - Redirecting to Dashboard");
            navigate('/dashboard');
          }
        }, 100);

      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      alert("Backend error. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      
      {/* CARD: Premium Design */}
      <div className="bg-white w-full max-w-[600px] p-12 md:p-16 shadow-2xl rounded-[2.5rem] transform transition-all duration-500 hover:scale-[1.01] hover:shadow-teal-500/10 animate-fade-in-up">
        
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-lg">Enter your details to access your account</p>
        </div>

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

            {/* GOOGLE BUTTON */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
            >
              {/* Google Icon SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
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