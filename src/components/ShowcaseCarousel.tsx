'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProjectItem, projectsData } from '@/data/projects';

interface ShowcaseCarouselProps {
  category: string;
  images?: string[];
}

export default function ShowcaseCarousel({ category }: ShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

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
    router.push('/#work');
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

      {/* ================= 5. ENLARGED STICKY BACK NAVIGATION BUTTON ================= */}
      <button
        onClick={handleBackNavigation}
        className="fixed top-16 sm:top-20 left-3 sm:left-6 md:left-8 z-40 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-zinc-950/85 hover:bg-cyan-950/60 border border-white/20 hover:border-cyan-400/80 text-cyan-300 hover:text-white backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold cursor-pointer group"
        aria-label="Back to Work"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-white group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Work</span>
      </button>

      {/* ================= 3D COVERFLOW STAGE CONTAINER ================= */}
      <div
        className="relative w-full h-[260px] xs:h-[300px] sm:h-[400px] md:h-[460px] lg:h-[500px] flex items-center justify-center [perspective:1400px]"
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
                  if (!isCenter) {
                    setCurrentIndex(index);
                  }
                }}
                className={`group absolute w-[740px] max-w-[85vw] aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-300 ${isCenter
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

                  {/* Side Card Glass Darkening Overlay */}
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Previous Navigation Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous image"
          className="absolute left-1 sm:-left-4 md:-left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40 group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Navigation Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute right-1 sm:-right-4 md:-right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40 group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* ================= PROJECT DETAILS (CLEAN DIRECT PAGE BACKGROUND - NO BOX) ================= */}
      <motion.div
        key={activeItem.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-2 sm:gap-3 mt-4 sm:mt-6 relative z-30 px-3 sm:px-4"
      >
        {/* 1. Project Title (Header): Clear and prominent */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide font-['Outfit',sans-serif]">
          {activeItem.title}
        </h3>

        {/* 2. Category / Sub-header: Right below the title in slightly muted tone */}
        <p className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-widest font-mono">
          {activeItem.tagline}
        </p>

        {/* 3. Project Details / Description: High readability with clean line spacing */}
        <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 max-w-2xl mx-auto font-['Inter',sans-serif]">
          {activeItem.description}
        </p>

        {/* 4. Hashtags Formatting */}
        {activeItem.tags && activeItem.tags.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
            {activeItem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] sm:text-xs font-semibold tracking-wide hover:border-cyan-400 hover:text-white transition-all shadow-sm"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ================= 3. IMAGE / PROJECT COUNTER & PAGINATION ================= */}
      <div className="flex items-center justify-center gap-3 mt-6 z-30">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex
                  ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.9)]'
                  : 'w-2 bg-white/20 hover:bg-white/50'
                }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        {/* Unambiguous Counter: Image X of Y */}
        <span className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wider ml-2">
          Image {currentIndex + 1} of {total}
        </span>
      </div>
    </div>
  );
}
