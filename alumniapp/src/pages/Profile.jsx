import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Edit3, Shield, Bell, Clock, Activity, Users as UsersIcon } from 'lucide-react';

export default function Profile() {
  const fileInputRef = useRef(null);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('settings');
  
  // User Data State
  const [userData, setUserData] = useState({
    username: '', fullName: '', email: '', password: '', // Password is usually hidden
    department: '', year: '', bio: '', phone: '', location: '', profilePic: ''
  });

  const currentUserName = localStorage.getItem('userName');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${currentUserName}`);
      const data = await res.json();
      if (data) {
        setUserData({
          username: data.username || '',
          fullName: data.fullName || '', // New Field
          email: data.email || '',
          password: '••••••••', // Masked
          department: data.department || '',
          year: data.year || '',
          bio: data.bio || 'No bio yet.',
          phone: data.phone || '',
          location: data.location || '',
          profilePic: data.profilePic || ''
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${currentUserName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) alert("Profile Saved Successfully!");
    } catch (err) { alert("Error saving profile"); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result;
      setUserData({ ...userData, profilePic: base64 });
      // Save immediately
      await fetch(`http://localhost:5000/api/user/${currentUserName}/photo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePic: base64 })
      });
      localStorage.setItem('userPic', base64); // Sync across app
    };
  };

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans p-4 md:p-12 flex items-center justify-center pt-24">
      
      {/* MAIN CARD CONTAINER */}
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col items-center text-center">
          
          {/* Profile Pic */}
          <div className="relative group mb-6">
            <div className="w-40 h-40 rounded-full bg-slate-200 border-4 border-white shadow-xl overflow-hidden">
              {userData.profilePic ? (
                <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User size={64} />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors shadow-md"
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">{userData.fullName || userData.username}</h2>
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            {localStorage.getItem('userRole') || 'Student'}
          </span>

          <div className="w-full space-y-4 text-left px-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={18} className="text-teal-500" />
              <span className="truncate">{userData.email || 'No email added'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={18} className="text-teal-500" />
              <span>{userData.phone || '+1 (555) 000-0000'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={18} className="text-teal-500" />
              <span>{userData.location || 'New York, USA'}</span>
            </div>
          </div>

          <div className="w-full text-left px-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Bio</h3>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "{userData.bio}"
            </p>
          </div>
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
          
          {/* TABS */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
            {['Profile Settings', 'Account Security', 'Notification Preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.toLowerCase().split(' ')[0] 
                    ? 'text-black' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase().split(' ')[0] && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: SETTINGS */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in-up flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Full Name</label>
                  <input name="fullName" value={userData.fullName} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Username</label>
                  <input name="username" value={userData.username} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Email Address</label>
                  <input name="email" value={userData.email} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Phone</label>
                  <input name="phone" value={userData.phone} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="+1..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Department</label>
                  <input name="department" value={userData.department} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Graduation Year</label>
                  <input name="year" value={userData.year} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500">Bio / About Me</label>
                  <textarea name="bio" value={userData.bio} onChange={handleChange} rows="3" className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none" placeholder="Tell us about yourself..." />
                </div>
              </div>

              <button onClick={handleSave} className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <ActivityItem icon={<Clock size={16} />} text="Joined 'Tech Talk 2025' event" time="2 hours ago" />
                  <ActivityItem icon={<Edit3 size={16} />} text="Updated bio information" time="1 day ago" />
                  <ActivityItem icon={<UsersIcon size={16} />} text="Connected with Alumni Jane Doe" time="3 days ago" />
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SECURITY (Placeholder) */}
          {activeTab === 'account' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Shield size={48} className="mb-4 text-slate-200" />
              <p>Security settings coming soon.</p>
            </div>
          )}

          {/* TAB CONTENT: NOTIFICATIONS (Placeholder) */}
          {activeTab === 'notification' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Bell size={48} className="mb-4 text-slate-200" />
              <p>Notification preferences coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="bg-slate-100 p-2 rounded-full text-slate-500">{icon}</div>
      <span className="font-medium text-slate-700 flex-grow">{text}</span>
      <span className="text-slate-400 text-xs">{time}</span>
    </div>
  );
}