import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Heart, MessageSquare, User, Loader, Crown } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopPosts();
  }, []);

  const fetchTopPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/leaderboard');
      const data = await res.json();
      setPosts(data);
    } catch (err) { console.error("Error fetching leaderboard"); }
    finally { setLoading(false); }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown size={32} className="text-yellow-500 fill-yellow-500" />;
      case 1: return <Trophy size={28} className="text-slate-400" />;
      case 2: return <Trophy size={24} className="text-orange-400" />;
      default: return <span className="text-slate-400 font-bold text-xl">#{index + 1}</span>;
    }
  };

  if (loading) return <div className="min-h-screen bg-[#031130] flex items-center justify-center text-white"><Loader className="animate-spin" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#031130] font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-10 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={24} /> Back
        </button>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
             <Trophy className="text-yellow-400" size={40} /> Top Content
          </h1>
          <p className="text-slate-400">Celebrating our community's most engaging posts</p>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* LEADERBOARD LIST */}
      <div className="w-full max-w-4xl space-y-6">
        {posts.length > 0 ? posts.map((post, index) => (
          <div 
            key={post._id} 
            // STANDARD STYLE: Same as Dashboard/Feed (White, Rounded-2xl, Shadow-xl)
            className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-center hover:scale-[1.01] transition-transform duration-300"
          >
            
            {/* RANK BADGE (Left) */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 md:w-16">
              {getRankIcon(index)}
            </div>

            {/* POST CONTENT (Middle) */}
            <div className="flex-grow w-full min-w-0 border-l border-slate-100 pl-6">
              {/* Author */}
              <div 
                className="flex items-center gap-3 mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => navigate(`/user/${post.author}`)}
              >
                {post.authorPic ? (
                  <img src={post.authorPic} alt="Author" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><User size={20} className="text-slate-400" /></div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{post.author}</h4>
                  <span className="text-xs text-slate-500 uppercase font-bold">{post.role}</span>
                </div>
              </div>

              {/* Text Snippet */}
              <p className="text-slate-700 text-base font-medium line-clamp-2 mb-2">"{post.content}"</p>
              
              {/* Image Snippet (Optional) */}
              {post.image && (
                <div className="h-16 w-16 rounded-lg overflow-hidden mt-1 bg-slate-100 border border-slate-200">
                   <img src={post.image} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>

            {/* STATS (Right) */}
            <div className="flex-shrink-0 flex md:flex-col items-center gap-4 md:gap-2 min-w-[100px] justify-center">
              <div className="flex flex-col items-center">
                 <span className="text-3xl font-black text-slate-900">{(post.likes || 0) + (post.comments?.length || 0)}</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
              </div>
              
              <div className="flex gap-4 text-xs font-bold text-slate-500 mt-2">
                <span className="flex items-center gap-1"><Heart size={14} className="text-slate-400" /> {post.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} className="text-slate-400" /> {post.comments?.length || 0}</span>
              </div>
            </div>

          </div>
        )) : (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-gray-400">No posts available for ranking yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}