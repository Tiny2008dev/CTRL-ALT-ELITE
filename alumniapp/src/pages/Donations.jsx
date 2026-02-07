import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Gift, ShieldCheck, ArrowLeft, ScanLine } from 'lucide-react';

export default function Donations() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
      {/* Back Button */}
      <div className="w-full max-w-5xl mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* --- SECTION 1: HERO IMPACT CARD --- */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row mb-8 animate-fade-in-up">
        
        {/* Text Content */}
        <div className="w-full md:w-3/5 p-10 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 p-2 rounded-full">
               <Heart className="text-teal-600 fill-teal-600" size={24} />
            </div>
            <span className="text-teal-600 font-bold uppercase tracking-wider text-sm">Alumni Giving</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Support the Next Generation
          </h1>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Your contribution helps provide scholarships, mentorship programs, and career development resources. Every bit counts towards building a brighter future.
          </p>

          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={18} /> Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <Gift className="text-purple-500" size={18} /> Tax Deductible
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-2/5 relative min-h-[300px] md:min-h-full">
           <img 
             src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop"
             alt="Happy Student" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* --- SECTION 2: QR CODE DONATION --- */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center animate-fade-in-up delay-100 flex flex-col items-center">
        
        <div className="bg-purple-50 p-4 rounded-full mb-6">
            <ScanLine className="text-purple-600" size={40} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">Scan to Donate</h2>
        <p className="text-slate-500 mb-10 max-w-md">Use any UPI app (Google Pay, Paytm, PhonePe) to scan the code below and make a contribution directly.</p>

        {/* QR Card */}
        <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 shadow-sm relative group transition-all hover:border-teal-400">
            
            {/* QR Image */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                 <img 
                   src="/jalqr.jpeg" // Ensure this image is in your public folder
                   alt="Donation QR Code" 
                   className="w-64 h-64 object-contain mix-blend-multiply"
                 />
            </div>

            <div className="text-center">
                <h3 className="text-slate-900 font-bold text-xl">Alumni Fund</h3>
                <p className="text-slate-500 text-sm font-bold mb-3">Jal Mehta</p>
                
                <div className="inline-block bg-white border border-slate-200 px-4 py-2 rounded-lg">
                    <span className="text-slate-600 font-mono font-bold tracking-wide">jalajhmehta@okhdfcbank</span>
                </div>
            </div>
        </div>

        <p className="mt-8 text-slate-400 text-sm font-medium">
          Note: Please mention your <span className="text-slate-600 font-bold">Name & Batch Year</span> in the payment description so we can acknowledge your support!
        </p>

      </div>
    </div>
  );
}