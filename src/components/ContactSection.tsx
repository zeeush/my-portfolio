'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const WHATSAPP_DM_URL = "https://wa.me/918299114703?text=Hello%20Zeeshan!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.";

export default function ContactSection() {
  return (
    <motion.div
      className="relative z-10 max-w-2xl w-full mx-auto px-4 py-4 sm:py-8 text-center flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Scaled-Up 3D Brand Core Floating PNG Emblem Centered with Background Core */}
      <div className="flex justify-center items-center mx-auto mb-3 mt-0 relative">
        <Link href="#about" className="relative group cursor-pointer flex items-center justify-center p-2 rounded-full">
          <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-2xl group-hover:bg-purple-500/60 transition-all -z-10" />
          <img
            src="/images/cyber-mandala-emblem.png"
            alt="Cyber Core Emblem - Click to view About"
            width={280}
            height={280}
            className="w-32 sm:w-44 md:w-56 lg:w-64 max-w-lg h-auto object-contain mx-auto mix-blend-screen drop-shadow-[0_0_40px_rgba(168,85,247,0.9)] group-hover:scale-105 group-hover:drop-shadow-[0_0_60px_rgba(168,85,247,1)] transition-all duration-500"
          />
        </Link>
      </div>

      {/* Typography & CTA Content Stack */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto w-full">
        
        {/* Line 1: Clickable Animated Neon CTA Pill */}
        <Link
          href={WHATSAPP_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-cyan-950/50 border border-cyan-400/60 text-cyan-300 hover:text-cyan-100 text-[11px] sm:text-xs font-['JetBrains_Mono',monospace] font-bold tracking-[0.16em] uppercase transition-all duration-300 hover:scale-105 hover:border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] cursor-pointer group"
        >
          <i className="ph ph-cursor-click text-cyan-400 text-sm sm:text-base animate-bounce group-hover:rotate-12 transition-transform" />
          <span>LET&apos;S COLLABORATE</span>
        </Link>

        {/* Line 2: Heavy Display Headline (Orbitron) */}
        <h2 className="font-['Orbitron',sans-serif] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase mt-1 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Ready to Level Up Your Brand?
        </h2>

        {/* Line 3: Modern Display Sub-headline (Syne) */}
        <p className="font-['Syne',sans-serif] text-xs sm:text-sm md:text-base font-bold tracking-widest text-cyan-200/90 uppercase mt-1 max-w-lg mx-auto text-center leading-relaxed">
          LET&apos;S FORGE AN ICONIC BRAND IDENTITY THAT COMMANDS ATTENTION.
        </p>

        {/* High-Contrast Floating CTA Button Stack */}
        <motion.div 
          className="my-4 sm:my-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto mx-auto relative z-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Button 1: Primary Action (Start a Project) */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <Link
              href="/start-project"
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[50px] sm:min-h-[54px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 border-2 border-white/60 text-zinc-950 font-['Outfit',sans-serif] font-black text-xs sm:text-sm tracking-[0.08em] uppercase shadow-[0_0_30px_rgba(0,242,254,0.7),0_10px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_45px_rgba(0,242,254,1)] transition-all duration-300 gap-2.5 cursor-pointer group/btn whitespace-nowrap"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="tracking-[0.08em] uppercase whitespace-nowrap leading-none">Start a Project</span>
              <motion.i 
                className="ph ph-paper-plane-tilt text-base font-black text-zinc-950 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform flex-shrink-0 leading-none"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </Link>
          </motion.div>

          {/* Button 2: Secondary Action (Direct Message) */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <Link
              href={WHATSAPP_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[50px] sm:min-h-[54px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#061e18]/95 hover:bg-emerald-950 border-2 border-emerald-400/90 text-emerald-300 hover:text-white font-['Outfit',sans-serif] font-black text-xs sm:text-sm tracking-[0.08em] uppercase shadow-[0_0_25px_rgba(16,185,129,0.45),0_10px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(16,185,129,0.85)] hover:border-emerald-300 transition-all duration-300 gap-2.5 cursor-pointer group/btn backdrop-blur-md whitespace-nowrap"
            >
              <i className="ph ph-whatsapp-logo text-lg sm:text-xl text-emerald-400 group-hover/btn:text-white group-hover/btn:scale-110 transition-transform flex-shrink-0" />
              <span className="tracking-[0.08em] uppercase group-hover/btn:text-white transition-colors whitespace-nowrap leading-none">Direct Message</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Line 4: Body Description (Plus Jakarta Sans) */}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-center text-zinc-400 font-normal text-xs sm:text-sm leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
          Whether you need an iconic logo, a high-converting banner set, or a complete brand ecosystem—let&apos;s build something unforgettable together.
        </p>

      </div>
    </motion.div>
  );
}
