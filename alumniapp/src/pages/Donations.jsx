import React, { useState } from 'react';
import { Heart, CreditCard, Gift, ShieldCheck } from 'lucide-react';

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState(1500); // Default selection
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Preset Button Click
  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Clear custom if preset is clicked
  };

  // Handle Custom Input Change
  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null); // Deselect presets
  };

  // Mock Payment Function (Place for Razorpay later)
  const handleDonate = () => {
    const finalAmount = customAmount || selectedAmount;
    if (!finalAmount || finalAmount <= 0) return alert("Please enter a valid amount.");

    setIsProcessing(true);
    
    // Simulate API Call / Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Thank you! ₹${finalAmount} donation processed successfully.`);
      // Reset form
      setSelectedAmount(1500);
      setCustomAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#031130] text-slate-800 font-sans pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      
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
            Support the Next Generation of Students
          </h1>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Your contribution helps provide scholarships, mentorship programs, and career development resources for students in need. Every bit counts towards building a brighter future.
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
           {/* Gradient Overlay for text readability if needed, or style */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* --- SECTION 2: DONATION FORM --- */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center animate-fade-in-up delay-100">
        
        <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest mb-10">Choose an Amount</h2>

        {/* Preset Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[500, 1000, 1500, 2000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                selectedAmount === amount 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ₹ {amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="max-w-lg mx-auto mb-12 relative">
           <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
           <input 
             type="number" 
             placeholder="ENTER CUSTOM AMOUNT" 
             value={customAmount}
             onChange={handleCustomChange}
             className="w-full bg-slate-100 rounded-full py-5 pl-12 pr-6 text-center font-bold text-xl outline-none focus:ring-4 focus:ring-teal-200 transition-all placeholder-slate-400"
           />
        </div>

        {/* Confirm Button */}
        <button 
          onClick={handleDonate}
          disabled={isProcessing}
          className="w-full max-w-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              CONFIRM DONATION <CreditCard size={24} />
            </>
          )}
        </button>

        <p className="mt-6 text-slate-400 text-sm">
          By donating, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
}