'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const WHATSAPP_DM_URL = "https://wa.me/918299114703?text=Hello%20Zeeshan!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.";

export default function ContactSection() {
  return (
    <motion.div
      className="relative z-10 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 text-center flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Scaled-Up 3D Brand Core Floating PNG Emblem Centered with Background Core */}
      <div className="flex justify-center items-center mx-auto mb-2 mt-0 relative">
        <Link href="#about" className="relative group cursor-pointer flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-3xl group-hover:bg-purple-500/60 transition-all -z-10" />
          <img
            src="/images/cyber-mandala-emblem.png"
            alt="Cyber Core Emblem - Click to view About"
            className="w-48 sm:w-56 md:w-80 lg:w-[360px] max-w-lg h-auto object-contain mx-auto mix-blend-screen drop-shadow-[0_0_50px_rgba(168,85,247,0.95)] group-hover:scale-105 group-hover:drop-shadow-[0_0_70px_rgba(168,85,247,1)] transition-all duration-500"
          />
        </Link>
      </div>

      {/* 1. Dark Gradient Scrim / Glassmorphic Card Container for Guaranteed Legibility */}
      <div className="relative w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#06080e]/80 sm:bg-[#06080e]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.06)] flex flex-col items-center text-center gap-4 mt-2">
        
        {/* Subtle Top Cyan Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

        {/* 2. Eyebrow Tag / Small Label: Bright Accent Color & Spaced Typography */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-cyan-300 uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]">
            Ready to Level Up Your Brand?
          </span>
        </div>

        {/* 2 & 3. Main Heading: Bold / Extra-Bold Pure White with High Contrast & Comfortable Line Height */}
        <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase text-center leading-[1.25] sm:leading-[1.3] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] mt-1">
          LET&apos;S FORGE AN ICONIC BRAND IDENTITY THAT COMMANDS ATTENTION.
        </h2>

        {/* 2. Paragraph Text: Secondary Muted Off-White, Highly Legible */}
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-center text-zinc-300 font-medium text-sm sm:text-base leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Whether you need an iconic logo, a high-converting banner set, or a complete brand ecosystem—let&apos;s build something unforgettable together.
        </p>

        {/* 3. Action Buttons with Ample Margin & Separation */}
        <motion.div 
          className="mt-4 mb-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto mx-auto relative z-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Button 1: Primary Action (Start a Project) - Solid Vibrant Electric Cyan with High Contrast */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <Link
              href="/start-project"
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[210px] sm:min-w-[230px] min-h-[52px] px-8 sm:px-10 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 border-2 border-white/60 text-zinc-950 font-['Outfit',sans-serif] font-black text-sm sm:text-base tracking-[0.08em] uppercase shadow-[0_0_30px_rgba(0,242,254,0.7),0_10px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_45px_rgba(0,242,254,1)] transition-all duration-300 gap-2.5 cursor-pointer group/btn whitespace-nowrap"
            >
              {/* Light Sweep Shimmer Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="tracking-[0.08em] uppercase whitespace-nowrap leading-none">Start a Project</span>
              <motion.i 
                className="ph ph-paper-plane-tilt text-base sm:text-lg font-black text-zinc-950 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform flex-shrink-0 leading-none"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </Link>
          </motion.div>

          {/* Button 2: Secondary Action (Direct Message) - Solid WhatsApp Emerald Card with Strong Border & Contrast */}
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
              className="relative overflow-hidden inline-flex items-center justify-center text-center w-full sm:w-auto min-w-[210px] sm:min-w-[230px] min-h-[52px] px-8 sm:px-10 py-3.5 rounded-xl bg-[#061e18]/95 hover:bg-emerald-950 border-2 border-emerald-400/90 text-emerald-300 hover:text-white font-['Outfit',sans-serif] font-black text-sm sm:text-base tracking-[0.08em] uppercase shadow-[0_0_25px_rgba(16,185,129,0.45),0_10px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(16,185,129,0.85)] hover:border-emerald-300 transition-all duration-300 gap-2.5 cursor-pointer group/btn backdrop-blur-md whitespace-nowrap"
            >
              {/* WhatsApp Icon */}
              <i className="ph ph-whatsapp-logo text-lg sm:text-xl text-emerald-400 group-hover/btn:text-white group-hover/btn:scale-110 transition-transform flex-shrink-0" />
              <span className="tracking-[0.08em] uppercase group-hover/btn:text-white transition-colors whitespace-nowrap leading-none">Direct Message</span>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}
