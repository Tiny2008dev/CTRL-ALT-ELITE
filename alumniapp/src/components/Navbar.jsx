import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, Users, Heart, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // STATE TO HOLD USER DATA
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: '',
    pic: ''
  });

  // RE-FETCH DATA ON EVERY ROUTE CHANGE
  useEffect(() => {
    // Get fresh data from storage
    const name = localStorage.getItem('userName') || 'User';
    const role = localStorage.getItem('userRole') || 'Student';
    const pic = localStorage.getItem('userPic') || '';
    
    setUserInfo({ name, role, pic });
  }, [location]); // Runs whenever the URL changes (e.g. Login -> Dashboard)

  // Hide Navbar on Login/Register
  if (location.pathname === '/' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path ? 'text-teal-400 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031130]/80 backdrop-blur-md border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform">AC</div>
          <div className="leading-none">
            <h1 className="text-white font-bold text-lg tracking-tight">Alumni</h1>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">Connect</span>
          </div>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
          <NavItem to="/dashboard" icon={<Home size={18} />} label="Home" activeClass={isActive('/dashboard')} />
          <NavItem to="/posts" icon={<MessageSquare size={18} />} label="Feed" activeClass={isActive('/posts')} />
          <NavItem to="/events" icon={<Calendar size={18} />} label="Events" activeClass={isActive('/events')} />
          <NavItem to="/accounts" icon={<Users size={18} />} label="Directory" activeClass={isActive('/accounts')} />
          <NavItem to="/donations" icon={<Heart size={18} />} label="Donate" activeClass={isActive('/donations')} />
        </div>

        {/* PROFILE SECTION */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-bold">{userInfo.name}</p>
              <p className="text-gray-400 text-[10px] uppercase font-bold">{userInfo.role}</p>
            </div>
            
            {/* CONDITIONAL RENDERING FOR IMAGE */}
            {userInfo.pic ? (
              <img 
                key={userInfo.pic} // Force re-render if string changes
                src={userInfo.pic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-400 bg-white" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-teal-400">
                <User size={20} className="text-white" />
              </div>
            )}
          </Link>
          
          <div className="h-8 w-px bg-white/10 mx-1"></div>

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-2" title="Log Out">
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </nav>
  );
}

function NavItem({ to, icon, label, activeClass }) {
  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${activeClass}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}