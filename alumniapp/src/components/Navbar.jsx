import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, Users, Heart, User, LogOut, Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // STATE
  const [userInfo, setUserInfo] = useState({ name: '', role: '', pic: '' });
  const [searchQuery, setSearchQuery] = useState(''); // <--- NEW SEARCH STATE

  // RE-FETCH DATA
  useEffect(() => {
    setUserInfo({
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'Student',
      pic: localStorage.getItem('userPic') || ''
    });
  }, [location]);

  if (location.pathname === '/' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path ? 'text-teal-400 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5';

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // --- NEW: HANDLE SEARCH ---
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/accounts?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear input after search
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031130]/80 backdrop-blur-md border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform">AC</div>
          <div className="leading-none hidden sm:block">
            <h1 className="text-white font-bold text-lg tracking-tight">Alumni</h1>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">Connect</span>
          </div>
        </Link>

        {/* --- NEW SEARCH BAR --- */}
        <div className="hidden md:block flex-grow max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-teal-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search alumni, students, or roles..." 
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* NAVIGATION LINKS (Compact) */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 shrink-0">
          <NavItem to="/dashboard" icon={<Home size={18} />} activeClass={isActive('/dashboard')} title="Home" />
          <NavItem to="/posts" icon={<MessageSquare size={18} />} activeClass={isActive('/posts')} title="Feed" />
          <NavItem to="/events" icon={<Calendar size={18} />} activeClass={isActive('/events')} title="Events" />
          <NavItem to="/accounts" icon={<Users size={18} />} activeClass={isActive('/accounts')} title="Directory" />
          <NavItem to="/donations" icon={<Heart size={18} />} activeClass={isActive('/donations')} title="Donate" />
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-bold">{userInfo.name}</p>
              <p className="text-gray-400 text-[10px] uppercase font-bold">{userInfo.role}</p>
            </div>
            {userInfo.pic ? (
              <img key={userInfo.pic} src={userInfo.pic} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-teal-400 bg-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-teal-400"><User size={20} className="text-white" /></div>
            )}
          </Link>
          <div className="h-8 w-px bg-white/10 mx-1"></div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-2"><LogOut size={20} /></button>
        </div>

      </div>
    </nav>
  );
}

function NavItem({ to, icon, activeClass, title }) {
  return (
    <Link to={to} className={`p-2.5 rounded-full transition-all ${activeClass}`} title={title}>
      {icon}
    </Link>
  );
}