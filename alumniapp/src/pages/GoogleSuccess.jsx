import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. Extract params from URL
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const role = searchParams.get('role');
    const pic = searchParams.get('pic');

    if (token && username) {
      // 2. Save to Storage
      localStorage.clear();
      localStorage.setItem('userToken', token);
      localStorage.setItem('userName', username);
      localStorage.setItem('userRole', role || 'Student');
      localStorage.setItem('userPic', pic || '');
      
      // Default fallback values
      localStorage.setItem('userCollege', 'Borcelle University');
      localStorage.setItem('userJobRole', 'Student');

      // 3. Redirect
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      navigate('/'); // Failed
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#031130] text-white font-sans">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold">Logging you in...</h2>
      <p className="text-slate-400 mt-2">Please wait a moment.</p>
    </div>
  );
}