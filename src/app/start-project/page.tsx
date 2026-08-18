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
    <main className="min-h-screen w-full bg-[#030508] text-white selection:bg-cyan-500 selection:text-black py-12 sm:py-16 px-4 sm:px-8 flex flex-col items-center justify-center relative overflow-y-auto font-['Outfit',sans-serif]">
      {/* 3D Atmospheric Illuminated Cave Backdrop with Depth Vignette */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden fixed">
        <img
          src="/images/1stpage-bg.jpg"
          alt="Atmospheric Cyber Cave Background"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
        />
        {/* Cyan & Purple Ambient Neon Radial Lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/85 via-[#030508]/65 to-[#030508]/95" />
      </div>

      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Centered Expanded Glassmorphic Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#07090e]/90 border border-cyan-500/30 backdrop-blur-2xl rounded-2xl p-6 sm:p-12 lg:p-14 shadow-[0_0_60px_rgba(0,240,255,0.15)] relative overflow-hidden"
        >
          {/* Subtle Top Glowing Line Accent */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Back Navigation Link Inside Card Header */}
          <div className="mb-6 flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-all group"
            >
              <i className="ph ph-arrow-left text-base group-hover:-translate-x-1 transition-transform" />
              <span>← BACK TO HOME</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              START A PROJECT
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-['Plus_Jakarta_Sans'] font-normal mt-3 max-w-lg text-center">
              Share your project details below to connect directly with the team.
            </p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center flex flex-col items-center justify-center space-y-5 w-full"
            >
              <div className="w-18 h-18 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_30px_rgba(0,240,255,0.5)] mx-auto">
                <i className="ph ph-check-bold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] text-center">PROJECT BRIEF PREPARED</h2>
              <p className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto font-['Plus_Jakarta_Sans'] text-center leading-relaxed">
                Your default email application has opened with your formatted intake payload addressed to <span className="text-cyan-400 font-mono font-bold">z3shan.in@gmail.com</span>. Click send in your email application to deliver.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-8 py-3.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.45)] cursor-pointer mx-auto"
              >
                Edit Project Brief
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-8">
              {/* Field 1: Client Name */}
              <div className="flex flex-col text-left">
                <label className="text-xs sm:text-sm font-bold font-['Syne',sans-serif] text-cyan-300 uppercase tracking-wider mb-2.5 sm:mb-3">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-5 py-3.5 sm:py-4 text-white placeholder-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Field 2: Project or Brand Name */}
              <div className="flex flex-col text-left">
                <label className="text-xs sm:text-sm font-bold font-['Syne',sans-serif] text-cyan-300 uppercase tracking-wider mb-2.5 sm:mb-3">
                  PROJECT OR BRAND NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Nexus Esports, SITM, Channel Name"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-5 py-3.5 sm:py-4 text-white placeholder-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Field 3: Contact Information */}
              <div className="flex flex-col text-left">
                <label className="text-xs sm:text-sm font-bold font-['Syne',sans-serif] text-cyan-300 uppercase tracking-wider mb-2.5 sm:mb-3">
                  CONTACT INFORMATION *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Email address, Phone number, or Discord handle"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-5 py-3.5 sm:py-4 text-white placeholder-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Field 4: About Your Project */}
              <div className="flex flex-col text-left">
                <label className="text-xs sm:text-sm font-bold font-['Syne',sans-serif] text-cyan-300 uppercase tracking-wider mb-2.5 sm:mb-3">
                  ABOUT YOUR PROJECT *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="Describe what you need, your target audience, and your visual style preferences..."
                  className="w-full min-h-[140px] bg-black/60 border border-white/15 rounded-xl px-5 py-4 text-white placeholder-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none transition-all"
                />
              </div>

              {/* Field 5: Reference Links (Optional) */}
              <div className="flex flex-col text-left">
                <label className="text-xs sm:text-sm font-bold font-['Syne',sans-serif] text-cyan-300 uppercase tracking-wider mb-2.5 sm:mb-3">
                  DESIGN REFERENCES OR LINKS (OPTIONAL)
                </label>
                <input
                  type="url"
                  value={formData.referenceLinks}
                  onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                  placeholder="Paste links to Behance, Pinterest, or reference sites"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-5 py-3.5 sm:py-4 text-white placeholder-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  className="w-full py-4 sm:py-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-['Outfit',sans-serif] font-black text-sm sm:text-base tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.45)] cursor-pointer"
                >
                  SEND PROJECT BRIEF
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
