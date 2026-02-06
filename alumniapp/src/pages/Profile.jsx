import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Bell, Check, X, Briefcase, Heart, MessageSquare, Clock, Loader } from 'lucide-react';

export default function Profile() {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [requests, setRequests] = useState([]); 
  
  // --- NEW STATE FOR POSTS & LIGHTBOX ---
  const [myPosts, setMyPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // USER DATA STATE
  const [userData, setUserData] = useState({
    username: '', fullName: '', email: '', 
    department: '', year: '', bio: '', phone: '', location: '', profilePic: '',
    currentJobRole: ''
  });

  const currentUserName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchUserData();
    fetchRequests();
    fetchMyPosts(); // <--- FETCH POSTS ON LOAD
  }, []);

  // 1. FETCH USER PROFILE
  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${currentUserName}`);
      const data = await res.json();
      if (data) {
        setUserData({
          username: data.username || '',
          fullName: data.fullName || '',
          email: data.email || '',
          department: data.department || '',
          year: data.year || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          profilePic: data.profilePic || '',
          currentJobRole: data.currentJobRole || ''
        });
      }
    } catch (err) { console.error(err); }
  };

  // 2. FETCH REQUESTS
  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${currentUserName}`);
      const data = await res.json();
      setRequests(data.notifications || []);
    } catch (err) { console.error("Error fetching requests"); }
  };

  // 3. FETCH MY POSTS (NEW)
  const fetchMyPosts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/user/${currentUserName}`);
      const data = await res.json();
      setMyPosts(data);
    } catch (err) { console.error("Error fetching my posts"); }
  };

  // 4. HANDLERS
  const handleResponse = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setRequests(prev => prev.map(req => req._id === id ? { ...req, status } : req));
    } catch (err) { alert("Action failed"); }
  };

  const toggleComments = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
  
  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/user/${currentUserName}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) });
    localStorage.setItem('userJobRole', userData.currentJobRole);
    alert("Profile Saved!");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUserData({ ...userData, profilePic: reader.result });
      await fetch(`http://localhost:5000/api/user/${currentUserName}/photo`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profilePic: reader.result }) });
      localStorage.setItem('userPic', reader.result);
    };
  };

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans p-4 md:p-12 flex items-center justify-center pt-24">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] animate-fade-in-up">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col items-center text-center">
          <div className="relative group mb-6">
            <div className="w-40 h-40 rounded-full bg-slate-200 border-4 border-white shadow-xl overflow-hidden">
              {userData.profilePic ? <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={64} /></div>}
            </div>
            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors shadow-md"><Camera size={18} /></button>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{userData.fullName || userData.username}</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ${userRole === 'Alumni' ? 'bg-black text-white' : 'bg-teal-100 text-teal-800'}`}>{userRole}</span>
          {userData.currentJobRole && <span className="text-slate-500 text-sm font-bold flex items-center gap-1 mb-6"><Briefcase size={14} /> {userData.currentJobRole}</span>}
          <div className="w-full space-y-4 text-left px-4 mb-8 mt-4">
            <div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={18} className="text-teal-500" /><span className="truncate">{userData.email || 'No email'}</span></div>
            <div className="flex items-center gap-3 text-sm text-slate-600"><Phone size={18} className="text-teal-500" /><span>{userData.phone || 'No phone'}</span></div>
            <div className="flex items-center gap-3 text-sm text-slate-600"><MapPin size={18} className="text-teal-500" /><span>{userData.location || 'No location'}</span></div>
          </div>
          <div className="w-full text-left px-4"><h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Bio</h3><p className="text-sm text-slate-600 italic leading-relaxed">"{userData.bio || 'No bio yet.'}"</p></div>
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col h-[800px] overflow-hidden">
          
          {/* TABS HEADER */}
          <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto shrink-0 pb-4">
            {['Profile Settings', 'Account Security', 'Mentorship Requests', 'My Activity'].map((tab) => {
              const tabKey = tab.split(' ')[0].toLowerCase() === 'my' ? 'activity' : tab.split(' ')[0].toLowerCase();
              return (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tabKey)} 
                  className={`text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tabKey ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {activeTab === tabKey && <span className="absolute -bottom-4 left-0 w-full h-1 bg-black rounded-t-full"></span>}
                </button>
              )
            })}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 pb-10">
            {/* 1. PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Full Name</label><input name="fullName" value={userData.fullName} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Jane Doe" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Job Role</label><input name="currentJobRole" value={userData.currentJobRole} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Senior Engineer" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Email</label><input name="email" value={userData.email} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Phone</label><input name="phone" value={userData.phone} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="+1..." /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Department</label><input name="department" value={userData.department} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Location</label><input name="location" value={userData.location} onChange={handleChange} className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none" placeholder="City, Country" /></div>
                  <div className="col-span-1 md:col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500">Bio</label><textarea name="bio" value={userData.bio} onChange={handleChange} rows="3" className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none" placeholder="Tell us about yourself..." /></div>
                </div>
                <button onClick={handleSave} className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Save size={18} /> Save Changes</button>
              </div>
            )}

            {/* 2. SECURITY */}
            {activeTab === 'account' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Shield size={48} className="mb-4 text-slate-200" /><p>Security settings coming soon.</p>
              </div>
            )}

            {/* 3. REQUESTS */}
            {activeTab === 'mentorship' && (
              <div className="animate-fade-in-up">
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl">{req.sender.charAt(0).toUpperCase()}</div>
                          <div><h4 className="font-bold text-slate-900">{req.sender}</h4><p className="text-sm text-slate-500 max-w-sm">{req.message}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          {req.status === 'pending' ? (
                            <>
                              <button onClick={() => handleResponse(req._id, 'accepted')} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-2"><Check size={14} /> Accept</button>
                              <button onClick={() => handleResponse(req._id, 'rejected')} className="border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-2"><X size={14} /> Decline</button>
                            </>
                          ) : (
                            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="flex flex-col items-center justify-center h-full text-slate-400"><Bell size={48} className="mb-4 text-slate-200" /><p>No new requests found.</p></div>}
              </div>
            )}

            {/* 4. MY ACTIVITY (NEW) */}
            {activeTab === 'activity' && (
              <div className="animate-fade-in-up space-y-6">
                {myPosts.length > 0 ? myPosts.map((post) => (
                  <div key={post._id} className="bg-slate-50 rounded-[2rem] p-6 shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                      {userData.profilePic ? <img src={userData.profilePic} alt="Me" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"><User size={20} className="text-slate-500" /></div>}
                      <div><h4 className="font-bold text-slate-900 text-sm">{post.author}</h4><span className="text-xs text-slate-400 uppercase font-bold">{post.role}</span></div>
                    </div>
                    <p className="text-slate-800 text-sm mb-4 leading-relaxed">{post.content}</p>
                    
                    {/* MINIMIZED IMAGE */}
                    {post.image && (
                      <div className="-mx-6 mb-4 cursor-zoom-in group relative" onClick={() => setSelectedImage(post.image)}>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center"><span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-xs font-bold">Expand</span></div>
                        <img src={post.image} alt="Post" className="w-full h-96 object-cover object-top block" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 text-slate-500 text-xs font-bold border-t border-slate-200/50">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Heart size={14} className="text-red-500" /> {post.likes}</span>
                        <button onClick={() => toggleComments(post._id)} className={`flex items-center gap-1 transition-colors ${expandedPosts[post._id] ? 'text-blue-600' : 'hover:text-blue-500'}`}><MessageSquare size={14} /> {post.comments.length}</button>
                      </div>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.timestamp}</span>
                    </div>

                    {/* COMMENTS */}
                    {expandedPosts[post._id] && (
                      <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-100/50 -mx-6 -mb-6 px-6 py-4">
                         <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Comments</h5>
                         <div className="space-y-3">
                           {post.comments.length > 0 ? post.comments.map((c, i) => (
                             <div key={i} className="flex gap-2 text-xs">
                               <span className="font-bold text-slate-900">{c.author}:</span>
                               <span className="text-slate-600">{c.text}</span>
                             </div>
                           )) : <p className="text-xs text-slate-400 italic">No comments.</p>}
                         </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 border border-dashed border-slate-200 rounded-2xl"><MessageSquare size={32} className="mb-2 text-slate-200" /><p>You haven't posted anything yet.</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 rounded-full p-2"><X size={32} /></button>
          <img src={selectedImage} alt="Full Screen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}