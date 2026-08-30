'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const WHATSAPP_DM_URL = "https://wa.me/918299114703?text=Hello%20Zeeshan!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.";

export default function ContactSection() {
  return (
    <motion.div
      className="relative z-10 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 text-center flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Scaled-Up 3D Brand Core Floating PNG Emblem Centered with Background Core */}
      <div className="flex justify-center items-center mx-auto mb-3 mt-0 relative">
        <Link href="#about" className="relative group cursor-pointer flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-3xl group-hover:bg-purple-500/60 transition-all -z-10" />
          <img
            src="/images/cyber-mandala-emblem.png"
            alt="Cyber Core Emblem - Click to view About"
            className="w-48 sm:w-56 md:w-80 lg:w-[360px] max-w-lg h-auto object-contain mx-auto mix-blend-screen drop-shadow-[0_0_50px_rgba(168,85,247,0.95)] group-hover:scale-105 group-hover:drop-shadow-[0_0_70px_rgba(168,85,247,1)] transition-all duration-500"
          />
        </Link>
      </div>

      {/* Typography & CTA Content Stack */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto w-full mt-2">
        
        {/* Line 1: Clickable Animated Neon CTA (JetBrains Mono -> WhatsApp) */}
        <Link
          href={WHATSAPP_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-400/50 text-cyan-300 hover:text-cyan-200 text-sm sm:text-base font-['JetBrains_Mono',monospace] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 hover:border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] cursor-pointer group"
        >
          <i className="ph ph-cursor-click text-cyan-400 text-base sm:text-lg animate-bounce group-hover:rotate-12 transition-transform" />
          <span>LET&apos;S COLLABORATE</span>
        </Link>

        {/* Line 2: Heavy Display Headline (Orbitron) */}
        <h2 className="font-['Orbitron',sans-serif] text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide uppercase mt-2 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Ready to Level Up Your Brand?
        </h2>

        {/* Line 3: Modern Display Sub-headline (Syne) */}
        <p className="font-['Syne',sans-serif] text-sm sm:text-base md:text-lg font-bold tracking-widest text-cyan-200/90 uppercase mt-3 max-w-lg mx-auto text-center leading-relaxed">
          LET&apos;S FORGE AN ICONIC BRAND IDENTITY THAT COMMANDS ATTENTION.
        </p>

        {/* Transparent Floating CTA Button Stack */}
        <motion.div 
          className="my-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mx-auto bg-transparent border-0 p-0 relative z-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Button 1: Start a Project - Electric Cyan Hyper-Glow Gradient */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <Link
              href="/start-project"
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[200px] sm:min-w-[210px] min-h-[48px] px-8 sm:px-10 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 text-zinc-950 font-['Outfit',sans-serif] font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,242,254,0.65)] hover:shadow-[0_0_35px_rgba(0,242,254,0.95)] transition-all duration-300 gap-2 cursor-pointer group/btn whitespace-nowrap"
            >
              {/* Light Sweep Shimmer Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="tracking-wider uppercase whitespace-nowrap leading-none">Start a Project</span>
              <motion.i 
                className="ph ph-paper-plane-tilt text-sm sm:text-base font-bold text-zinc-950 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform flex-shrink-0 leading-none"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </Link>
          </motion.div>

          {/* Button 2: Direct Message - Deep Obsidian Neon Violet Glass Card (WhatsApp) */}
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
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[200px] sm:min-w-[210px] min-h-[48px] px-8 sm:px-10 py-3 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-100 hover:bg-purple-600/50 hover:border-purple-400 font-['Outfit',sans-serif] font-extrabold text-sm tracking-wider uppercase shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(192,132,252,0.7)] transition-all duration-300 gap-2 cursor-pointer group/btn backdrop-blur-md whitespace-nowrap"
            >
              <span className="tracking-wider uppercase group-hover/btn:text-white transition-colors whitespace-nowrap leading-none">Direct Message</span>
              <svg 
                className="w-4 h-4 text-purple-200 group-hover/btn:text-white transition-colors flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path d="M8 12h.01" />
                <path d="M12 12h.01" />
                <path d="M16 12h.01" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Line 4: Body Description (Plus Jakarta Sans) */}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-center text-zinc-400 font-normal text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-4 px-2 sm:px-0">
          Whether you need an iconic logo, a high-converting banner set, or a complete brand ecosystem—let&apos;s build something unforgettable together.
        </p>

      </div>
    </motion.div>
  );
}
