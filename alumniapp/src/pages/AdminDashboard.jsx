import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Calendar, Briefcase, Trash2, LogOut, ShieldAlert, Activity, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, posts: 0, events: 0, opportunities: 0, userDistribution: [], contentData: [] });
  const [usersList, setUsersList] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'Admin') navigate('/');
    fetchStats();
    fetchAllUsers();
    fetchPosts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats');
      const data = await res.json();
      
      // Process Data for Pie Chart
      const pieData = data.userDistribution.map(item => ({
        name: item._id || 'Unknown',
        value: item.count
      }));

      setStats({ ...data, userDistribution: pieData });
    } catch (err) { console.error(err); }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/all');
      setUsersList(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      setPostsList(await res.json());
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Delete this user?")) return;
    await fetch(`http://localhost:5000/api/admin/user/${id}`, { method: 'DELETE' });
    fetchAllUsers(); fetchStats();
  };

  const deletePost = async (id) => {
    if(!window.confirm("Delete post?")) return;
    await fetch(`http://localhost:5000/api/admin/post/${id}`, { method: 'DELETE' });
    fetchPosts(); fetchStats();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // CHART COLORS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#031130] text-white p-6 flex flex-col fixed h-full z-10 shadow-xl">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2 text-teal-400">
            <ShieldAlert /> Admin Panel
        </h1>
        
        <nav className="space-y-2 flex-1">
            <SidebarBtn label="Analytics" icon={<Activity size={20} />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarBtn label="Manage Users" icon={<Users size={20} />} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <SidebarBtn label="Manage Posts" icon={<FileText size={20} />} active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 font-bold mt-auto p-2">
            <LogOut size={20} /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        
        {/* === OVERVIEW / ANALYTICS TAB === */}
        {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
                <h2 className="text-3xl font-bold text-slate-800">Platform Analytics</h2>
                
                {/* 1. Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Total Users" value={stats.users} icon={<Users />} color="bg-blue-500" />
                    <StatCard label="Total Posts" value={stats.posts} icon={<FileText />} color="bg-teal-500" />
                    <StatCard label="Events" value={stats.events} icon={<Calendar />} color="bg-purple-500" />
                    <StatCard label="Opportunities" value={stats.opportunities} icon={<Briefcase />} color="bg-orange-500" />
                </div>

                {/* 2. Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Content Distribution (Bar Chart) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-700">
                            <BarIcon className="text-teal-500" size={20}/> Content Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={stats.contentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Demographics (Pie Chart) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-700">
                            <PieIcon className="text-purple-500" size={20}/> User Demographics
                        </h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie 
                                    data={stats.userDistribution} 
                                    cx="50%" cy="50%" 
                                    innerRadius={80} 
                                    outerRadius={120} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {stats.userDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* === USERS TAB === */}
        {activeTab === 'users' && (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">User Management</h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-bold text-slate-500">User</th>
                                <th className="p-4 font-bold text-slate-500">Role</th>
                                <th className="p-4 font-bold text-slate-500">Email</th>
                                <th className="p-4 font-bold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map(u => (
                                <tr key={u._id} className="border-b hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                                            {u.profilePic && <img src={u.profilePic} className="w-full h-full object-cover" alt="u"/>}
                                        </div>
                                        {u.username}
                                    </td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.userType === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{u.userType}</span></td>
                                    <td className="p-4 text-slate-500">{u.email}</td>
                                    <td className="p-4 text-right">
                                        {u.userType !== 'Admin' && (
                                            <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition"><Trash2 size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* === POSTS TAB === */}
        {activeTab === 'posts' && (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Post Management</h2>
                <div className="grid grid-cols-1 gap-4">
                    {postsList.map(post => (
                        <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-start border border-slate-100">
                            <div>
                                <h4 className="font-bold text-lg">{post.author}</h4>
                                <p className="text-slate-600 mt-1">{post.content}</p>
                                <span className="text-xs text-slate-400 mt-2 block">{post.timestamp}</span>
                            </div>
                            <button onClick={() => deletePost(post._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold hover:bg-red-50 px-3 py-1 rounded transition"><Trash2 size={16}/> Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

// Components
function SidebarBtn({ label, icon, active, onClick }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
            {icon} {label}
        </button>
    )
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
                <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            </div>
        </div>
    )
}