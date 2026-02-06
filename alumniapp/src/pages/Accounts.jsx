import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <--- NEW IMPORT
import { Search, MapPin, Briefcase, GraduationCap, Mail, User } from 'lucide-react';

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams(); // Read URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // 1. FETCH ALL USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. SYNC SEARCH BAR WITH NAVBAR INPUT
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/all');
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  // 3. FILTER LOGIC (Name, Job, or Department)
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.department && user.department.toLowerCase().includes(term)) ||
      (user.currentJobRole && user.currentJobRole.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#031130] text-white font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl mb-10 animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Alumni Directory</h1>
        <p className="text-gray-400 text-lg mb-8">Connect with graduates and students across the network.</p>
        
        {/* LOCAL SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, department, or job role..." 
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-teal-500 transition-colors backdrop-blur-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DIRECTORY GRID */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
        {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-xl flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-teal-500 cursor-pointer group">
            
            {/* Profile Pic */}
            <div className="flex-shrink-0">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.username} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-200">
                  <User size={32} />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="overflow-hidden min-w-0">
              <h3 className="text-slate-900 font-bold text-lg truncate">{user.fullName || user.username}</h3>
              
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${user.userType === 'alumni' || user.userType === 'Alumni' ? 'bg-black text-white' : 'bg-teal-100 text-teal-800'}`}>
                  {user.userType}
                </span>
              </div>
              
              <div className="space-y-0.5">
                {user.currentJobRole && (
                  <p className="text-slate-600 text-xs flex items-center gap-1 truncate font-bold">
                    <Briefcase size={12} /> {user.currentJobRole}
                  </p>
                )}
                {user.department && (
                  <p className="text-slate-500 text-xs flex items-center gap-1 truncate font-medium">
                    <GraduationCap size={12} className="text-teal-600" /> {user.department}
                  </p>
                )}
                {user.email && (
                  <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                    <Mail size={12} /> {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
            <p className="text-gray-400">No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}