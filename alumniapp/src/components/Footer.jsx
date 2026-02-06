import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  const location = useLocation();

  // Hide footer on Login/Register to keep them clean
  if (location.pathname === '/' || location.pathname === '/register') return null;

  return (
    <footer className="w-full bg-[#020b20] border-t border-white/5 pt-16 pb-8 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* BRAND COLUMN */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center text-black font-bold">AC</div>
            <span className="text-xl font-bold tracking-tight">Alumni Connect</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Bridging the gap between past and present. Join a network of over 10,000 alumni and students fostering growth, mentorship, and opportunities.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-teal-400 font-bold uppercase tracking-widest text-xs mb-6">Platform</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/posts" className="hover:text-white transition-colors">Community Feed</Link></li>
            <li><Link to="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
            <li><Link to="/accounts" className="hover:text-white transition-colors">Alumni Directory</Link></li>
            <li><Link to="/jobs" className="hover:text-white transition-colors">Career Portal</Link></li>
          </ul>
        </div>

        {/* CONTACT / SOCIAL */}
        <div>
          <h3 className="text-teal-400 font-bold uppercase tracking-widest text-xs mb-6">Connect</h3>
          <div className="flex gap-4 mb-6">
            <SocialIcon icon={<Linkedin size={18} />} />
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Instagram size={18} />} />
            <SocialIcon icon={<Facebook size={18} />} />
          </div>
          <p className="text-gray-500 text-xs">
            © 2026 Borcelle University.<br />All rights reserved.
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/5 pt-8 text-center">
        <p className="text-gray-600 text-xs flex items-center justify-center gap-1">
          Made with <Heart size={10} className="text-red-500 fill-red-500" /> by the Hackathon Team
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-teal-500 hover:text-black transition-all">
      {icon}
    </button>
  );
}