'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem, projectsData } from '@/data/projects';

interface ShowcaseCarouselProps {
  category: string;
  images?: string[];
}

export default function ShowcaseCarousel({ category }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [dynamicItems, setDynamicItems] = useState<ProjectItem[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadDynamicProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const allProjects = await res.json();
          interface RawProject {
            id: string;
            category?: string;
            folderSlug?: string;
            year?: string;
            categoryName?: string;
            tagline?: string;
            title: string;
            description: string;
            tags?: string[];
            imageUrl: string;
          }
          const categoryProjects = allProjects.filter(
            (p: RawProject) => p.category === category || p.folderSlug === category
          );
          if (categoryProjects.length > 0) {
            const mapped: ProjectItem[] = categoryProjects
              .sort((a: RawProject, b: RawProject) => parseInt(b.year || '0') - parseInt(a.year || '0'))
              .map((p: RawProject) => ({
                id: p.id,
                tagline: p.tagline || `${p.year || '2025'} // ${(p.categoryName || category).toUpperCase()}`,
                title: p.title,
                description: p.description,
                tags: p.tags && p.tags.length > 0 ? p.tags : ['#Portfolio', '#Design'],
                imageUrl: p.imageUrl,
              }));
            setDynamicItems(mapped);
          }
        }
      } catch (e) {
        console.error('Failed to load dynamic projects:', e);
      }
    }
    loadDynamicProjects();
  }, [category]);

  const items: ProjectItem[] = dynamicItems.length > 0 ? dynamicItems : (projectsData[category] || projectsData.logo || []);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (items.length || 1));
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (items.length || 1)) % (items.length || 1));
  }, [items.length]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

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

  // Touch / Swipe Navigation Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStart(null);
  };

  // Back Navigation Handler
  const handleBackNavigation = () => {
    if (isLightboxOpen) {
      setIsLightboxOpen(false);
    } else {
      router.push('/#work');
    }
  };

  const activeItem = items[currentIndex] || items[0] || {
    id: 'placeholder',
    tagline: 'PORTFOLIO // SHOWCASE',
    title: 'Showcase Project',
    description: 'No projects available.',
    tags: ['#Portfolio'],
    imageUrl: '/assets/hero_cave.jpg',
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 select-none relative">
      
      {/* ================= STICKY BACK NAVIGATION BUTTON ================= */}
      <button
        onClick={handleBackNavigation}
        className="fixed top-20 left-4 sm:left-8 z-40 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/85 hover:bg-cyan-950/50 border border-white/15 hover:border-cyan-400/80 text-cyan-400 hover:text-white backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-200 font-mono text-xs uppercase tracking-widest cursor-pointer group"
        aria-label="Back to Work"
      >
        <i className="ph ph-arrow-left text-sm group-hover:-translate-x-1 transition-transform"></i>
        <span>Back to Work</span>
      </button>

      {/* ================= 3D COVERFLOW STAGE CONTAINER ================= */}
      <div
        className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] flex items-center justify-center [perspective:1400px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Ambient Neon Stage Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] bg-gradient-to-r from-cyan-500/20 via-purple-600/15 to-pink-500/20 blur-3xl -z-10 pointer-events-none"></div>

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
                className={`group absolute w-[740px] max-w-[85vw] aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-300 ${
                  isCenter
                    ? 'border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.25),0_20px_50px_rgba(0,0,0,0.9)] bg-black'
                    : 'border border-white/10 bg-black/90 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Thumbnail Image with Tactile 1.03x Scale on Hover */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  {/* 1. Subtle 40% Black Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                  {/* 1. Centered Magnifying-Glass Icon & 'Click to Expand' Fade-In on Hover */}
                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(0,229,255,0.5)] backdrop-blur-sm">
                        <i className="ph ph-magnifying-glass-plus text-base text-cyan-400"></i>
                        <span>Click to Expand</span>
                      </div>
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

        {/* 2. Previous Navigation Arrow Button (Circular, Dark Semi-Transparent, Hover Scale) */}
        <button
          onClick={prevSlide}
          aria-label="Previous image"
          className="absolute -left-3 sm:-left-6 md:-left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(0,229,255,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40"
        >
          <i className="ph ph-caret-left-bold text-xl sm:text-2xl"></i>
        </button>

        {/* 2. Next Navigation Arrow Button (Circular, Dark Semi-Transparent, Hover Scale) */}
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute -right-3 sm:-right-6 md:-right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(0,229,255,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40"
        >
          <i className="ph ph-caret-right-bold text-xl sm:text-2xl"></i>
        </button>

      </div>

      {/* ================= FREE-FLOATING PROJECT METADATA ================= */}
      <motion.div
        key={activeItem.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto mt-8 px-4 flex flex-col items-center text-center gap-2.5 relative z-30"
      >
        {/* Top Row: Tagline & Category Tags */}
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

        {/* Project Title */}
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide font-['Outfit'] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          {activeItem.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-300 leading-relaxed font-sans max-w-2xl text-center">
          {activeItem.description}
        </p>
      </motion.div>

      {/* ================= 3. IMAGE / PROJECT COUNTER & PAGINATION ================= */}
      <div className="flex items-center justify-center gap-3 mt-6 z-30">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                  : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        {/* Unambiguous Counter: Image X of Y */}
        <span className="text-xs font-mono text-zinc-400 tracking-wider ml-2">
          Image {currentIndex + 1} of {total}
        </span>
      </div>

      {/* ================= 4. FULL-SCREEN EXPAND (LIGHTBOX) VIEW ================= */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 w-screen h-screen bg-black/80 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Ambient Lighting Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* 4. Fixed Top-Right Close Button ('✕') */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
              className="fixed top-6 right-6 z-50 w-11 h-11 rounded-full bg-black/70 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Close (Esc)"
            >
              <i className="ph ph-x text-2xl font-bold"></i>
            </button>

            {/* 4. Circular Navigation Arrows (Left / Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous image"
              className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <i className="ph ph-caret-left-bold text-2xl"></i>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next image"
              className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <i className="ph ph-caret-right-bold text-2xl"></i>
            </button>

            {/* 4. Main Stage Artwork (Scaled to fit viewport without cropping) */}
            <div
              className="relative flex-1 w-full flex items-center justify-center my-auto min-h-0 pt-8 sm:pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id || currentIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex items-center justify-center max-h-[66vh] sm:max-h-[70vh] w-auto max-w-[90vw]"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    className="max-h-[66vh] sm:max-h-[70vh] w-auto max-w-[90vw] object-contain rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-white/10"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 4. Horizontal Thumbnail Strip & Metadata Bar Below Main Image */}
            <div
              className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 z-40 pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Project Title & Unambiguous Image Counter */}
              <div className="text-center px-4">
                <h4 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] tracking-wide">
                  {activeItem.title}
                </h4>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  Image {currentIndex + 1} of {total}
                </p>
              </div>

              {/* Horizontal Thumbnail Jump Strip */}
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2 px-4 max-w-full scrollbar-none">
                {items.map((it, idx) => (
                  <button
                    key={it.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-200 ${
                      idx === currentIndex
                        ? 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.7)] opacity-100 scale-105'
                        : 'border border-white/20 opacity-50 hover:opacity-90 hover:scale-100'
                    }`}
                    aria-label={`Jump to image ${idx + 1}`}
                  >
                    <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
