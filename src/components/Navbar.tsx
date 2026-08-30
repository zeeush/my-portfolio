'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#work' },
    { name: 'Process', href: '/#process' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 h-16 px-4 md:px-10 backdrop-blur-md bg-black/50 border-b border-white/10 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center md:justify-between relative">
        
        {/* Left: 2-Line Stacked Brand Identity (Centered on Mobile, Left-Aligned on Desktop) */}
        <Link href="/" className="flex items-center gap-3 group justify-center md:justify-start mx-auto md:mx-0">
          <span className="text-2xl md:text-3xl font-black font-['Outfit'] bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,1)] group-hover:scale-105 transition-all inline-block">
            Z
          </span>
          <div className="flex flex-col items-start justify-center text-left">
            <span className="font-extrabold text-sm md:text-base tracking-wider text-white font-['Outfit'] group-hover:text-cyan-400 transition-colors leading-tight text-left">
              ZEESHAN
            </span>
            <span className="text-[9px] md:text-[10px] tracking-widest text-cyan-400/80 font-mono font-semibold uppercase leading-tight mt-0.5 text-left">
              BRAND STRATEGIST
            </span>
          </div>
        </Link>

        {/* Center: Strict Single-Line Navigation Links */}
        <nav className="hidden md:flex flex-row items-center justify-center flex-nowrap gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs md:text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Standalone Glowing Neon "LET'S CHAT" Link & Mobile Menu Toggle */}
        <div className="absolute right-0 md:relative flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-2.5 text-cyan-400 font-mono text-sm md:text-base font-bold tracking-widest uppercase drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] hover:drop-shadow-[0_0_22px_rgba(0,229,255,1)] hover:text-cyan-300 transition-all duration-300 group cursor-pointer"
          >
            <span>Let&apos;s Chat</span>
            <i className="ph ph-chat-teardrop-text text-xl md:text-2xl text-cyan-400 drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] group-hover:scale-115 transition-transform"></i>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-none bg-white/5 border border-white/15 flex items-center justify-center text-gray-200 hover:text-cyan-400 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <i className={`ph ${mobileMenuOpen ? 'ph-x' : 'ph-list'} text-xl`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu - Completely Center-Aligned */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#07070a]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 flex flex-col items-center justify-center text-center gap-4 animate-in slide-in-from-top duration-200 shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-200 hover:text-cyan-400 py-1 transition-colors text-center w-full flex items-center justify-center"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2.5 text-cyan-400 font-mono text-sm font-bold uppercase tracking-widest drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] hover:text-cyan-300 py-2 transition-all w-full text-center"
          >
            <span>Let&apos;s Chat</span>
            <i className="ph ph-chat-teardrop-text text-xl text-cyan-400"></i>
          </Link>
        </div>
      )}
    </header>
  );
}
