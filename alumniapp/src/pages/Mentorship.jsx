import React, { useState, useEffect } from 'react';
import { Search, Briefcase, User, Plus, X, Clock, Loader } from 'lucide-react';

export default function Mentorship() {
  const [opportunities, setOpportunities] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // NEW STATE: Notification Count
  const [pendingCount, setPendingCount] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM STATE
  const [newOpp, setNewOpp] = useState({
    title: '', type: 'Mentorship', description: '', tags: '',
    location: 'Remote', duration: '', stipend: ''
  });

  // GET CURRENT USER
  const rawRole = localStorage.getItem('userRole') || 'Student';
  const currentUser = {
    name: localStorage.getItem('userName') || 'User',
    role: rawRole,
    isAlumni: rawRole.toLowerCase() === 'alumni', // Case-insensitive check
    pic: localStorage.getItem('userPic') || '',
    jobRole: localStorage.getItem('userJobRole') || 'Alumni'
  };

  useEffect(() => {
    fetchOpportunities();
    fetchNotifications(); // <--- Fetch count on load
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/opportunities');
      setOpportunities(await res.json());
    } catch (err) { console.error("Failed to fetch opportunities"); }
  };

  // --- NEW FUNCTION: FETCH NOTIFICATIONS ---
  const fetchNotifications = async () => {
    if (!currentUser.name) return;
    try {
      // Ask backend: "How many requests for ME?"
      const res = await fetch(`https://ctrl-alt-elite-bcknd.onrender.com/api/notifications/${currentUser.name}`);
      const data = await res.json();
      setPendingCount(data.count || 0);
    } catch (err) { console.error("Failed to fetch notifications"); }
  };

  const handleRequest = async (mentorName, title) => {
    if (currentUser.isAlumni) return alert("Alumni cannot request mentorship.");
    if (!mentorName) return alert("Error: Mentor name missing on this post.");

    setIsSubmitting(true);
    try {
      const res = await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorName: mentorName, // Must match the Alumni's username exactly
          studentName: currentUser.name,
          message: `Requested mentorship for: ${title}`
        })
      });
      
      if (res.ok) {
        alert(`Request successfully sent to ${mentorName}!`);
      } else {
        alert("Failed to send request. Server error.");
      }
    } catch (err) { alert("Network error. Is server running?"); }
    setIsSubmitting(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tagsArray = newOpp.tags.split(',').map(t => t.trim());
      await fetch('https://ctrl-alt-elite-bcknd.onrender.com/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOpp,
          tags: [newOpp.type, ...tagsArray],
          posterName: currentUser.name,
          posterRole: currentUser.jobRole,
          posterPic: currentUser.pic
        })
      });
      setShowModal(false);
      fetchOpportunities();
      alert("Opportunity Posted!");
    } catch (err) { alert("Failed to post."); }
    setIsSubmitting(false);
  };

  const filteredOpps = opportunities.filter(opp => 
    (filterType === 'All' || opp.type === filterType) &&
    (opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || opp.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">My Mentorships</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Active:</span> <span className="font-bold text-teal-600">None</span>
              </div>
              
              {/* DYNAMIC COUNT DISPLAY */}
              <div className="flex justify-between items-center text-slate-600">
                <span>Pending Requests:</span> 
                <span className={`font-bold ${pendingCount > 0 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                  {pendingCount}
                </span>
              </div>
              
            </div>
          </div>

          {currentUser.isAlumni && (
            <div className="bg-white rounded-3xl p-6 shadow-xl text-center animate-fade-in-up">
              <h2 className="font-bold text-lg mb-2">Post an Opportunity</h2>
              <p className="text-xs text-slate-500 mb-4">Share jobs, internships, or offer mentorship.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Create Post
              </button>
            </div>
          )}
        </div>

        {/* --- CENTER FEED --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold mb-4">Mentorship & Internship Opportunities</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" placeholder="Search..." className="w-full bg-slate-100 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="bg-slate-100 px-4 py-2.5 rounded-xl text-sm font-bold outline-none cursor-pointer" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
              </select>
            </div>
          </div>

          {filteredOpps.length > 0 ? filteredOpps.map((opp, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in-up hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {opp.posterPic ? <img src={opp.posterPic} alt="Poster" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"><User size={20} className="text-slate-500" /></div>}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{opp.posterName}</h3>
                  <p className="text-xs text-slate-500 uppercase font-bold">{opp.posterRole || 'Alumni'}</p>
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">{opp.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{opp.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {opp.tags.map((tag, idx) => (<span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{tag}</span>))}
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <div className="flex gap-4 text-xs font-bold text-slate-400">
                   <span className="flex items-center gap-1"><Briefcase size={14} /> {opp.type}</span>
                   <span className="flex items-center gap-1"><Clock size={14} /> {opp.duration}</span>
                </div>
                
                {!currentUser.isAlumni ? (
                  <button 
                    onClick={() => handleRequest(opp.posterName, opp.title)}
                    disabled={isSubmitting}
                    className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader className="animate-spin" size={14} /> : null}
                    {opp.type === 'Mentorship' ? 'Request Mentorship' : 'Apply Now'}
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-400 px-5 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                    Alumni View
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/10"><p className="text-gray-400">No opportunities found.</p></div>
          )}
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">Top Mentors</h2>
            <div className="space-y-4">
              {['Jane Doe', 'Dr. Alan Grant', 'Emily Chen'].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">{name[0]}</div>
                    <div><p className="text-xs font-bold text-slate-900">{name}</p><p className="text-[10px] text-slate-500">Alumni</p></div>
                  </div>
                  <button className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-slate-800">View Profile</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">Mentorship Resources</h2>
            <ul className="space-y-2 text-sm font-medium text-slate-600">
              <li className="hover:text-teal-600 cursor-pointer">• Mentee Guide</li>
              <li className="hover:text-teal-600 cursor-pointer">• Resume Tips</li>
              <li className="hover:text-teal-600 cursor-pointer">• Interview Prep</li>
            </ul>
          </div>
        </div>

      </div>

      {/* --- POST OPPORTUNITY MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Post Opportunity</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input placeholder="Title" className="w-full bg-slate-100 p-3 rounded-xl outline-none" required onChange={(e) => setNewOpp({...newOpp, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full bg-slate-100 p-3 rounded-xl outline-none" onChange={(e) => setNewOpp({...newOpp, type: e.target.value})}><option value="Mentorship">Mentorship</option><option value="Internship">Internship</option><option value="Job">Job</option></select>
                <input placeholder="Location" className="w-full bg-slate-100 p-3 rounded-xl outline-none" onChange={(e) => setNewOpp({...newOpp, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Duration" className="w-full bg-slate-100 p-3 rounded-xl outline-none" onChange={(e) => setNewOpp({...newOpp, duration: e.target.value})} />
                <input placeholder="Stipend" className="w-full bg-slate-100 p-3 rounded-xl outline-none" onChange={(e) => setNewOpp({...newOpp, stipend: e.target.value})} />
              </div>
              <textarea placeholder="Description..." rows="4" className="w-full bg-slate-100 p-3 rounded-xl outline-none resize-none" required onChange={(e) => setNewOpp({...newOpp, description: e.target.value})} />
              <input placeholder="Tags..." className="w-full bg-slate-100 p-3 rounded-xl outline-none" onChange={(e) => setNewOpp({...newOpp, tags: e.target.value})} />
              <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex justify-center">{isSubmitting ? <Loader className="animate-spin" /> : "Publish Post"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}