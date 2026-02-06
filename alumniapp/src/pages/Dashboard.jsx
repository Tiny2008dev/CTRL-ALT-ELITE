import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, BarChart2, Users, Calendar, Lightbulb, Heart, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Alumni';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="h-screen w-full bg-[#031130] text-white font-sans flex flex-col justify-center items-center overflow-hidden">
      <div className="w-[95%] max-w-[1800px] h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-6 shrink-0 px-2">
          <div>
            <h1 className="text-6xl font-bold tracking-tight leading-none">Alumni<br />Connect</h1>
            <p className="text-teal-400 text-lg tracking-widest uppercase font-bold mt-2 ml-1 opacity-90">Welcome back, {userRole}</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-white transition-all border-b-2 border-transparent hover:border-white pb-1">LOG OUT</button>
        </div>

        {/* GRID */}
        <div className="flex-grow grid grid-cols-4 grid-rows-2 gap-6">
          
          {/* 1. ACCOUNTS CARD -> LINKS TO PROFILE PAGE */}
          <div 
            onClick={() => navigate('/profile')} 
            className="col-span-1 row-span-2 bg-gradient-to-b from-gray-200 to-gray-400 rounded-[2.5rem] p-8 flex flex-col justify-between relative group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(45,212,191,0.4)] transition-all duration-300"
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
             <h3 className="text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">Accounts</h3>
          </div>

          {/* 2. EMPLOYEE HANDBOOK */}
          <DashboardCard title="Employee Handbook" icon={<FileText size={42} strokeWidth={1.2} />} />

          {/* 3. POSTS -> LINKS TO FEED */}
          <DashboardCard 
            title="Posts and comments" 
            icon={<BarChart2 size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/posts')} 
          />

          {/* 4. HIRING */}
          <DashboardCard title="Hiring" icon={<Users size={42} strokeWidth={1.2} />} />

          {/* 5. EVENTS -> LINKS TO EVENTS */}
          <DashboardCard 
            title="New upcoming events" 
            icon={<Calendar size={42} strokeWidth={1.2} />} 
            onClick={() => navigate('/events')} 
          />

          {/* 6. MENTORSHIP */}
          <DashboardCard title="Mentorship" icon={<Lightbulb size={42} strokeWidth={1.2} />} />

          {/* 7. DONATIONS -> LINKS TO DONATIONS */}
          <DashboardCard 
            title="Donations" 
            icon={<Heart size={42} strokeWidth={1.2} />} 
            isPurple={true} 
            onClick={() => navigate('/donations')} // <--- ADDED THIS LINK
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, icon, isPurple, onClick }) {
  return (
    <div onClick={onClick} className={`relative bg-gradient-to-b from-gray-200 to-gray-400 rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${isPurple ? 'hover:shadow-indigo-500/30' : 'hover:shadow-teal-500/20'}`}>
      <div className="absolute top-6 right-6 bg-black/80 rounded-full p-1.5 opacity-80 group-hover:scale-110 transition-transform"><Plus size={12} className="text-white" strokeWidth={3} /></div>
      <div className="mt-2 w-16 h-16 rounded-2xl flex items-center justify-center relative"><div className="absolute top-[-4px] right-[-4px] w-5 h-5 bg-teal-300 rounded-full opacity-70 group-hover:animate-pulse"></div><div className="text-slate-800 relative z-10 group-hover:scale-110 transition-transform duration-300">{icon}</div></div>
      <h3 className="text-3xl font-bold text-slate-800 leading-tight w-4/5 tracking-tight">{title}</h3>
    </div>
  );
}