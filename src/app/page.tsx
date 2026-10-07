'use client';

import { useState, useEffect, useRef } from 'react';
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
    bio: "I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don't just design logos — I build immersive brand ecosystems.",
    experienceYears: "12+",
    story: "My journey began over a decade ago in the high-pressure print houses of Varanasi, mastering CorelDRAW and layout architecture by executing everything from local branding collaterals to rebuilding an entire 66-page magazine under tight deadlines.\n\nAs media transitioned, I channeled that foundational discipline into modern digital storytelling, where my active experience in video editing, live streaming, and content creation sharpened my understanding of audience psychology, visual pacing, and retention. Today, by fusing traditional design mastery (Adobe Premiere Pro, CorelDRAW, Canva, CapCut) with cutting-edge AI workflows (Leonardo.ai, Gemini, ChatGPT, Claude, Kling AI), I deliver premium quality at unmatched speeds — bridging core design fundamentals with next-gen generative technology to engineer high-converting visual solutions that dominate competitive spaces.",
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

  // Dedicated scroll progress & exit transforms for About section
  const aboutSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start end", "end start"],
  });
  const aboutBgParallaxY = useTransform(aboutScrollProgress, [0, 1], [-30, 30]);
  const aboutExitOpacity = useTransform(aboutScrollProgress, [0.1, 0.22, 0.78, 0.96], [0.25, 1, 1, 0.15]);
  const aboutExitY = useTransform(aboutScrollProgress, [0.75, 1], [0, -50]);

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
        className="hero relative min-h-[100dvh] flex flex-col justify-start md:justify-center overflow-hidden pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-6 md:px-10 lg:px-12 scroll-mt-24"
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
          className="hero-container relative z-10 w-full max-w-6xl mx-auto px-0 sm:px-2 pt-4 sm:pt-6 md:pt-0"
        >
          <div className="hero-content max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <p className="hero-subtitle text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 mb-3 pt-2 sm:pt-1">
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
        ref={aboutSectionRef}
        id="about"
        style={{ opacity: aboutExitOpacity, y: aboutExitY }}
        className="about relative overflow-hidden w-full my-16 sm:my-24 md:my-32 scroll-mt-24 sm:scroll-mt-28"
      >
        <div
          className="about-container relative z-10 w-full min-h-[850px] lg:min-h-screen py-16 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 flex items-center overflow-hidden"
        >
          {/* 1. Cinematic Background Image (Room & Designer at computer) - Enters FIRST */}
          <motion.div
            className="about-bg-media absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
            initial={{ opacity: 0, scale: 1.15, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={content.about.bgImage || "/assets/story_designer.png"}
              alt="Designer Studio Workspace"
              style={{ y: aboutBgParallaxY }}
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-transparent to-[#050508]/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/15 via-transparent to-[#050508]/25 pointer-events-none" />
          </motion.div>

          <div className="about-content-wrapper w-full flex flex-col items-center lg:items-end relative z-10">
            {/* 2. Glassmorphic Story Box (Right Positioned with Exact User Sizing: 700px w x 800px h, mr: 79px) */}
            <motion.div
              className="about-glass-box relative w-full max-w-xl md:max-w-2xl lg:max-w-[700px] lg:w-[700px] lg:h-[800px] lg:ml-auto lg:mr-[79px] z-10"
              initial={{ opacity: 0, x: 45, y: 15, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.04)_0%,_transparent_70%)] -z-10 blur-xl pointer-events-none"></div>

              {/* Tag & Experience */}
              <motion.div
                className="flex items-center justify-between mb-2"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: 0.44 }}
              >
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
              </motion.div>

              {/* Title */}
              <motion.h2
                className="section-title text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Outfit'] drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] leading-tight mb-3"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.52 }}
              >
                Frame by Frame.<br />Pixel by Pixel.
              </motion.h2>

              {/* Divider */}
              <motion.div
                className="divider drop-shadow-[0_0_20px_rgba(8,145,178,0.6)] mb-4"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.58 }}
              />

              {/* Story Narrative Text with Light Frosted Blur Box */}
              <motion.div
                className="relative mb-4 sm:mb-5 p-4 sm:p-5 rounded-2xl bg-black/15 border border-white/[0.08] backdrop-blur-[4px] space-y-3 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.64 }}
              >
                {content.about.bio && (
                  <p className="about-text font-semibold text-cyan-200 text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] !mb-0">
                    {content.about.bio}
                  </p>
                )}

                {content.about.story.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="about-text text-xs sm:text-sm md:text-base leading-relaxed text-zinc-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] last:mb-0 !mb-0">
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* Floating Capabilities & Toolchain */}
              {content.about.skills && content.about.skills.length > 0 && (
                <motion.div
                  className="pt-4 mt-4 border-t border-white/[0.08] relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: 0.74 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400/90">
                      Core Capabilities
                    </p>
                  </div>
                  
                  {/* Floating Kinetic Text Badges (Mobile, Tablet & Desktop) */}
                  <div className="flex flex-wrap gap-2 justify-start items-center pb-2">
                    {content.about.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.75 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.45, delay: 0.78 + (idx * 0.03) }}
                        animate={{
                          y: idx % 2 === 0 ? [-3, 3, -3] : [3, -3, 3],
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-cyan-950/30 border border-white/[0.08] hover:border-cyan-400/40 text-[10px] sm:text-xs font-mono text-zinc-300 hover:text-cyan-200 transition-colors backdrop-blur-sm cursor-default shadow-sm"
                      >
                        <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
                        <span>{skill}</span>
                      </motion.span>
                    ))}
                  </div>

                  {/* Mobile & Tablet Floating Tool Badges (Animated Floating Stream) */}
                  <div className="lg:hidden mt-4 pt-3 border-t border-white/[0.06]">
                    <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
                      <span>Creative & AI Engines:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-start items-center">
                      {floatingTools.map((tool, tIdx) => (
                        <motion.div
                          key={tool.name}
                          initial={{ opacity: 0, scale: 0.7, y: 15 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ duration: 0.5, delay: 0.82 + (tIdx * 0.04) }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/70 border border-white/10 hover:border-cyan-400/40 backdrop-blur-md transition-all shadow-sm"
                        >
                          <img
                            src={tool.img}
                            alt={tool.name}
                            className="w-3.5 h-3.5 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] font-mono text-zinc-300 font-medium whitespace-nowrap">
                            {tool.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* 3. Desktop Floating Tool Badges (Animate In & Settle) */}
            <div className="floating-logos hidden lg:block">
              {floatingTools.map((tool, idx) => (
                <motion.div
                  key={tool.name}
                  className={`float-logo-item ${tool.className}`}
                  initial={{ opacity: 0, scale: 0.3, y: 35 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.22 + (idx * 0.05),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="float-logo">
                    <img src={tool.img} alt={tool.name} />
                    <span className="tool-name">{tool.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= 3. FEATURED WORK / SHOWCASE SECTION ================= */}
      <motion.section
        id="work"
        className="portfolio relative overflow-hidden py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-10 lg:px-12 w-full my-24 sm:my-32 md:my-40 lg:my-48 scroll-mt-24 sm:scroll-mt-28"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
        className="process relative overflow-hidden max-w-6xl mx-4 sm:mx-6 md:mx-8 xl:mx-auto my-24 sm:my-32 md:my-40 lg:my-48 p-6 sm:p-10 md:p-14 lg:p-16 rounded-3xl scroll-mt-24 sm:scroll-mt-28"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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

      {/* ================= 5. CONTACT & FOOTER SECTION (WITH SPACED CLEARANCE GAP) ================= */}
      <motion.section
        id="contact"
        className="relative w-full overflow-hidden flex flex-col justify-between items-center pt-24 sm:pt-32 md:pt-40 pb-0 mt-24 sm:mt-32 md:mt-40 lg:mt-48 scroll-mt-24 sm:scroll-mt-28 min-h-[90vh]"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
      </motion.section>

      {/* Script for Phosphor Icons */}
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
    </main>
  );
}