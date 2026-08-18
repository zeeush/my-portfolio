'use client';

import Link from 'next/link';

export default function WorkSection() {
  const categories = [
    {
      id: 'logo',
      title: 'Logo & Brand Identity',
      subtitle: 'Vector Systems & Visual Identities',
      preview: '/assets/logo_1.jpg',
      icon: 'ph-crown',
      accent: 'cyan',
    },
    {
      id: 'banners',
      title: 'High-Converting Banners & Posters',
      subtitle: 'High-Impact Performance Ad Creatives',
      preview: '/assets/designer_desk.jpg',
      icon: 'ph-image',
      accent: 'purple',
    },
    {
      id: 'magazine',
      title: 'Full Magazine Layout',
      subtitle: 'Editorial Typography & Multi-Page Layouts',
      preview: '/assets/hero_z_logo.jpg',
      icon: 'ph-book-open',
      accent: 'cyan',
    },
    {
      id: 'youtube',
      title: 'AI-Crafted YouTube Thumbnails',
      subtitle: 'CTR-Optimized Visual Gaming Graphics',
      preview: '/assets/hero_bg_new.png',
      icon: 'ph-youtube-logo',
      accent: 'purple',
    },
    {
      id: 'instagram',
      title: 'Instagram Brand Campaigns',
      subtitle: 'Viral Social Media Kits & Carousels',
      preview: '/assets/story_designer.png',
      icon: 'ph-instagram-logo',
      accent: 'cyan',
    },
    {
      id: 'creator',
      title: 'Content Creation & Media',
      subtitle: 'Immersive 3D & Live Streaming Assets',
      preview: '/assets/hero_landscape_z.jpg',
      icon: 'ph-broadcast',
      accent: 'purple',
    },
  ];

  return (
    <div className="portfolio-grid">
      {categories.map((cat) => (
        <Link
          href={`/showcase/${cat.id}`}
          key={cat.id}
          className="portfolio-folder group"
        >
          {/* Cover Preview Graphic Overlay */}
          <div
            className="folder-preview-overlay"
            style={{
              backgroundImage: `url(${cat.preview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Folder Tab Header & Icon (Clean without Portfolio label) */}
          <div className="flex items-center justify-between w-full relative z-10">
            <div className="folder-icon">
              <i className={`ph ${cat.icon}`}></i>
            </div>
          </div>

          {/* Folder Content & Impactful Title */}
          <div className="folder-content">
            <h3>{cat.title}</h3>
            <p>{cat.subtitle}</p>

            <div className="folder-action-pill">
              <span>Explore 3D Showcase</span>
              <i className="ph ph-arrow-right text-xs"></i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
