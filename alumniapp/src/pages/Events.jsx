import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Search, Filter, DollarSign, ArrowRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('student');
  
  // Ref for the slider container
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role.toLowerCase());
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- MOUSE WHEEL SCROLL HANDLER ---
  const handleWheel = (e) => {
    if (sliderRef.current) {
      // If scrolling vertically, translate it to horizontal scroll
      if (e.deltaY !== 0) {
        sliderRef.current.scrollLeft += e.deltaY;
        e.preventDefault(); // Prevent page scroll while over the slider
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#031130] text-white font-sans pt-24 pb-12 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-[95%] max-w-[1800px] mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">UPCOMING EVENTS</h1>
            <p className="text-gray-400 text-lg">Discover networking opportunities, workshops, and reunions.</p>
          </div>
          
          {/* SEARCH BAR */}
          <div className="flex gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full bg-transparent text-white pl-10 pr-4 py-2.5 outline-none placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 px-6 py-2.5 rounded-lg text-black font-bold text-sm flex items-center gap-2 transition-colors">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* --- INVISIBLE SCROLL SLIDER --- */}
        <div className="relative w-full group">
          
          {/* FADE GRADIENTS (Left/Right) to hint at more content */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#031130] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#031130] to-transparent z-10 pointer-events-none"></div>

          <div 
            ref={sliderRef}
            onWheel={handleWheel}
            className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 snap-x scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide in Firefox/IE
          >
            {/* HIDE SCROLLBAR IN WEBKIT BROWSERS via inline style tag below */}
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))
            ) : (
              <div className="w-full text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p>No events found.</p>
              </div>
            )}
             
             {/* "View All" Link Card */}
            <div className="min-w-[300px] flex items-center justify-center snap-center">
               <button className="group flex flex-col items-center gap-4 text-teal-400 hover:text-white transition-colors">
                 <div className="w-20 h-20 rounded-full border-2 border-teal-400 flex items-center justify-center group-hover:bg-teal-400 group-hover:text-black transition-all">
                   <ArrowRight size={32} />
                 </div>
                 <span className="font-bold tracking-widest text-sm">VIEW ALL</span>
               </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- CREATE EVENT SECTION (Only for Alumni) --- */}
      {userRole === 'alumni' && (
        <div className="w-[95%] max-w-[1200px] mt-4 animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-900 to-[#0a1e50] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-0"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-teal-500 p-3 rounded-xl text-black">
                  <PlusCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Post an Event</h2>
                  <p className="text-gray-400">Share a new opportunity with the community.</p>
                </div>
              </div>

              <CreateEventForm onEventCreated={fetchEvents} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS (Unchanged Logic, just ensuring styles match) ---

function EventCard({ event }) {
  return (
    <div className="min-w-[340px] md:min-w-[400px] bg-white rounded-[2.5rem] p-8 text-slate-900 snap-center transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl flex flex-col h-full cursor-grab active:cursor-grabbing select-none">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col items-center bg-slate-100 p-3 rounded-2xl">
           <Calendar size={32} strokeWidth={1.5} className="mb-1 text-slate-800" />
           <span className="text-xs font-bold text-slate-500">DATE</span>
        </div>
        <div className="text-right">
          <p className="font-black text-xl leading-none tracking-tight">{event.date}</p>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{event.category || 'EVENT'}</span>
        </div>
      </div>

      <h3 className="text-3xl font-black uppercase leading-none mb-6 min-h-[60px] flex items-end">
        {event.title}
      </h3>

      <div className="bg-gradient-to-br from-[#8A2BE2] to-[#00FFFF] rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group cursor-pointer flex-grow flex flex-col justify-between">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        <p className="font-medium text-sm leading-relaxed mb-6 opacity-95">
          {event.description}
        </p>
        <div className="flex justify-between items-end border-t border-white/20 pt-4 mt-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide truncate max-w-[60%]">
             <MapPin size={14} />
             <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
             <DollarSign size={12} />
             <span>{event.fee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateEventForm({ onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', fee: '', description: '', category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Event Posted Successfully!");
        setFormData({ title: '', date: '', location: '', fee: '', description: '', category: '' });
        onEventCreated();
      }
    } catch (err) {
      alert("Failed to post event.");
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <input name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors" required />
        <div className="grid grid-cols-2 gap-4">
           <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors" required />
           <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors" required />
        </div>
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors" required />
        <input name="fee" placeholder="Fee" value={formData.fee} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors" required />
      </div>
      <div className="flex flex-col h-full space-y-4">
        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="w-full flex-grow bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-teal-500 transition-colors min-h-[150px]" required />
        <button type="submit" className="w-full bg-teal-500 text-black font-bold py-4 rounded-xl hover:bg-teal-400 transform hover:scale-[1.02] transition-all shadow-lg shadow-teal-500/20">
          PUBLISH EVENT
        </button>
      </div>
    </form>
  );
}