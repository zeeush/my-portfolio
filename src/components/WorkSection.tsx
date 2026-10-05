'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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

export default function WorkSection() {
  const [categories, setCategories] = useState<Category[]>(initialPortfolio as Category[]);

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

  // Fallback icons mapped by id (or we could add icon to the schema)
  const icons: Record<string, string> = {
    logo: 'ph-crown',
    banners: 'ph-image',
    magazine: 'ph-book-open',
    youtube: 'ph-youtube-logo',
    instagram: 'ph-instagram-logo',
    creator: 'ph-broadcast',
  };

  return (
    <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {categories.map((cat) => (
        <Link
          href={`/showcase/${cat.slug}`}
          key={cat.id}
          className="portfolio-folder group !p-5 sm:!p-7 !min-h-[250px] sm:!min-h-[280px]"
        >
          {/* Cover Preview Graphic Overlay */}
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
              <i className={`ph ${icons[cat.id] || 'ph-folder'}`}></i>
            </div>
          </div>

          {/* Folder Content & Impactful Title */}
          <div className="folder-content bg-transparent pt-8 sm:pt-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-snug">
              {cat.title}
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm mb-3 sm:mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] line-clamp-2">
              {cat.description}
            </p>

            <div className="folder-action-pill drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] py-1.5 px-3.5 sm:py-2 sm:px-4 text-xs">
              <span>View Projects ({cat.projects?.length || 0})</span>
              <i className="ph ph-arrow-right text-xs"></i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
