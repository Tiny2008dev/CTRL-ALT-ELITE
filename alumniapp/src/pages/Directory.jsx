import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, GraduationCap, Mail, User, MessageCircle, Video, Calendar, Send, X, Clock } from 'lucide-react';

export default function Directory() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'chats'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchParams] = useSearchParams();
  
  // Chat State
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Booking State
  const [bookingUser, setBookingUser] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  const currentUser = localStorage.getItem('userName') || 'User'; // Get logged in user

  // FETCH USERS ON LOAD
  useEffect(() => {
    fetchUsers();
  }, []);

  // AUTO-SCROLL CHAT TO BOTTOM
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // POLL FOR MESSAGES (Simple Real-time simulation)
  useEffect(() => {
    let interval;
    if (activeChatUser) {
      fetchMessages(activeChatUser.username);
      interval = setInterval(() => fetchMessages(activeChatUser.username), 3000); // Check every 3s
    }
    return () => clearInterval(interval);
  }, [activeChatUser]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/all');
      const data = await res.json();
      // Filter out self
      const others = data.filter(u => u.username !== currentUser);
      setUsers(others);
      setFilteredUsers(others);
    } catch (err) { console.error(err); }
  };

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
      fetchMessages(activeChatUser.username); // Refresh immediately
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
          message: bookingNote || "I'd like to book a session.",
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

  return (
    <div className="min-h-screen bg-[#031130] text-white font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
      {/* --- TABS --- */}
      <div className="flex gap-6 mb-8 bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10">
        <button onClick={() => setActiveTab('explore')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'explore' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Explore Directory</button>
        <button onClick={() => setActiveTab('chats')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'chats' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><MessageCircle size={16} /> My Chats</button>
      </div>

      {/* ==================== 1. EXPLORE TAB ==================== */}
      {activeTab === 'explore' && (
        <div className="w-full max-w-6xl animate-fade-in-up">
           {/* Search Bar */}
           <div className="relative mb-8 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input onChange={handleSearch} placeholder="Search alumni, students, roles..." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-teal-500 transition-colors backdrop-blur-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-3xl p-6 shadow-xl relative group overflow-hidden border border-transparent hover:border-teal-500 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {user.profilePic ? <img src={user.profilePic} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100" /> : <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={24} /></div>}
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

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => startChat(user)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"><MessageCircle size={16} /> Chat</button>
                  <button onClick={() => setBookingUser(user)} className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"><Video size={16} /> Book Meet</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 2. CHATS TAB ==================== */}
      {activeTab === 'chats' && (
        <div className="w-full max-w-5xl h-[700px] bg-white rounded-[2rem] overflow-hidden flex shadow-2xl animate-fade-in-up">
          
          {/* SIDEBAR (User List) */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Messages</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {users.map((user) => (
                <div key={user._id} onClick={() => setActiveChatUser(user)} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 ${activeChatUser?.username === user.username ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                    {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{user.fullName || user.username}</h4>
                    <p className="text-slate-500 text-xs truncate">Click to chat</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="w-2/3 bg-white flex flex-col relative">
            {activeChatUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                       {activeChatUser.profilePic ? <img src={activeChatUser.profilePic} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{activeChatUser.fullName || activeChatUser.username}</h3>
                      <span className="text-xs text-green-500 flex items-center gap-1 font-bold">● Online</span>
                    </div>
                  </div>
                  <button onClick={() => setBookingUser(activeChatUser)} className="bg-teal-50 text-teal-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-2"><Video size={14} /> Schedule Meet</button>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                  {messages.length > 0 ? messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUser;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm font-medium ${isMe ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'}`}>
                          {msg.text}
                          <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <MessageCircle size={48} className="mb-2 opacity-20" />
                      <p>Start the conversation!</p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
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
                <p className="text-lg font-bold text-slate-400">Select a user to start chatting</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 3. BOOKING MODAL ==================== */}
      {bookingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
            <button onClick={() => setBookingUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600"><Calendar size={32} /></div>
              <h2 className="text-2xl font-bold text-slate-900">Book a Session</h2>
              <p className="text-slate-500">Request a Google Meet with <span className="text-teal-600 font-bold">{bookingUser.fullName || bookingUser.username}</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Select Date & Time</label>
                <input type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 outline-none mt-1" onChange={(e) => setBookingSlot(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message (Optional)</label>
                <textarea rows="3" placeholder="What do you want to discuss?" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 outline-none mt-1 resize-none" onChange={(e) => setBookingNote(e.target.value)}></textarea>
              </div>
              
              <button onClick={handleBookSlot} className="w-full bg-black text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Send Request <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}