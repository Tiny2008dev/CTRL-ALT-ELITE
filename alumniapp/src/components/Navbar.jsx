import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, Users, Heart, User, LogOut, Search, Bell } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // STATE
  const [userInfo, setUserInfo] = useState({ name: '', role: '', pic: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // RE-FETCH DATA ON NAVIGATION
  useEffect(() => {
    setUserInfo({
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'Student',
      pic: localStorage.getItem('userPic') || ''
    });
  }, [location]);

  // HIDE NAVBAR ON: Login, Register, and ADMIN Pages
  if (['/', '/register', '/admin'].includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path 
    ? 'text-white bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' 
    : 'text-slate-400 hover:text-white hover:bg-white/10';

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate('/'); 
  };

  // --- HANDLE SEARCH ---
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to Accounts page with search param
      navigate(`/accounts?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear input
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031130]/90 backdrop-blur-xl border-b border-white/10 h-20 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between gap-4">
        
        {/* 1. LOGO */}
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            AC
          </div>
          <div className="leading-tight hidden sm:block">
            <h1 className="text-white font-bold text-lg tracking-tight group-hover:text-teal-400 transition-colors">AlumniConnect</h1>
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Community</p>
          </div>
        </Link>

        {/* 2. SEARCH BAR (Hidden on mobile) */}
        <div className="hidden md:block flex-grow max-w-lg mx-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search alumni, students, or roles..." 
              className="w-full bg-[#0f1d3e] border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-[#1a2b55] transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* 3. NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0f1d3e] p-1.5 rounded-full border border-white/5 shrink-0">
          <NavItem to="/dashboard" icon={<Home size={18} />} activeClass={isActive('/dashboard')} title="Home" />
          <NavItem to="/posts" icon={<MessageSquare size={18} />} activeClass={isActive('/posts')} title="Feed" />
          <NavItem to="/events" icon={<Calendar size={18} />} activeClass={isActive('/events')} title="Events" />
          <NavItem to="/accounts" icon={<Users size={18} />} activeClass={isActive('/accounts')} title="Directory" />
          <NavItem to="/mentorship" icon={<Bell size={18} />} activeClass={isActive('/mentorship')} title="Mentorship" />
          <NavItem to="/donations" icon={<Heart size={18} />} activeClass={isActive('/donations')} title="Donate" />
        </div>

        {/* 4. PROFILE & LOGOUT */}
        <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-white/10 ml-2">
          
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden xl:block">
              <p className="text-white text-sm font-bold group-hover:text-teal-400 transition-colors">{userInfo.name}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{userInfo.role}</p>
            </div>
            
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-teal-400 to-blue-600 group-hover:shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all">
               <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                 {userInfo.pic ? (
                   <img src={userInfo.pic} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-white"><User size={18} /></div>
                 )}
               </div>
            </div>
          </Link>

          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 p-2.5 rounded-full transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>

        </div>

      </div>
    </nav>
  );
}

// Helper Component for Nav Items
function NavItem({ to, icon, activeClass, title }) {
  return (
    <Link to={to} className={`p-3 rounded-full transition-all duration-300 ${activeClass}`} title={title}>
      {icon}
    </Link>
  );
}