import React, { useState, useEffect, useRef } from 'react';
import { User, MessageSquare, Heart, Share2, Plus, Calendar, Hash, Send, Check, Camera, Edit3, Image as ImageIcon, X, Save, Maximize2 } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState(['React', 'Leadership', 'Public Speaking']);
  const [skillInput, setSkillInput] = useState('');
  
  // STATES
  const [newPostContent, setNewPostContent] = useState('');
  const [postImage, setPostImage] = useState(null); 
  const [expandedImage, setExpandedImage] = useState(null);
  
  // COMMENT STATES
  const [activeCommentId, setActiveCommentId] = useState(null); // Which post is open for comments?
  const [commentText, setCommentText] = useState('');

  // USER INFO
  const [currentUser, setCurrentUser] = useState({
    name: localStorage.getItem('userName') || 'User',
    role: localStorage.getItem('userRole') || 'Student',
    pic: localStorage.getItem('userPic') || '',
    college: '', dept: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ collegeName: '', department: '' });

  const fileInputRef = useRef(null);
  const postImageInputRef = useRef(null);

  useEffect(() => { fetchUserData(); fetchPosts(); fetchConnections(); fetchEvents(); }, []);

  // --- FETCHING ---
  const fetchUserData = async () => {
    try {
      const res = await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/user/${currentUser.name}`);
      const data = await res.json();
      if (data) {
        setCurrentUser(prev => ({ ...prev, pic: data.profilePic || '', college: data.collegeName || 'Add College', dept: data.department || 'Add Department' }));
        setEditForm({ collegeName: data.collegeName || '', department: data.department || '' });
      }
    } catch (err) {}
  };
  const fetchPosts = async () => { const res = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/posts'); setPosts(await res.json()); };
  const fetchConnections = async () => { const res = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/users/suggested'); const data = await res.json(); setConnections(data.map(u => ({ ...u, status: 'Connect' }))); };
  const fetchEvents = async () => { const res = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/events'); const data = await res.json(); setEvents(data.slice(0, 3)); };

  // --- SOCIAL ACTIONS ---
  
  // 1. LIKE
  const handleLike = async (postId) => {
    const updated = posts.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/posts/${postId}/like`, { method: 'PUT' });
  };

  // 2. COMMENT
  const toggleCommentBox = (postId) => {
    setActiveCommentId(activeCommentId === postId ? null : postId);
    setCommentText('');
  };

  const submitComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: currentUser.name, text: commentText })
      });
      setCommentText('');
      fetchPosts(); // Refresh to show new comment
    } catch (err) { alert("Failed to comment"); }
  };

  // 3. SHARE
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  // --- POST CREATION ---
  const handlePost = async () => {
    if (!newPostContent.trim() && !postImage) return;
    await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser.name, role: currentUser.role, content: newPostContent, image: postImage })
    });
    setNewPostContent(''); setPostImage(null); fetchPosts();
  };
  const handlePostImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onloadend = () => setPostImage(reader.result);
  };

  // --- PROFILE ---
  const handleSaveProfile = async () => {
    const res = await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/user/${currentUser.name}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    if (res.ok) { setIsEditing(false); fetchUserData(); alert("Profile Updated!"); }
  };
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onloadend = async () => {
      await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/user/${currentUser.name}/photo`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profilePic: reader.result }) });
      setCurrentUser(prev => ({...prev, pic: reader.result})); localStorage.setItem('userPic', reader.result);
    };
  };

  const addSkill = () => { if (skillInput.trim()) { setSkills([...skills, skillInput.trim()]); setSkillInput(''); } };
  const handleConnect = (i) => { const newC = [...connections]; newC[i].status = newC[i].status === 'Connect' ? 'Pending' : 'Connect'; setConnections(newC); };
  const renderProfileImage = (pic, size = 12, iconSize = 24) => pic ? <img src={pic} alt="Profile" className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-sm`} /> : <div className={`w-${size} h-${size} bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm`}><User size={iconSize} className="text-slate-400" /></div>;

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans pt-24 pb-12 px-4 md:px-8">
      {expandedImage && ( <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setExpandedImage(null)}><button className="absolute top-6 right-6 text-white hover:text-red-500"><X size={40} /></button><img src={expandedImage} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} /></div> )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* PROFILE */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-teal-400 to-blue-500"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="relative group">{renderProfileImage(currentUser.pic, 24, 40)}<button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-black p-2 rounded-full text-white hover:bg-teal-500 shadow-md"><Camera size={16} /></button><input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" className="hidden" /></div>
                {isEditing ? <button onClick={handleSaveProfile} className="flex items-center gap-2 text-sm font-bold bg-black text-white px-4 py-2 rounded-xl hover:bg-green-600"><Save size={16} /> Save</button> : <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold border-2 border-slate-200 px-4 py-2 rounded-xl hover:border-teal-500"><Edit3 size={16} /> Edit Profile</button>}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                {isEditing ? <div className="mt-3 space-y-3 bg-slate-50 p-4 rounded-xl"><input className="w-full p-2 rounded-lg border text-sm" value={editForm.collegeName} onChange={(e) => setEditForm({...editForm, collegeName: e.target.value})} placeholder="College Name" /><input className="w-full p-2 rounded-lg border text-sm" value={editForm.department} onChange={(e) => setEditForm({...editForm, department: e.target.value})} placeholder="Department" /></div> : <><p className="text-teal-600 font-bold uppercase text-sm mb-2">{currentUser.role} AT {currentUser.college}</p><p className="text-slate-600 text-sm max-w-md">{currentUser.dept} Department.</p></>}
              </div>
            </div>
          </div>
          
          {/* CREATE POST */}
          <div className="bg-white p-6 rounded-3xl shadow-xl flex gap-4">
            {renderProfileImage(currentUser.pic, 12, 24)}
            <div className="flex-grow">
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-teal-500 resize-none text-sm" rows="2" placeholder={`What's on your mind, ${currentUser.name}?`} value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
              {postImage && <div className="relative mt-2 w-fit"><img src={postImage} alt="Preview" className="h-32 rounded-lg border shadow-sm" /><button onClick={() => setPostImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button></div>}
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2"><button onClick={() => postImageInputRef.current.click()} className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-full"><ImageIcon size={20} /></button><input type="file" ref={postImageInputRef} onChange={handlePostImageChange} accept="image/*" className="hidden" /></div>
                <button onClick={handlePost} className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-600 flex items-center gap-2"><Send size={16} /> POST</button>
              </div>
            </div>
          </div>

          {/* FEED */}
          {posts.length > 0 ? posts.map((post, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-lg animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">{renderProfileImage(post.authorPic, 12, 24)}<div><h4 className="font-bold text-slate-900">{post.author}</h4><p className="text-xs text-teal-600 font-bold uppercase">{post.role}</p></div></div>
                <span className="text-xs text-slate-400">{post.timestamp}</span>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>
              {post.image && <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 group relative"><img src={post.image} alt="Post content" className="w-full object-cover max-h-[400px] cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setExpandedImage(post.image)} /><div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"><Maximize2 size={20} /></div></div>}
              
              <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-sm font-bold transition-colors"><Heart size={18} className={post.likes > 0 ? "fill-red-50 text-red-500" : ""} /> {post.likes} Likes</button>
                <button onClick={() => toggleCommentBox(post._id)} className="flex items-center gap-2 text-slate-500 hover:text-teal-500 text-sm font-bold"><MessageSquare size={18} /> {post.comments?.length || 0} Comments</button>
                <button onClick={handleShare} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 text-sm font-bold ml-auto"><Share2 size={18} /> Share</button>
              </div>

              {/* COMMENTS SECTION */}
              {activeCommentId === post._id && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl animate-fade-in-down">
                  {post.comments?.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                      {post.comments.map((c, i) => (
                        <div key={i} className="text-sm"><span className="font-bold text-slate-900">{c.author}: </span><span className="text-slate-600">{c.text}</span></div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input className="flex-grow p-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment(post._id)} />
                    <button onClick={() => submitComment(post._id)} className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600"><Send size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )) : <div className="text-center text-white/50 py-10"><p>No posts yet.</p></div>}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl"><h3 className="font-bold text-lg mb-4">Suggested Connections</h3><div className="space-y-4">{connections.map((user, i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3">{renderProfileImage(user.profilePic, 10, 20)}<div><p className="text-sm font-bold text-slate-900 w-24 truncate">{user.username}</p><p className="text-[10px] text-teal-600 uppercase font-bold">{user.userType}</p></div></div><button onClick={() => handleConnect(i)} className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ${user.status === 'Pending' ? 'bg-green-100 text-green-700' : 'bg-black text-white'}`}>{user.status === 'Pending' && <Check size={12} />}{user.status}</button></div>))}</div></div>
          <div className="bg-white p-6 rounded-3xl shadow-xl"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Hash size={20} className="text-teal-500" /> Your Skills</h3><div className="flex flex-wrap gap-2 mb-4">{skills.map((s, i) => <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold"># {s}</span>)}</div><div className="relative"><input type="text" placeholder="Add skill..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} /><button onClick={addSkill} className="absolute right-2 top-1.5 p-1 bg-slate-200 rounded-full hover:bg-teal-500 hover:text-white"><Plus size={16} /></button></div></div>
          <div className="bg-white p-6 rounded-3xl shadow-xl"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar size={20} className="text-teal-500" /> Upcoming</h3><div className="space-y-4">{events.map((evt, i) => (<div key={i} className="flex gap-4 items-center border-b border-slate-50 pb-3 last:border-0"><div className="bg-slate-100 p-2 rounded-lg text-center min-w-[50px]"><span className="block text-xs font-bold text-slate-400">DATE</span><span className="block text-sm font-black text-slate-900">{evt.date?.slice(5)}</span></div><div><p className="text-sm font-bold text-slate-900 leading-tight">{evt.title}</p><p className="text-xs text-slate-500 w-40 truncate">{evt.location}</p></div></div>))}</div></div>
        </div>
      </div>
    </div>
  );
}