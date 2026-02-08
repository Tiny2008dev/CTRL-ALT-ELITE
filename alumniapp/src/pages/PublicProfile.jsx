import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Briefcase, GraduationCap, ArrowLeft, Loader, Heart, MessageSquare, Clock, X } from 'lucide-react';

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // --- STATE FOR LIGHTBOX & COMMENTS ---
  const [selectedImage, setSelectedImage] = useState(null); 
  const [expandedPosts, setExpandedPosts] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/user/${username}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          const postsRes = await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/posts/user/${username}`);
          const postsData = await postsRes.json();
          setPosts(postsData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const toggleComments = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) return <div className="min-h-screen bg-[#031130] flex items-center justify-center text-white"><Loader className="animate-spin" size={48} /></div>;
  
  if (!user) return (
    <div className="min-h-screen bg-[#031130] flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-bold mb-4">User Not Found</h2>
      <button onClick={() => navigate(-1)} className="text-teal-400 hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#031130] font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center relative">
      
      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)} className="self-start md:ml-10 mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      {/* --- PROFILE CARD --- */}
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row min-h-[400px] mb-12">
        <div className="w-full md:w-2/5 bg-slate-50 p-10 flex flex-col items-center text-center border-r border-slate-100">
          <div className="w-40 h-40 rounded-full bg-slate-200 border-4 border-white shadow-xl overflow-hidden mb-6">
            {user.profilePic ? <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={64} /></div>}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{user.fullName || user.username}</h1>
          <p className="text-slate-500 font-bold mb-4">@{user.username}</p>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${user.userType?.toLowerCase() === 'alumni' ? 'bg-black text-white' : 'bg-teal-100 text-teal-800'}`}>{user.userType || 'Student'}</span>
          <div className="w-full space-y-3 text-left pl-4 text-sm">
             {user.currentJobRole && <div className="flex items-center gap-3 text-slate-700 font-medium"><Briefcase size={16} className="text-teal-500 shrink-0" /><span>{user.currentJobRole}</span></div>}
             {user.department && <div className="flex items-center gap-3 text-slate-700 font-medium"><GraduationCap size={16} className="text-teal-500 shrink-0" /><span>{user.department}</span></div>}
             {user.location && <div className="flex items-center gap-3 text-slate-700 font-medium"><MapPin size={16} className="text-teal-500 shrink-0" /><span>{user.location}</span></div>}
             {user.email && <div className="flex items-center gap-3 text-slate-700 font-medium"><Mail size={16} className="text-teal-500 shrink-0" /><span>{user.email}</span></div>}
          </div>
        </div>
        <div className="w-full md:w-3/5 p-10 flex flex-col">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">About</h2>
          <p className={user.bio ? "text-slate-600 text-lg leading-relaxed italic" : "text-slate-400 italic"}>"{user.bio || "No bio added yet."}"</p>
        </div>
      </div>

      {/* --- POSTS SECTION --- */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          Activity & Posts <span className="bg-white/10 text-teal-400 px-3 py-1 rounded-full text-sm">{posts.length}</span>
        </h3>

        {posts.length > 0 ? (
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-[2rem] p-8 shadow-xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {user.profilePic ? <img src={user.profilePic} alt="Author" className="w-12 h-12 rounded-full object-cover border border-slate-100" /> : <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><User size={24} className="text-slate-400" /></div>}
                  <div><h4 className="font-bold text-slate-900 text-base">{post.author}</h4><span className="text-xs text-slate-400 uppercase font-bold">{post.role}</span></div>
                </div>

                <p className="text-slate-800 text-lg mb-6 leading-relaxed">{post.content}</p>
                
                {/* --- MINIMIZED IMAGE (Click to Expand) --- */}
                {post.image && (
                  <div 
                    className="-mx-8 mb-6 cursor-zoom-in group relative overflow-hidden" 
                    onClick={() => setSelectedImage(post.image)}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      {/* Optional Zoom Icon on Hover */}
                      <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-xs font-bold transition-opacity">Click to Expand</span>
                    </div>
                    {/* Fixed Height (h-96) + Object Cover = Minimized Banner Look */}
                    <img src={post.image} alt="Post" className="w-full h-96 object-cover object-top block" />
                  </div>
                )}

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-2 text-slate-500 text-sm font-bold">
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2"><Heart size={18} className="text-red-500" /> {post.likes} Likes</span>
                    <button 
                      onClick={() => toggleComments(post._id)}
                      className={`flex items-center gap-2 transition-colors ${expandedPosts[post._id] ? 'text-blue-600' : 'hover:text-blue-500'}`}
                    >
                      <MessageSquare size={18} /> {post.comments.length} Comments
                    </button>
                  </div>
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-400"><Clock size={14} /> {post.timestamp}</span>
                </div>

                {/* COMMENTS SECTION */}
                {expandedPosts[post._id] && (
                  <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 py-6">
                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-4">Comments</h5>
                    {post.comments.length > 0 ? (
                      <div className="space-y-4">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {comment.author[0]}
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                              <div className="flex justify-between items-baseline gap-4 mb-1">
                                <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                                <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm text-slate-700">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No comments yet.</p>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center flex flex-col items-center justify-center">
            <MessageSquare size={48} className="text-white/20 mb-4" />
            <p className="text-gray-400 font-medium">No posts yet.</p>
          </div>
        )}
      </div>

      {/* --- LIGHTBOX MODAL (Fullscreen) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <X size={32} />
          </button>
          
          {/* Full Image */}
          <img 
            src={selectedImage} 
            alt="Full Screen" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}