'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StartProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    contactInfo: '',
    projectDetails: '',
    referenceLinks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.projectName || !formData.contactInfo || !formData.projectDetails) return;

    // Construct mailto link payload directed to z3shan.in@gmail.com
    const subject = encodeURIComponent(`New Project Brief from ${formData.clientName} - ${formData.projectName}`);
    const bodyText = `New Project Intake Brief

• Client Name: ${formData.clientName}
• Project / Brand Name: ${formData.projectName}
• Contact Information: ${formData.contactInfo}

• Project Scope & Vision:
${formData.projectDetails}

• Design References / Links:
${formData.referenceLinks || 'None provided'}
`;

    const mailtoUrl = `mailto:z3shan.in@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    
    // Open user's default email client
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen w-full bg-[#030508] text-white selection:bg-cyan-500 selection:text-black pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center relative overflow-y-auto font-['Outfit',sans-serif]">
      
      {/* 3D Atmospheric Background */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
        <img
          src="/images/1stpage-bg.jpg"
          alt="Atmospheric Cyber Background"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/90 via-[#030508]/75 to-[#030508]/95" />
      </div>

      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Back Navigation Bar */}
        <div className="w-full mb-6 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/80 hover:bg-cyan-950/50 border border-white/10 hover:border-cyan-400/80 text-cyan-400 hover:text-white backdrop-blur-md shadow-lg transition-all duration-200 font-mono text-xs uppercase tracking-widest cursor-pointer group"
          >
            <i className="ph ph-arrow-left text-sm group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ================= GOOGLE FORM STYLE: HEADER CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8"
        >
          {/* Top Neon Accent Banner */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 shadow-[0_0_15px_rgba(0,242,254,0.8)]" />

          <div className="pt-2">
            <span className="text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.2em] uppercase font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
              PROJECT INTAKE FORM
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mt-1">
              Start a Project
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2.5 leading-relaxed">
              Fill out the project scope below to receive a custom proposal and start collaborating. Fields marked with <span className="text-cyan-400 font-bold">*</span> are required.
            </p>
          </div>
        </motion.div>

        {submitted ? (
          /* Submission Success Card */
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-zinc-900/60 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.15)]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 text-3xl sm:text-4xl shadow-[0_0_30px_rgba(0,240,255,0.5)] mx-auto">
              <i className="ph ph-check-bold" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              PROJECT BRIEF PREPARED
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Your default email application has opened with your intake brief addressed to <span className="text-cyan-400 font-mono font-bold">z3shan.in@gmail.com</span>. Click send in your email client to deliver.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-8 py-3.5 rounded-xl bg-cyan-400 text-zinc-950 font-black text-sm font-mono uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.45)] cursor-pointer"
            >
              Edit Project Brief
            </button>
          </motion.div>
        ) : (
          /* ================= GOOGLE FORM STYLE: SINGLE COLUMN QUESTION CARDS ================= */
          <form onSubmit={handleSubmit} className="w-full space-y-8">
            
            {/* Question 1: Client Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl transition-all"
            >
              <label className="block text-base font-semibold text-zinc-200 mb-3">
                Your Name <span className="text-cyan-400 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-zinc-950 border border-zinc-700/90 rounded-xl px-5 py-3.5 sm:py-4 text-white text-base placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </motion.div>

            {/* Question 2: Project or Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl transition-all"
            >
              <label className="block text-base font-semibold text-zinc-200 mb-3">
                Project / Brand Name <span className="text-cyan-400 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="e.g. Nexus Esports, SITM Academy, CyberTech"
                className="w-full bg-zinc-950 border border-zinc-700/90 rounded-xl px-5 py-3.5 sm:py-4 text-white text-base placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </motion.div>

            {/* Question 3: Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl transition-all"
            >
              <label className="block text-base font-semibold text-zinc-200 mb-3">
                Contact Information (Email / Phone / Discord) <span className="text-cyan-400 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="your.email@domain.com or +1 (555) 000-0000"
                className="w-full bg-zinc-950 border border-zinc-700/90 rounded-xl px-5 py-3.5 sm:py-4 text-white text-base placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </motion.div>

            {/* Question 4: Project Description & Scope */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl transition-all"
            >
              <label className="block text-base font-semibold text-zinc-200 mb-3">
                Project Scope & Vision <span className="text-cyan-400 font-bold">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={formData.projectDetails}
                onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                placeholder="Describe your project deliverables, brand personality, target audience, and preferred timeline..."
                className="w-full min-h-[140px] bg-zinc-950 border border-zinc-700/90 rounded-xl px-5 py-4 text-white text-base placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all leading-relaxed resize-y"
              />
            </motion.div>

            {/* Question 5: Reference Links (Optional) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl transition-all"
            >
              <label className="block text-base font-semibold text-zinc-200 mb-3">
                Design References or Links <span className="text-zinc-500 text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.referenceLinks}
                onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                placeholder="https://behance.net/gallery/example or Pinterest board"
                className="w-full bg-zinc-950 border border-zinc-700/90 rounded-xl px-5 py-3.5 sm:py-4 text-white text-base placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </motion.div>

            {/* ================= THICKER & BOLDER COMMANDING SUBMIT BUTTON ================= */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pt-2 flex flex-col items-center"
            >
              <button
                type="submit"
                className="w-full py-4 sm:py-5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 text-zinc-950 font-['Outfit',sans-serif] font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(0,242,254,0.65)] hover:shadow-[0_0_45px_rgba(0,242,254,0.95)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>SEND PROJECT BRIEF</span>
                <i className="ph ph-paper-plane-tilt text-lg sm:text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <p className="text-xs text-zinc-500 font-mono mt-3 text-center">
                Secure Intake • Direct Response from Zeeshan within 24 Hours
              </p>
            </motion.div>

          </form>
        )}

      </div>
    </main>
  );
}
