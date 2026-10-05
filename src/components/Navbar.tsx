'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#work' },
    { name: 'Process', href: '/#process' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header ref={menuRef} className="fixed top-0 left-0 right-0 w-full z-50 h-18 px-4 md:px-10 backdrop-blur-md bg-black/60 border-b border-white/10 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center md:justify-between relative">
        
        {/* Left: 2-Line Stacked Brand Identity (Centered on Mobile, Left-Aligned on Desktop) */}
        <Link href="/" className="flex items-center gap-3.5 group justify-center md:justify-start mx-auto md:mx-0 py-2 px-3 rounded-xl transition-all">
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

        {/* Center: Strict Single-Line Navigation Links with generous padding */}
        <nav className="hidden md:flex flex-row items-center justify-center flex-nowrap gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-cyan-400 hover:bg-white/5 transition-all whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Standalone Glowing Neon "LET'S CHAT" Button & Mobile Menu Toggle */}
        <div className="absolute right-0 md:relative flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center justify-center gap-2 relative text-cyan-400 font-mono text-xs md:text-sm font-bold tracking-widest uppercase group whitespace-nowrap"
          >
            <span className="relative z-10">Let&apos;s Chat</span>
            <i className="ph ph-chat-teardrop-text text-lg group-hover:scale-110 transition-transform relative z-10"></i>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"></span>
          </Link>

          {/* Mobile Menu Button with comfortable touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-gray-200 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors cursor-pointer"
          >
            <i className={`ph ${mobileMenuOpen ? 'ph-x' : 'ph-list'} text-xl`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#07070a]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 flex flex-col items-center justify-center text-center gap-3 mobile-menu-animate shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-200 hover:text-cyan-400 px-5 py-2.5 rounded-xl hover:bg-white/5 transition-all text-center w-full flex items-center justify-center"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all w-full text-center"
          >
            <span>Let&apos;s Chat</span>
            <i className="ph ph-chat-teardrop-text text-lg text-white"></i>
          </Link>
        </div>
      )}
    </header>
  );
}
