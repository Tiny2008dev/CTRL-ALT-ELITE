import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, User, MessageCircle, Video, Calendar, Send, X, UserPlus, Check, Clock } from 'lucide-react';

export default function Accounts() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'chats'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [myProfile, setMyProfile] = useState(null); // To store my connections/requests
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  
  // Chat State
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Booking State
  const [bookingUser, setBookingUser] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('');

  const currentUser = localStorage.getItem('userName') || 'User'; 

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchMyProfile(); // Fetch my own data to know connections
    fetchUsers();     // Fetch all users
  }, []);

  // --- AUTO-SCROLL CHAT ---
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- POLL MESSAGES ---
  useEffect(() => {
    let interval;
    if (activeChatUser) {
      fetchMessages(activeChatUser.username);
      interval = setInterval(() => fetchMessages(activeChatUser.username), 3000);
    }
    return () => clearInterval(interval);
  }, [activeChatUser]);

  const fetchMyProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${currentUser}`);
      const data = await res.json();
      setMyProfile(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/all');
      const data = await res.json();
      const others = data.filter(u => u.username !== currentUser);
      setUsers(others);
      setFilteredUsers(others);
    } catch (err) { console.error(err); }
  };

  // --- CONNECTION LOGIC ---
  const handleConnect = async (targetUser) => {
    try {
      await fetch('http://localhost:5000/api/connect/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: currentUser, recipient: targetUser })
      });
      // Update local state to show "Pending" immediately
      setMyProfile(prev => ({
        ...prev,
        sentRequests: [...(prev.sentRequests || []), targetUser]
      }));
    } catch (err) { alert("Failed to send request"); }
  };

  const getButtonStatus = (user) => {
    if (!myProfile) return 'loading';
    if (myProfile.connections?.includes(user.username)) return 'connected';
    if (myProfile.sentRequests?.includes(user.username)) return 'pending';
    if (myProfile.receivedRequests?.includes(user.username)) return 'received'; // They sent me a request
    return 'connect';
  };

  // --- CHAT & BOOKING ---
  const fetchMessages = async (otherUser) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${currentUser}/${otherUser}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatUser) return;
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUser,
          recipient: activeChatUser.username,
          text: newMessage
        })
      });
      setNewMessage('');
      fetchMessages(activeChatUser.username); 
    } catch (err) { console.error(err); }
  };

  const handleBookSlot = async () => {
    if (!bookingSlot) return alert("Please pick a time!");
    try {
      await fetch('http://localhost:5000/api/meet/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorName: bookingUser.username,
          studentName: currentUser,
          message: "I'd like to book a session.",
          slot: bookingSlot
        })
      });
      alert(`Request sent to ${bookingUser.username}!`);
      setBookingUser(null);
    } catch (err) { alert("Booking failed"); }
  };

  const startChat = (user) => {
    setActiveChatUser(user);
    setActiveTab('chats');
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFilteredUsers(users.filter(u => 
      (u.fullName || u.username).toLowerCase().includes(term) ||
      (u.currentJobRole || '').toLowerCase().includes(term)
    ));
  };

  // FILTER CHAT USERS (Only Show Connections)
  const connectedUsers = users.filter(u => myProfile?.connections?.includes(u.username));

  return (
    <div className="min-h-screen bg-[#031130] text-white font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
      {/* --- TAB SWITCHER --- */}
      <div className="flex gap-6 mb-8 bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10 sticky top-24 z-20">
        <button onClick={() => setActiveTab('explore')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'explore' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Explore & Connect</button>
        <button onClick={() => setActiveTab('chats')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'chats' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          <MessageCircle size={16} /> My Chats
        </button>
      </div>

      {/* ==================== 1. EXPLORE TAB ==================== */}
      {activeTab === 'explore' && (
        <div className="w-full max-w-6xl animate-fade-in-up">
           <div className="relative mb-8 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input onChange={handleSearch} placeholder="Search alumni, students, roles..." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-teal-500 transition-colors backdrop-blur-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const status = getButtonStatus(user);
              
              return (
                <div 
                  key={user._id} 
                  onClick={(e) => {
                      if (e.target.closest('button')) return; 
                      navigate(`/user/${user.username}`);
                  }}
                  className="bg-white rounded-3xl p-6 shadow-xl relative group overflow-hidden border border-transparent hover:border-teal-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {user.profilePic ? <img src={user.profilePic} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100" alt="p"/> : <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={24} /></div>}
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg leading-tight">{user.fullName || user.username}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${user.userType === 'Alumni' ? 'bg-black text-white' : 'bg-teal-100 text-teal-800'}`}>{user.userType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-6 pl-1">
                    {user.currentJobRole && <p className="text-slate-600 text-sm flex items-center gap-2 font-bold"><Briefcase size={14} className="text-teal-500" /> {user.currentJobRole}</p>}
                    {user.location && <p className="text-slate-500 text-xs flex items-center gap-2"><MapPin size={14} /> {user.location}</p>}
                  </div>

                  {/* DYNAMIC BUTTONS BASED ON CONNECTION STATUS */}
                  <div className="flex gap-2 mt-auto">
                    {status === 'connected' ? (
                      <button onClick={() => startChat(user)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                        <MessageCircle size={16} /> Chat
                      </button>
                    ) : status === 'pending' ? (
                      <button disabled className="flex-1 bg-slate-200 text-slate-500 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                        <Clock size={16} /> Pending
                      </button>
                    ) : status === 'received' ? (
                       <button onClick={() => navigate('/mentorship')} className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600">
                        <Check size={16} /> Accept in Inbox
                      </button>
                    ) : (
                      <button onClick={() => handleConnect(user.username)} className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30">
                        <UserPlus size={16} /> Connect
                      </button>
                    )}
                    
                    <button onClick={() => setBookingUser(user)} className="bg-slate-100 text-slate-700 px-3 rounded-xl hover:bg-slate-200 transition-colors"><Video size={20} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 2. CHATS TAB (ONLY CONNECTED USERS) ==================== */}
      {activeTab === 'chats' && (
        <div className="w-full max-w-5xl h-[700px] bg-white rounded-[2rem] overflow-hidden flex shadow-2xl animate-fade-in-up border border-slate-200">
          
          {/* SIDEBAR */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">My Connections</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {connectedUsers.length > 0 ? connectedUsers.map((user) => (
                <div key={user._id} onClick={() => setActiveChatUser(user)} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 ${activeChatUser?.username === user.username ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                    {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="u"/> : user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{user.fullName || user.username}</h4>
                    <p className="text-xs text-green-600 font-bold">Connected</p>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-400 text-sm">
                   <UserPlus size={32} className="mx-auto mb-2 opacity-30" />
                   <p>No connections yet.</p>
                   <button onClick={() => setActiveTab('explore')} className="text-teal-500 font-bold mt-2 hover:underline">Go Connect!</button>
                </div>
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="w-2/3 bg-white flex flex-col relative">
            {activeChatUser ? (
              <>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                       {activeChatUser.profilePic ? <img src={activeChatUser.profilePic} className="w-full h-full object-cover" alt="u"/> : <User size={20} className="text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{activeChatUser.fullName || activeChatUser.username}</h3>
                      <span className="text-xs text-green-500 flex items-center gap-1 font-bold">● Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUser;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm font-medium ${isMe ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'}`}>
                          {msg.text}
                          <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none" 
                  />
                  <button onClick={handleSendMessage} className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30"><Send size={20} /></button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <MessageCircle size={64} className="mb-4 text-slate-200" />
                <p className="text-lg font-bold text-slate-400">Select a connection to chat</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
            <button onClick={() => setBookingUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Book Session</h2>
            </div>
            <input type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4" onChange={(e) => setBookingSlot(e.target.value)} />
            <button onClick={handleBookSlot} className="w-full bg-black text-white py-3 rounded-xl font-bold">Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}