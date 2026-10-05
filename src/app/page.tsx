'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkSection from '@/components/WorkSection';
import Navbar from '@/components/Navbar';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

interface SiteContent {
  home: {
    headline: string;
    tagline: string;
    ctaText: string;
    ctaLink: string;
    bgImage?: string;
  };
  about: {
    bio: string;
    experienceYears: string;
    story: string;
    skills: string[];
    bgImage?: string;
  };
  work: {
    sectionTitle: string;
    sectionSubtitle: string;
    bgImage?: string;
  };
  process: {
    sectionTitle: string;
    steps: { number: string; title: string; description: string }[];
    bgImage?: string;
  };
}

const DEFAULT_CONTENT: SiteContent = {
  home: {
    headline: "Timeless Craftsmanship. Next-Gen Velocity",
    tagline: "Good design is more than just making things look good—it's about solving problems. With over 10 years of experience, I create memorable visual identities and digital designs that truly connect with your audience.",
    ctaText: "Explore My Work",
    ctaLink: "#work",
    bgImage: "/images/1stpage-bg.jpg",
  },
  about: {
    bio: "I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don’t just design logos—I build immersive brand ecosystems.",
    experienceYears: "12+",
    story: "My journey began over a decade ago in the high-pressure print houses of Varanasi, mastering CorelDRAW and layout architecture by executing everything from local branding collaterals to rebuilding an entire 66-page magazine under tight deadlines.\n\nAs media transitioned, I channeled that foundational discipline into modern digital storytelling, where my active experience in video editing, live streaming, and content creation sharpened my understanding of audience psychology, visual pacing, and retention. Today, by fusing traditional design mastery (Adobe Premiere Pro, CorelDRAW, Canva, CapCut) with cutting-edge AI workflows (Leonardo.ai, Gemini, ChatGPT, Claude, Kling AI), I deliver premium quality at unmatched speeds—bridging core design fundamentals with next-gen generative technology to engineer high-converting visual solutions that dominate competitive spaces.",
    skills: [
      "Brand Strategy",
      "Logo Design",
      "Vector Architecture",
      "CorelDRAW",
      "Adobe Premiere Pro",
      "Generative AI & LLMs",
      "Motion Graphics",
      "Editorial Layouts",
      "Packaging Design",
      "Canva Pro",
      "CapCut",
    ],
    bgImage: "",
  },
  work: {
    sectionTitle: "Selected Works",
    sectionSubtitle: "10000+ successful projects delivered across tech, gaming, finance, lifestyle & enterprise brands.",
    bgImage: "/uploads/work_bg_1790335357662.jpg",
  },
  process: {
    sectionTitle: "A Proven 4-Step Process",
    steps: [
      {
        number: "01",
        title: "Strategic Discovery & AI ideation",
        description: "Leveraging LLMs and generative AI (Leonardo.ai, Claude) alongside deep brand research to explore broad creative directions and rapid concept benchmarking.",
      },
      {
        number: "02",
        title: "Foundation & Visual Architecture",
        description: "Distilling ideas with core design principles, structural composition, and typography hierarchy to establish a solid, memorable visual identity.",
      },
      {
        number: "03",
        title: "Precision Vectoring & Editing",
        description: "Translating concepts into pixel-perfect vectors and multimedia assets using CorelDRAW, Premiere Pro, and Canva for seamless scalability across print and digital media.",
      },
      {
        number: "04",
        title: "Ecosystem Deployment & Mockups",
        description: "Bringing brand assets to life with photorealistic 3D mockups, campaign-ready formats, and real-world collateral built for high conversion and market impact.",
      },
    ],
    bgImage: "",
  },
};

export default function Home() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let ignore = false;
    async function loadContent() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data) {
            setContent((prev) => ({
              home: { ...prev.home, ...(data.home || {}) },
              about: { ...prev.about, ...(data.about || {}) },
              work: { ...prev.work, ...(data.work || {}) },
              process: { ...prev.process, ...(data.process || {}) },
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
      }
    }
    loadContent();
    return () => {
      ignore = true;
    };
  }, []);

  const floatingTools = [
    { name: 'Premiere Pro', img: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg', className: 'float-1' },
    { name: 'Canva', img: 'https://s2.googleusercontent.com/s2/favicons?domain=canva.com&sz=128', className: 'float-2' },
    { name: 'Gemini', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', className: 'float-3' },
    { name: 'ChatGPT', img: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', className: 'float-4' },
    { name: 'CorelDRAW', img: 'https://s2.googleusercontent.com/s2/favicons?domain=coreldraw.com&sz=128', className: 'float-5' },
    { name: 'CapCut', img: 'https://s2.googleusercontent.com/s2/favicons?domain=capcut.com&sz=128', className: 'float-6' },
    { name: 'Leonardo.ai', img: 'https://s2.googleusercontent.com/s2/favicons?domain=leonardo.ai&sz=128', className: 'float-7' },
    { name: 'Claude', img: 'https://s2.googleusercontent.com/s2/favicons?domain=claude.ai&sz=128', className: 'float-8' },
    { name: 'Kling AI', img: 'https://s2.googleusercontent.com/s2/favicons?domain=klingai.com&sz=128', className: 'float-9' },
    { name: 'Photoshop', img: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg', className: 'float-10' },
  ];

  // Scroll-linked atmospheric depth transforms
  const { scrollYProgress } = useScroll();
  const heroGlowOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5], [0.7, 0.35, 0.1]);
  const workGlowOpacity = useTransform(scrollYProgress, [0.15, 0.5, 0.8], [0.15, 0.6, 0.2]);
  const contactGlowOpacity = useTransform(scrollYProgress, [0.55, 0.85, 1], [0.1, 0.6, 0.8]);

  return (
    <main className="relative min-h-screen text-slate-100 overflow-x-hidden">
      {/* Ambient Lighting Orbs (Non-blocking) */}
      <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden">
        {/* Top/Hero Ambient Glow */}
        <motion.div
          style={{ opacity: heroGlowOpacity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"
        />
        {/* Mid/Work Ambient Glow */}
        <motion.div
          style={{ opacity: workGlowOpacity }}
          className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-fuchsia-500/10 rounded-full blur-[180px] pointer-events-none"
        />
        {/* Bottom/Contact Ambient Glow */}
        <motion.div
          style={{ opacity: contactGlowOpacity }}
          className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"
        />
      </div>

      <Navbar />

      {/* ================= 1. HERO SECTION ================= */}
      <motion.section
        id="home"
        className="hero relative min-h-[92vh] sm:min-h-screen flex items-center overflow-hidden pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 md:px-10 lg:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hero Background Image Layer with Seamless Gradient Overlay */}
        {content.home.bgImage && (
          <div className="absolute inset-0 z-0 w-full h-full min-h-[100dvh] pointer-events-none overflow-hidden">
            <img
              src={content.home.bgImage}
              alt="Hero Background"
              className="w-full h-full min-h-[100dvh] object-cover object-center"
            />
            {/* Seamless gradient overlay — full width, no hard edge or cutoff box */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#030712]/90 via-[#030712]/75 to-[#030712] md:bg-gradient-to-r md:from-[#030712]/95 md:via-[#030712]/80 md:to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#050508] to-transparent" />
          </div>
        )}

        <div
          style={{ minHeight: '665.016px' }}
          className="hero-container relative z-10 w-full max-w-6xl mx-auto px-0 sm:px-2 min-h-[665px]"
        >
          <div className="hero-content max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <p className="hero-subtitle text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 mb-3">
              BRAND STRATEGIST • AI & MULTIMEDIA DESIGNER
            </p>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.12] mb-4 sm:mb-5">
              {content.home.headline.includes('.') ? (
                <>
                  {content.home.headline.split('.')[0]}.{' '}
                  <span className="highlight">
                    {content.home.headline.split('.').slice(1).join('.').trim()}
                  </span>
                </>
              ) : (
                content.home.headline
              )}
            </h1>
            <p className="hero-desc text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-6 sm:mb-8">
              {content.home.tagline}
            </p>
            <div className="hero-actions flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href={content.home.ctaLink || "#work"} className="btn btn-primary justify-center text-center w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5">
                <span>{content.home.ctaText || "Explore My Work"}</span>
                <i className="ph ph-arrow-right text-base"></i>
              </Link>
              <Link href="#contact" className="btn btn-secondary justify-center text-center w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5">
                <span>Let&apos;s Chat</span>
                <i className="ph ph-arrow-right text-base"></i>
              </Link>
            </div>
          </div>

          {/* Interactive Achievements & Stats Grid Linked to 3D Showcase Categories */}
          <motion.div
            className="stats-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-12 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo & Brand Projects */}
            <Link
              href="/showcase/logo"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all p-3.5 sm:p-4 md:p-5"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-crown"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors text-lg sm:text-xl md:text-2xl">100+</h3>
                <p className="text-[10px] sm:text-xs">LOGO & BRAND<br />PROJECTS DELIVERED</p>
              </div>
            </Link>

            {/* High-Converting Banners & Posters */}
            <Link
              href="/showcase/banners"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all p-3.5 sm:p-4 md:p-5"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-image"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors text-lg sm:text-xl md:text-2xl">1,000+</h3>
                <p className="text-[10px] sm:text-xs">HIGH-CONVERTING BANNERS &<br />POSTERS DESIGNED</p>
              </div>
            </Link>

            {/* Full Magazine Layout */}
            <Link
              href="/showcase/magazine"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all p-3.5 sm:p-4 md:p-5"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-book-open"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors text-lg sm:text-xl md:text-2xl">66-PAGE</h3>
                <p className="text-[10px] sm:text-xs">FULL MAGAZINE LAYOUT<br />DELIVERED IN 3 DAYS</p>
              </div>
            </Link>

            {/* AI-Crafted YouTube Thumbnails */}
            <Link
              href="/showcase/youtube"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all p-3.5 sm:p-4 md:p-5"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-youtube-logo"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors text-lg sm:text-xl md:text-2xl">100+</h3>
                <p className="text-[10px] sm:text-xs">AI-CRAFTED YOUTUBE<br />THUMBNAILS & ASSETS</p>
              </div>
            </Link>

            {/* Instagram Brand Campaigns — on small mobile, spans 2 columns for neat symmetry */}
            <Link
              href="/showcase/instagram"
              className="stats-card col-span-2 sm:col-span-1 group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all p-3.5 sm:p-4 md:p-5"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-instagram-logo"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors text-lg sm:text-xl md:text-2xl">100+</h3>
                <p className="text-[10px] sm:text-xs">ENGAGING INSTAGRAM BRAND<br />CAMPAIGN POSTS</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= 2. ABOUT SECTION ================= */}
      <motion.section
        id="about"
        className="about relative overflow-hidden"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Optional Custom About Background Image */}
        {content.about.bgImage && (
          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <img
              src={content.about.bgImage}
              alt="About Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#050508]/60 to-[#050508]" />
          </div>
        )}

        <div className="about-container relative z-10 px-4 py-16 sm:px-8 sm:py-24 md:px-12 w-full">
          <div className="about-content-wrapper">
            {/* Glassmorphic Story Box */}
            <motion.div
              className="about-glass-box relative w-full lg:w-1/2 lg:ml-auto !max-w-none"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(9,9,11,0.7)_0%,_transparent_70%)] -z-10 blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="section-tag drop-shadow-[0_0_20px_rgba(8,145,178,0.6)]">MY STORY</p>
                {content.about.experienceYears && (
                  <span className="inline-flex items-center justify-center gap-2 relative text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase group whitespace-nowrap cursor-default">
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {content.about.experienceYears} Experience
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"></span>
                  </span>
                )}
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Outfit'] drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] leading-tight mb-3">
                Frame by Frame.<br />Pixel by Pixel.
              </h2>
              <div className="divider drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] mb-5"></div>

              <div className="relative mb-4 sm:mb-6">
                {content.about.bio && (
                  <p className="about-text font-semibold text-cyan-200/95 mb-3 text-sm sm:text-base md:text-lg drop-shadow-[0_4px_12px_rgba(0,0,0,1)] leading-relaxed">
                    I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don&apos;t just create visuals — I architect immersive brand ecosystems.
                  </p>
                )}

                {content.about.story.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="about-text drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-xs sm:text-sm md:text-base leading-relaxed text-zinc-300 mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Skills Tags Pills */}
              {content.about.skills && content.about.skills.length > 0 && (
                <div className="pt-5 mt-5 border-t border-transparent relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                  <p className="text-sm sm:text-base md:text-lg font-bold uppercase font-mono tracking-widest text-cyan-400 mb-4 text-center sm:text-left">
                    Core Expertise & Toolchain
                  </p>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center sm:justify-start pb-2">
                    {content.about.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center gap-2 relative text-cyan-400 font-mono text-[11px] sm:text-xs md:text-sm font-bold tracking-wider group whitespace-nowrap cursor-default py-1 px-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20"
                      >
                        <span className="relative z-10 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          {skill}
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Responsive Toolchain Icon Badges for Mobile & Tablet */}
                  <div className="lg:hidden mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3 text-center sm:text-left">
                      Creative Suites & AI Engines:
                    </p>
                    <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3">
                      {floatingTools.map((tool) => (
                        <div
                          key={tool.name}
                          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-cyan-400/50 transition-all text-center"
                        >
                          <img src={tool.img} alt={tool.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                          <span className="text-[9px] sm:text-[10px] font-mono text-zinc-300 font-medium truncate w-full text-center">
                            {tool.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Desktop Floating Tool Badges */}
            <div className="floating-logos hidden lg:block">
              {floatingTools.map((tool) => (
                <div key={tool.name} className={`float-logo ${tool.className}`}>
                  <img src={tool.img} alt={tool.name} />
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= 3. FEATURED WORK / SHOWCASE SECTION ================= */}
      <motion.section
        id="work"
        className="portfolio relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-12 w-full"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Optional Custom Work Background Image */}
        {content.work.bgImage && (
          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <img
              src={content.work.bgImage}
              alt="Work Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#050508]/70 to-[#050508]" />
          </div>
        )}

        <div className="portfolio-header relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="section-tag mb-1">FEATURED WORK</p>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Outfit']">
              {content.work.sectionTitle || 'Showcase'}
            </h2>
          </div>
          <Link href="/showcase/logo" className="btn btn-secondary w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 min-h-[48px]">
            <span>Explore 3D Showcase</span>
            <i className="ph ph-arrow-right text-base"></i>
          </Link>
        </div>

        <div className="relative z-10 w-full">
          <WorkSection />
        </div>

        <div className="portfolio-footer relative z-10 flex items-center justify-center gap-2 mt-8 text-cyan-400 text-xs sm:text-sm text-center">
          <i className="ph-fill ph-star-four"></i>
          <p className="text-zinc-400">{content.work.sectionSubtitle || '10000+ successful projects across tech, gaming, finance, lifestyle & more.'}</p>
        </div>
      </motion.section>

      {/* ================= 4. PROCESS SECTION ================= */}
      <motion.section
        id="process"
        className="process relative overflow-hidden max-w-6xl mx-4 sm:mx-6 md:mx-8 xl:mx-auto my-12 sm:my-16 p-6 sm:p-10 md:p-14 lg:p-16 rounded-3xl"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(9,9,11,0.7)_0%,_transparent_70%)] -z-10 blur-2xl pointer-events-none"></div>
        {/* Optional Custom Process Background Image */}
        {content.process.bgImage && (
          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <img
              src={content.process.bgImage}
              alt="Process Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/75 to-zinc-950" />
          </div>
        )}

        <div className="relative z-10 w-full">
          <p className="section-tag drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] mb-2">MY PROCESS</p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Outfit'] drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] mb-8 sm:mb-12">
            {content.process.sectionTitle || 'A Proven 4-Step Process'}
          </h2>

          {/* Timeline: Mobile Stack, Tablet 2x2 Grid, Desktop 4-Column Row */}
          <div className="timeline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-6 relative text-left">
            <div className="timeline-line hidden lg:block absolute top-8 left-8 right-8 h-[2px] z-0"></div>

            {content.process.steps.map((step, idx) => {
              const icons = ['ph-lightbulb', 'ph-pencil-simple', 'ph-bezier-curve', 'ph-cube', 'ph-rocket'];
              const iconClass = icons[idx % icons.length];
              return (
                <div key={idx} className="timeline-step flex flex-col items-center text-center w-full relative z-10 group p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all">
                  <div className="step-icon mb-3">
                    <i className={`ph ${iconClass}`}></i>
                  </div>
                  <div className="step-badge mb-2">{step.number || `0${idx + 1}`}</div>
                  <h3 className="step-title drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-base sm:text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-xs sm:text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ================= 5. CONTACT & FOOTER SECTION ================= */}
      <section
        id="contact"
        className="relative w-full overflow-hidden flex flex-col justify-between items-center pt-10 sm:pt-16 md:pt-20 pb-0"
      >
        {/* Full-Bleed Mobile Contact Background Layer (Mobile Only: block md:hidden) */}
        <div className="block md:hidden absolute inset-0 z-0 w-full h-full min-h-[100dvh] pointer-events-none overflow-hidden">
          <img
            src="/images/contact-bg.jpg"
            alt="Contact Background Mobile"
            className="w-full h-full object-cover object-center bg-cover bg-center bg-no-repeat"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/65 to-[#050508]/90" />
        </div>

        {/* Contact Card Wrapper - Dead-Centered Above Footer with Explicit Safety Clearance */}
        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-auto py-10 md:py-16 pb-16 sm:pb-20 md:pb-24">
          <ContactSection />
        </div>

        {/* Global Footer Bar (Pinned at bottom of Contact Section) */}
        <Footer />
      </section>

      {/* Script for Phosphor Icons */}
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
    </main>
  );
}