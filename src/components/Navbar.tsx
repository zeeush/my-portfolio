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
    <header
      ref={menuRef}
      style={{
        marginTop: '-1px',
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingRight: '0px',
        height: '50px',
      }}
      className="fixed top-0 left-0 right-0 w-full z-50 h-[50px] -mt-px pt-0 pb-0 pr-0 pl-4 sm:pl-6 md:pl-10 backdrop-blur-md bg-black/70 border-b border-white/10 flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between relative">
        
        {/* Left: 2-Line Stacked Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-1 rounded-xl transition-all">
          <span className="text-xl sm:text-2xl font-black font-['Outfit'] bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,1)] group-hover:scale-105 transition-all inline-block">
            Z
          </span>
          <div className="flex flex-col items-start justify-center text-left">
            <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white font-['Outfit'] group-hover:text-cyan-400 transition-colors leading-tight text-left">
              ZEESHAN
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest text-cyan-400/90 font-mono font-semibold uppercase leading-tight mt-0.5 text-left">
              BRAND STRATEGIST
            </span>
          </div>
        </Link>

        {/* Center: Tablet & Desktop Navigation Links */}
        <nav className="hidden md:flex flex-row items-center justify-center flex-nowrap gap-4 lg:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-cyan-400 hover:bg-white/5 transition-all whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Standalone Glowing Neon "LET'S CHAT" Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center justify-center gap-2 relative text-cyan-400 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase group whitespace-nowrap py-1 px-2"
          >
            <span className="relative z-10">Let&apos;s Chat</span>
            <i className="ph ph-chat-teardrop-text text-base group-hover:scale-110 transition-transform relative z-10"></i>
            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"></span>
          </Link>

          {/* Mobile Menu Button with comfortable 44px touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-gray-200 hover:text-cyan-400 hover:border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
          >
            <i className={`ph ${mobileMenuOpen ? 'ph-x' : 'ph-list'} text-xl`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#07070a]/98 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 flex flex-col items-center justify-center text-center gap-2 mobile-menu-animate shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium tracking-wide text-gray-200 hover:text-cyan-400 px-5 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all text-center w-full flex items-center justify-center min-h-[44px]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 w-full flex flex-col gap-2.5">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all w-full text-center min-h-[44px]"
            >
              <span>Let&apos;s Chat</span>
              <i className="ph ph-chat-teardrop-text text-base"></i>
            </Link>
            <Link
              href="/start-project"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all w-full text-center min-h-[44px]"
            >
              <span>Start a Project</span>
              <i className="ph ph-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
