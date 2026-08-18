'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#work' },
    { name: 'Process', href: '/#process' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="w-full relative z-20 min-h-[3.25rem] py-2 sm:py-2.5 md:py-0 md:h-14 shrink-0 px-4 sm:px-6 md:px-10 backdrop-blur-md bg-black/50 border-t border-white/10 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Social Media Icons (LinkedIn, Instagram, Behance, Dribbble, X) */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-300">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/zeeiftekhar-zeeshan-269804427/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105"
          >
            <i className="ph ph-linkedin-logo"></i>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/zeeshanthezeeush/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105"
          >
            <i className="ph ph-instagram-logo"></i>
          </a>

          {/* Behance */}
          <a
            href="https://www.behance.net/458b6ecb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105"
          >
            <i className="ph ph-behance-logo"></i>
          </a>

          {/* Dribbble */}
          <a
            href="https://dribbble.com/ZeeuSh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Dribbble"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105"
          >
            <i className="ph ph-dribbble-logo"></i>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com/zeeshan20240660"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* Center: Navigation Links matching Header Bar style */}
        <nav className="flex flex-row items-center justify-center flex-wrap sm:flex-nowrap gap-x-3 gap-y-1 sm:gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side: Copyright Text */}
        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-[9px] sm:text-[11px] md:text-xs text-zinc-400 font-mono text-center sm:text-right whitespace-nowrap">
            &copy; {currentYear} Zeeshan. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}