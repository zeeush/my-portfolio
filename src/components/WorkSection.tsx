'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Grid3x3,
  FolderOpen,
  Eye,
  ArrowRight,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import initialPortfolio from '@/data/portfolio.json';

interface Project {
  id: string;
  title: string;
  year: string;
  shortDesc: string;
  type: string;
  image: string;
}

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  projects: Project[];
}

interface EnhancedProject extends Project {
  categoryId: string;
  categorySlug: string;
  categoryTitle: string;
}

interface FilterTab {
  id: string;
  label: string;
  shortLabel: string;
}

const FILTER_TABS: FilterTab[] = [
  { id: 'all', label: 'All Works', shortLabel: 'All' },
  { id: 'logo', label: 'Logo & Brand', shortLabel: 'Logo' },
  { id: 'social', label: 'Social Media', shortLabel: 'Social' },
  { id: 'web', label: 'Web & Digital', shortLabel: 'Web' },
  { id: 'banners', label: 'Banners & Ads', shortLabel: 'Banners' },
  { id: 'magazine', label: 'Editorial & Print', shortLabel: 'Print' },
  { id: 'media', label: '3D & Media', shortLabel: '3D / Media' },
];

export default function WorkSection() {
  const [categories, setCategories] = useState<Category[]>(initialPortfolio as Category[]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  // Default view is always Folders first as requested
  const [viewMode, setViewMode] = useState<'folders' | 'projects'>('folders');

  // Category horizontal scroll tracking for sleek designed progress bar
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
    } else {
      const progress = Math.min(Math.max(el.scrollLeft / maxScroll, 0), 1);
      setScrollProgress(progress);
      setCanScrollLeft(el.scrollLeft > 6);
      setCanScrollRight(el.scrollLeft < maxScroll - 6);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Initial check
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      }
    }
    loadCategories();
  }, []);

  // Flatten all projects with category metadata
  const allProjects = useMemo<EnhancedProject[]>(() => {
    const list: EnhancedProject[] = [];
    categories.forEach((cat) => {
      (cat.projects || []).forEach((proj) => {
        list.push({
          ...proj,
          categoryId: cat.id,
          categorySlug: cat.slug,
          categoryTitle: cat.title,
        });
      });
    });
    return list;
  }, [categories]);

  // Matcher for category filter
  const matchesFilter = useCallback((project: EnhancedProject, filterId: string): boolean => {
    if (filterId === 'all') return true;

    const type = (project.type || '').toLowerCase();
    const cat = (project.categoryId || '').toLowerCase();

    switch (filterId) {
      case 'logo':
        return (
          cat === 'logo' ||
          type.includes('identity') ||
          type.includes('packaging') ||
          type.includes('crest') ||
          type.includes('branding')
        );
      case 'social':
        return (
          cat === 'instagram' ||
          cat === 'youtube' ||
          type.includes('social') ||
          type.includes('carousel') ||
          type.includes('stories') ||
          type.includes('mascot') ||
          type.includes('hook') ||
          type.includes('channel')
        );
      case 'web':
        return (
          type.includes('tech') ||
          type.includes('enterprise') ||
          type.includes('infrastructure') ||
          type.includes('digital') ||
          type.includes('stream') ||
          type.includes('overlay') ||
          type.includes('infographic') ||
          project.id.includes('kaara') ||
          project.id.includes('abhisaar') ||
          project.id === 'banners-2'
        );
      case 'banners':
        return (
          cat === 'banners' ||
          type.includes('ad') ||
          type.includes('billboard') ||
          type.includes('poster') ||
          type.includes('key visual') ||
          type.includes('motion')
        );
      case 'magazine':
        return (
          cat === 'magazine' ||
          type.includes('editorial') ||
          type.includes('publication') ||
          type.includes('print') ||
          type.includes('spread')
        );
      case 'media':
        return (
          cat === 'creator' ||
          cat === 'youtube' ||
          type.includes('thumbnail') ||
          type.includes('3d') ||
          type.includes('stream') ||
          type.includes('broadcast') ||
          type.includes('alert')
        );
      default:
        return true;
    }
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => matchesFilter(p, activeFilter));
  }, [allProjects, activeFilter, matchesFilter]);

  // Filtered categories for Folders view
  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories.filter((cat) => {
      if (activeFilter === 'logo') return cat.id === 'logo';
      if (activeFilter === 'banners') return cat.id === 'banners';
      if (activeFilter === 'magazine') return cat.id === 'magazine';
      if (activeFilter === 'social') return cat.id === 'instagram' || cat.id === 'youtube';
      if (activeFilter === 'web') return cat.id === 'creator' || cat.id === 'logo' || cat.id === 'banners';
      if (activeFilter === 'media') return cat.id === 'youtube' || cat.id === 'creator';
      return true;
    });
  }, [categories, activeFilter]);

  // Category icons mapping for Folders
  const categoryIcons: Record<string, string> = {
    logo: 'ph-crown',
    banners: 'ph-image',
    magazine: 'ph-book-open',
    youtube: 'ph-youtube-logo',
    instagram: 'ph-instagram-logo',
    creator: 'ph-broadcast',
  };

  const activeTabInfo = FILTER_TABS.find((t) => t.id === activeFilter) || FILTER_TABS[0];

  // Framer Motion Staggered Entrance Variants for Showcase Grid
  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const projectItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const, // Premium spring-like ease curve
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.18,
      },
    },
  };

  // Subtle premium reveal animation for artwork images
  const imageRevealVariants: Variants = {
    hidden: {
      scale: 1.1,
      opacity: 0.75,
      filter: 'blur(3px)',
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  // Staggered variants for Folders grid view
  const folderContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const folderItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 22,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.18,
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================= CONTROLLER: BOXLESS VIEW SELECTOR (FOLDERS & PROJECTS) + ACTIVE FILTER ================= */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
        {/* Boxless, Pure Minimal Typography Switcher for Folders & Projects */}
        <div className="flex items-center gap-5 sm:gap-8 py-1 select-none">
          {/* Folders Option */}
          <button
            type="button"
            onClick={() => setViewMode('folders')}
            className={`group relative flex items-center gap-2 sm:gap-2.5 py-1.5 cursor-pointer transition-all duration-300 focus:outline-none ${
              viewMode === 'folders'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FolderOpen
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                viewMode === 'folders'
                  ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] scale-110'
                  : 'text-zinc-500 group-hover:text-zinc-400 group-hover:scale-105'
              }`}
            />
            <span
              className={`font-['Outfit'] text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase transition-all duration-300 ${
                viewMode === 'folders'
                  ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-500 group-hover:text-zinc-300 font-semibold'
              }`}
            >
              Folders
            </span>

            {/* Glowing Active Underline (No box, pure sleek indicator) */}
            {viewMode === 'folders' && (
              <motion.div
                layoutId="boxlessViewModeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full shadow-[0_0_12px_#00e5ff]"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              />
            )}
          </button>

          {/* Minimal Elegant Divider */}
          <span className="text-zinc-700/80 font-mono text-sm sm:text-base select-none">/</span>

          {/* Projects Option */}
          <button
            type="button"
            onClick={() => setViewMode('projects')}
            className={`group relative flex items-center gap-2 sm:gap-2.5 py-1.5 cursor-pointer transition-all duration-300 focus:outline-none ${
              viewMode === 'projects'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid3x3
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                viewMode === 'projects'
                  ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] scale-110'
                  : 'text-zinc-500 group-hover:text-zinc-400 group-hover:scale-105'
              }`}
            />
            <span
              className={`font-['Outfit'] text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase transition-all duration-300 ${
                viewMode === 'projects'
                  ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-500 group-hover:text-zinc-300 font-semibold'
              }`}
            >
              Projects
            </span>

            {/* Glowing Active Underline (No box, pure sleek indicator) */}
            {viewMode === 'projects' && (
              <motion.div
                layoutId="boxlessViewModeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full shadow-[0_0_12px_#00e5ff]"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              />
            )}
          </button>
        </div>

        {/* Filtered Corner Indicator Pill */}
        {activeFilter !== 'all' && (
          <div className="inline-flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-full shadow-sm self-end sm:self-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
            <span className="text-zinc-400 font-mono text-[11px]">Filtered:</span>
            <span className="font-semibold text-cyan-300 text-xs">{activeTabInfo.label}</span>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-zinc-400 hover:text-white transition-colors ml-1 p-0.5 rounded-full hover:bg-white/10"
              title="Reset filter to All Works"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= CATEGORY NAVIGATION SHELF WITH SLEEK DESIGN SLIDE BAR ================= */}
      {/* Native browser scrollbar hidden; replaced by ultra-sleek custom cyber indicator */}
      <div className="relative w-full flex flex-col gap-1.5 pb-2 border-b border-zinc-800/40">
        {/* Scroll Container with Edge Fades & Nudge Buttons */}
        <div className="relative w-full group/nav">
          {/* Subtle Left Fade Edge Mask */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-[#050508] to-transparent transition-opacity" />
          )}

          {/* Left Arrow Nudge (visible on touch & hover) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-zinc-900/95 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-lg hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Category Filter Text Links (no native scrollbar) */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 md:gap-7 overflow-x-auto no-scrollbar py-2 w-full scroll-smooth select-none px-1"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative shrink-0 text-sm sm:text-[15px] transition-colors duration-200 cursor-pointer py-1.5 focus:outline-none whitespace-nowrap ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                  {/* Subtle hairline glowing underline */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCleanIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 shadow-[0_0_8px_#00e5ff]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Nudge */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-zinc-900/95 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-lg hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Subtle Right Fade Edge Mask */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-[#050508] to-transparent transition-opacity" />
          )}
        </div>

        {/* Designed Ultra-Sleek Slide Bar (Kam ho jaye aur design lage) */}
        <div className="relative w-full h-[2.5px] bg-white/5 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 rounded-full shadow-[0_0_10px_#00e5ff] transition-all duration-150"
            style={{
              width: '24%',
              marginLeft: `${scrollProgress * 76}%`,
            }}
          />
        </div>
      </div>

      {/* ================= CONTENT VIEW: FOLDERS (DEFAULT) OR PROJECTS ================= */}
      {viewMode === 'folders' ? (
        /* FOLDERS VIEW (Default: Curated 3D Folders) */
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={folderContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full"
          >
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={folderItemVariants}
              >
                <Link
                  href={`/showcase/${cat.slug}`}
                  className="portfolio-folder group !p-5 sm:!p-7 !min-h-[250px] sm:!min-h-[280px]"
                >
                  {/* Cover Preview Graphic Overlay with Smooth Scale Reveal */}
                  <div
                    className="folder-preview-overlay transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${cat.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  {/* Folder Tab Header & Icon */}
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="folder-icon bg-zinc-950/80 backdrop-blur-md">
                      <i className={`ph ${categoryIcons[cat.id] || 'ph-folder'}`}></i>
                    </div>
                  </div>

                  {/* Folder Content & Impactful Title */}
                  <div className="folder-content bg-transparent pt-8 sm:pt-12">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-snug font-['Outfit']">
                      {cat.title}
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-sm mb-3 sm:mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <div className="folder-action-pill drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] py-1.5 px-3.5 sm:py-2 sm:px-4 text-xs">
                        <span>Explore 3D Room</span>
                        <i className="ph ph-arrow-right text-xs"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* PROJECTS VIEW (Individual Projects Showcase Grid) */
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={projectItemVariants}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#131625] via-[#0d101a] to-[#080910] border border-cyan-500/20 hover:border-cyan-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(0,229,255,0.2)] transition-colors duration-300 hover:-translate-y-1.5"
              >
                <Link
                  href={`/showcase/${project.categorySlug}`}
                  className="flex flex-col w-full h-full"
                >
                  {/* Image Showcase Container with Smooth Staggered Reveal */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/70">
                    <motion.div
                      variants={imageRevealVariants}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    {/* Subtle Top & Bottom Gradient Shade for Overlay Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

                    {/* Soft Non-Intrusive Overlaid Badges: Folder Name (Left) & Year (Right) */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium tracking-wide bg-black/55 backdrop-blur-md text-zinc-300 border border-white/10 shadow-sm flex items-center gap-1.5">
                        <Layers className="w-2.5 h-2.5 text-cyan-400/80" />
                        <span>{project.categoryTitle}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-zinc-400 bg-black/55 backdrop-blur-md border border-white/10">
                        {project.year}
                      </span>
                    </div>

                    {/* Hover Quick View Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-zinc-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.6)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Explore Showcase</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimal Text Section: Project Name Only as Requested */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-['Outfit'] truncate">
                      {project.title}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 flex items-center justify-center shrink-0 transition-all">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
