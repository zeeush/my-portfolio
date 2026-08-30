import ShowcaseCarousel from '@/components/ShowcaseCarousel';
import Navbar from '@/components/Navbar';
import fs from 'fs';
import path from 'path';

export default async function ShowcasePage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;

  // Map potential alias slugs to primary categories
  const categoryAliases: Record<string, string> = {
    'logo-branding': 'logo',
    'banners-posters': 'banners',
    'editorial-magazines': 'magazine',
    'youtube-assets': 'youtube',
    'social-campaigns': 'instagram',
  };

  const category = categoryAliases[rawCategory] || rawCategory;

  // Uniform Primary Cave Backdrop across all showcase views
  const bgImage = '/assets/hero_cave.jpg';

  // Automatically load images from public/portfolio-assets/[category]
  const directoryPath = path.join(process.cwd(), 'public', 'portfolio-assets', category);
  let images: string[] = [];
  try {
    const files = fs.readdirSync(directoryPath);
    images = files
      .filter((f) => f.match(/\.(jpg|jpeg|png|webp)$/i))
      .map((f) => `/portfolio-assets/${category}/${f}`);
  } catch {
    console.log('No directory or files for', category);
  }

  const categoryTitles: Record<string, string> = {
    logo: 'Logo & Brand Identity',
    banners: 'High-Converting Banners & Posters',
    magazine: 'Full Magazine Layout',
    youtube: 'AI-Crafted YouTube Thumbnails',
    instagram: 'Instagram Brand Campaigns',
    creator: 'Content Creation & Media',
  };

  const title = categoryTitles[category] || 'Featured Portfolio';

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050508] text-white flex flex-col justify-between">
      {/* Uniform Primary Cave Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Top Tier: Fixed Sleek Navigation Bar */}
      <Navbar />

      {/* Main Center Stack Area (Vertical Centering with pt-28) */}
      <div className="relative z-10 w-full min-h-screen pt-28 pb-16 flex flex-col justify-center items-center">
        
        {/* Middle Tier: Active Folder Title & Category Header */}
        <div className="w-full max-w-5xl mx-auto px-6 mb-8 flex flex-col items-center justify-center text-center gap-2.5 relative">
          <span className="text-sm sm:text-base font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold block text-center drop-shadow-[0_0_10px_rgba(0,229,255,0.85)]">
            PORTFOLIO SHOWCASE
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-wide text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {title}
          </h2>
        </div>

        {/* Center Tier: Work Showcase Container (Squarely in Center) */}
        <ShowcaseCarousel category={category} images={images} />
      </div>
    </main>
  );
}
