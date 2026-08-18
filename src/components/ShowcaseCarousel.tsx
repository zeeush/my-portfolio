'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem, projectsData } from '@/data/projects';

interface ShowcaseCarouselProps {
  category: string;
  images?: string[];
}

export default function ShowcaseCarousel({ category }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const items: ProjectItem[] = projectsData[category] || projectsData.logo;
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextSlide, prevSlide]);

  const activeItem = items[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 select-none">
      
      {/* ================= 3D COVERFLOW STAGE CONTAINER ================= */}
      <div className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] flex items-center justify-center [perspective:1400px]">
        
        {/* Ambient Neon Stage Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] bg-gradient-to-r from-cyan-500/20 via-purple-600/15 to-pink-500/20 blur-3xl -z-10 rounded-none pointer-events-none"></div>

        {/* 3D Slides Container */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {items.map((item, index) => {
            // Calculate relative offset from currentIndex
            let offset = index - currentIndex;
            // Normalize for smooth circular wrap-around
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Compute dynamic 3D positions
            let xOffset = '0%';
            let rotateY = 0;
            let scale = 1;
            let zIndex = 30;
            let opacity = 1;
            let blur = 'blur(0px)';

            if (isCenter) {
              xOffset = '0%';
              rotateY = 0;
              scale = 1;
              zIndex = 30;
              opacity = 1;
              blur = 'blur(0px)';
            } else if (isLeft) {
              xOffset = '-66%';
              rotateY = 35;
              scale = 0.82;
              zIndex = 20;
              opacity = 0.35;
              blur = 'blur(1px)';
            } else if (isRight) {
              xOffset = '66%';
              rotateY = -35;
              scale = 0.82;
              zIndex = 20;
              opacity = 0.35;
              blur = 'blur(1px)';
            } else if (offset === -2) {
              xOffset = '-110%';
              rotateY = 45;
              scale = 0.68;
              zIndex = 10;
              opacity = 0.15;
              blur = 'blur(2px)';
            } else if (offset === 2) {
              xOffset = '110%';
              rotateY = -45;
              scale = 0.68;
              zIndex = 10;
              opacity = 0.15;
              blur = 'blur(2px)';
            }

            return (
              <motion.div
                key={item.id}
                animate={{
                  x: xOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  filter: blur,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                  zIndex: zIndex,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => {
                  if (isCenter) {
                    setIsLightboxOpen(true);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute w-[740px] max-w-[85vw] aspect-[16/10] rounded-none overflow-hidden cursor-pointer transition-shadow duration-300 ${
                  isCenter
                    ? 'border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.25),0_20px_50px_rgba(0,0,0,0.9)] bg-black'
                    : 'border border-white/10 bg-black/90 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* 100% Clean Raw Artwork */}
                <div className="relative w-full h-full overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-full object-cover object-center scale-[1.035] transition-transform duration-700 ${
                      isCenter ? 'group-hover:scale-108 group-hover:brightness-105' : ''
                    }`}
                  />

                  {/* Active Center Card Standalone Fullscreen Expansion Icon Button */}
                  {isCenter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-cyan-500/25 border border-cyan-400/60 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer z-30"
                      title="Open Fullscreen View"
                      aria-label="Open Fullscreen View"
                    >
                      <i className="ph ph-arrows-out-simple text-lg drop-shadow-[0_0_8px_rgba(0,229,255,0.9)]"></i>
                    </button>
                  )}

                  {/* Active Center Card Subtle Zoom Hover Badge */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                      <span className="px-4 py-2 rounded-none bg-black/85 border border-cyan-400 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.6)]">
                        <i className="ph ph-arrows-out-simple text-sm"></i>
                        <span>Click to Expand</span>
                      </span>
                    </div>
                  )}

                  {/* Side Card Glass Darkening Overlay */}
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"></div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sharp 4-Corner Rectangular Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute -left-2 sm:-left-4 md:-left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-none bg-[#070914]/85 hover:bg-cyan-500/20 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:scale-105 transition-all cursor-pointer z-40"
          aria-label="Previous Slide"
        >
          <i className="ph ph-caret-left text-2xl font-bold"></i>
        </button>

        {/* Sharp 4-Corner Rectangular Next Button */}
        <button
          onClick={nextSlide}
          className="absolute -right-2 sm:-right-4 md:-right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-none bg-[#070914]/85 hover:bg-cyan-500/20 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:scale-105 transition-all cursor-pointer z-40"
          aria-label="Next Slide"
        >
          <i className="ph ph-caret-right text-2xl font-bold"></i>
        </button>

      </div>

      {/* ================= FREE-FLOATING PROJECT METADATA (NO BOX CONTAINER + NEON TEXT GLOW) ================= */}
      <motion.div
        key={activeItem.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto mt-8 px-4 flex flex-col items-center text-center gap-2.5 relative z-30"
      >
        {/* Top Row: Tagline & Category Tags (Free-Floating Neon Cyan) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-0.5">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold drop-shadow-[0_0_10px_rgba(0,229,255,0.85)]">
            {activeItem.tagline}
          </span>
          <div className="flex items-center gap-2">
            {activeItem.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-cyan-300/80 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Project Title with Clean High-Contrast Glow */}
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide font-['Outfit'] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          {activeItem.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-300 leading-relaxed font-sans max-w-2xl text-center">
          {activeItem.description}
        </p>
      </motion.div>

      {/* ================= CENTERED SHARP RECTANGULAR NEON PAGINATION ================= */}
      <div className="flex items-center justify-center gap-2 mt-5 z-30">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                : 'w-2.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
        <span className="text-xs font-mono text-gray-400 ml-3">
          0{currentIndex + 1} / 0{total}
        </span>
      </div>

      {/* ================= FULLSCREEN CINEMATIC OVERLAY (METADATA BELOW IMAGE) ================= */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 w-screen h-screen bg-[#030712]/95 backdrop-blur-2xl flex flex-col items-center justify-center py-6 px-4 overflow-y-auto select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-10 left-10 w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-[520px] h-[520px] bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Floating Top-Right Minimal Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="fixed top-6 right-6 z-30 p-3 rounded-full bg-black/50 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-white transition-all cursor-pointer backdrop-blur-md hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              title="Close (Esc)"
              aria-label="Close Overlay"
            >
              <i className="ph ph-x text-xl"></i>
            </button>

            {/* Side Floating Screen-Edge Chevrons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="fixed left-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              aria-label="Previous Project"
            >
              <i className="ph ph-caret-left text-2xl"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="fixed right-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              aria-label="Next Project"
            >
              <i className="ph ph-caret-right text-2xl"></i>
            </button>

            {/* Main Stage & Unboxed Content Container */}
            <div
              className="relative max-w-5xl w-full flex flex-col items-center justify-center my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Central Artwork Canvas */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id || currentIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="relative max-h-[58vh] sm:max-h-[62vh] w-auto flex items-center justify-center overflow-hidden rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-white/10"
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="max-h-[58vh] sm:max-h-[62vh] w-auto max-w-full object-contain rounded-2xl scale-[1.035]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Free-Floating Unboxed Metadata Stack Below Image */}
              <motion.div
                key={`meta-${activeItem.id || currentIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-6 max-w-3xl w-full text-center flex flex-col items-center gap-2 px-4"
              >
                {/* Category Badge (Above Headings) */}
                <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] mt-4">
                  {activeItem.tagline}
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight font-['Outfit'] mt-1">
                  {activeItem.title}
                </h2>

                {/* Description */}
                <p className="text-sm lg:text-base leading-relaxed text-zinc-300 max-w-2xl text-center font-['Inter'] mt-1">
                  {activeItem.description}
                </p>

                {/* Glowing Pill Tags */}
                {activeItem.tags && activeItem.tags.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    {activeItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Slide Counter & Indicators Bar Row */}
                <div className="flex items-center justify-center gap-2 mt-4 z-30">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
                        i === currentIndex
                          ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                          : 'w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                  <span className="text-xs font-mono text-gray-400 ml-3 whitespace-nowrap">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
