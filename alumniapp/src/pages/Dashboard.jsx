import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart2, Calendar, Lightbulb, Heart, Plus, Trophy, MessageCircle, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'Student' });

  useEffect(() => {
    // 1. Check if user is logged in
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/'); // Redirect to login if no token
    } else if (role === 'Admin') {
      navigate('/admin'); // Redirect Admin to Admin Panel
    }

    // 2. Set user info
    setUser({
      name: localStorage.getItem('userName') || 'User',
      role: role || 'Student'
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    // UPDATED CONTAINER: min-h-screen allows scrolling, pt-28 pushes content below Navbar
    <div className="min-h-screen w-full bg-[#031130] text-white font-sans flex flex-col items-center pt-28 pb-12 px-4 md:px-8">
      
      <div className="w-full max-w-[1600px] flex flex-col gap-6 animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex justify-between items-end px-2 mb-2">
          <div>
            {/* Reduced Title size slightly so it doesn't fight with Navbar */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">
              Welcome Back, <span className="text-teal-400">{user.name}</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-bold mt-2 ml-1 tracking-widest uppercase opacity-80">
              {user.role} DASHBOARD
            </p>
          </div>
          
          
        </div>

        {/* GRID LAYOUT - Fixed height on desktop for Bento look, auto on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* 1. MY PROFILE (Big Card - Spans 2 Rows) */}
          <div 
            onClick={() => navigate('/profile')} 
            className="col-span-1 md:row-span-2 bg-gradient-to-b from-gray-200 to-gray-400 rounded-[2.5rem] p-8 flex flex-col justify-between relative group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(45,212,191,0.4)] transition-all duration-300"
          >
             <div className="absolute inset-0 bg-teal-400/0 group-hover:bg-teal-400/5 rounded-[2.5rem] transition-colors duration-500"></div>
             <div className="absolute top-6 right-6 bg-black/80 rounded-full p-2 opacity-80 group-hover:scale-110 transition-transform"><Plus size={16} className="text-white" strokeWidth={3} /></div>
             
             <div className="flex-grow flex items-center justify-center">
               <div className="relative group-hover:scale-110 transition-transform duration-500">
                 <div className="absolute -inset-6 bg-teal-300/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <User size={140} strokeWidth={0.8} className="text-slate-800 relative z-10" />
                 <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-teal-300 rounded-full mix-blend-multiply opacity-60"></div>
               </div>
             </div>
             
             <h3 className="text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">My Profile</h3>
          </div>

          {/* 2. LEADERBOARD */}
          <DashboardCard 
            title="Leaderboard" 
            icon={<Trophy size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/leaderboard')} 
          />

          {/* 3. COMMUNITY FEED */}
          <DashboardCard 
            title="Community Feed" 
            icon={<BarChart2 size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/posts')} 
          />

          {/* 4. CHAT & DIRECTORY */}
          <DashboardCard 
            title="Chat & Directory" 
            icon={<MessageCircle size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/accounts')} 
          />

          {/* 5. EVENTS */}
          <DashboardCard 
            title="Events" 
            icon={<Calendar size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/events')} 
          />

          {/* 6. MENTORSHIP */}
          <DashboardCard 
            title="Mentorship" 
            icon={<Lightbulb size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/mentorship')} 
          />

          {/* 7. DONATIONS */}
          <DashboardCard 
            title="Donations" 
            icon={<Heart size={42} strokeWidth={1.2} />} 
            isPurple={true} 
            onClick={() => navigate('/donations')} 
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
function DashboardCard({ title, icon, isPurple, onClick }) {
  return (
    <div onClick={onClick} className={`relative bg-gradient-to-b from-gray-200 to-gray-400 rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${isPurple ? 'hover:shadow-indigo-500/30' : 'hover:shadow-teal-500/20'}`}>
      <div className="absolute top-6 right-6 bg-black/80 rounded-full p-1.5 opacity-80 group-hover:scale-110 transition-transform"><Plus size={12} className="text-white" strokeWidth={3} /></div>
      <div className="mt-2 w-16 h-16 rounded-2xl flex items-center justify-center relative">
        <div className="absolute top-[-4px] right-[-4px] w-5 h-5 bg-teal-300 rounded-full opacity-70 group-hover:animate-pulse"></div>
        <div className="text-slate-800 relative z-10 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 leading-tight w-4/5 tracking-tight">{title}</h3>
    </div>
  );
}