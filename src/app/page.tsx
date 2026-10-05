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
    bgImage: "",
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
        className="hero relative min-h-screen flex items-center overflow-hidden pt-32 pb-20 px-4 sm:px-8 md:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hero Background Image Layer with Adaptive Overlay */}
        {content.home.bgImage && (
          <div className="absolute inset-0 z-0 w-full h-full min-h-[100dvh] pointer-events-none overflow-hidden">
            <img
              src={content.home.bgImage}
              alt="Hero Background"
              className="w-full h-full min-h-[100dvh] object-cover object-center bg-cover bg-center"
            />
            {/* Subtle Left Dark Vignette for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/60 to-transparent w-full lg:w-2/3" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
          </div>
        )}

        <div className="hero-container relative z-10 px-4 sm:px-6 md:px-0">
          <div className="hero-content">
            <p className="hero-subtitle">BRAND STRATEGIST • AI & MULTIMEDIA DESIGNER</p>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem]">
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
            <p className="hero-desc">
              {content.home.tagline}
            </p>
            <div className="hero-actions flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href={content.home.ctaLink || "#work"} className="btn btn-primary justify-center text-center w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5">
                <span>{content.home.ctaText || "Explore My Work"}</span>
                <i className="ph ph-arrow-right text-base"></i>
              </Link>
              <Link href="#contact" className="btn btn-secondary justify-center text-center w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5">
                <span>Let&apos;s Chat</span>
                <i className="ph ph-arrow-right text-base"></i>
              </Link>
            </div>
          </div>

          {/* Interactive Achievements & Stats Grid Linked to 3D Showcase Categories */}
          <motion.div
            className="stats-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo & Brand Projects */}
            <Link
              href="/showcase/logo"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-crown"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors">100+</h3>
                <p>LOGO & BRAND<br />PROJECTS DELIVERED</p>
              </div>
            </Link>

            {/* High-Converting Banners & Posters */}
            <Link
              href="/showcase/banners"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-image"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors">1,000+</h3>
                <p>HIGH-CONVERTING BANNERS &<br />POSTERS DESIGNED</p>
              </div>
            </Link>

            {/* Full Magazine Layout */}
            <Link
              href="/showcase/magazine"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-book-open"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors">66-PAGE</h3>
                <p>FULL MAGAZINE LAYOUT<br />DELIVERED IN JUST 3 DAYS</p>
              </div>
            </Link>

            {/* AI-Crafted YouTube Thumbnails */}
            <Link
              href="/showcase/youtube"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-youtube-logo"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors">100+</h3>
                <p>AI-CRAFTED YOUTUBE<br />THUMBNAILS & ASSETS</p>
              </div>
            </Link>

            {/* Instagram Brand Campaigns */}
            <Link
              href="/showcase/instagram"
              className="stats-card group cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all"
            >
              <div className="stats-icon group-hover:scale-110 transition-transform">
                <i className="ph ph-instagram-logo"></i>
              </div>
              <div className="stats-info">
                <h3 className="group-hover:text-cyan-300 transition-colors">100+</h3>
                <p>ENGAGING INSTAGRAM BRAND<br />CAMPAIGN POSTS</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= 2. ABOUT SECTION ================= */}
      <motion.section
        id="about"
        className="about relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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

        <div className="about-container relative z-10 px-4 py-24 sm:px-8 sm:py-28 md:px-12 w-full">
          <div className="about-content-wrapper">
            {/* Glassmorphic Story Box */}
            <motion.div
              className="about-glass-box p-10 sm:p-12 md:p-16 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="section-tag">MY STORY</p>
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
              <h2 className="section-title">
                Frame by Frame.<br />Pixel by Pixel.
              </h2>
              <div className="divider"></div>

              {content.about.bio && (
                <p className="about-text font-medium text-cyan-200/90 mb-3 text-base sm:text-lg">
                  I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don&apos;t just create visuals — I architect immersive brand ecosystems.
                </p>
              )}

              {content.about.story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="about-text">
                  {paragraph}
                </p>
              ))}

              {/* Skills Tags Pills */}
              {content.about.skills && content.about.skills.length > 0 && (
                <div className="pt-6 mt-6 border-t border-transparent relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                  <p className="text-lg sm:text-xl font-semibold uppercase font-mono tracking-widest text-cyan-400 mb-6 text-center sm:text-left">Core Expertise & Toolchain</p>
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start pb-2">
                    {content.about.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center gap-2 relative text-cyan-400 font-mono text-xs sm:text-sm font-bold tracking-widest group whitespace-nowrap cursor-default"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          {skill}
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"></span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Floating Tool Badges */}
            <div className="floating-logos">
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
        className="portfolio relative overflow-hidden py-24 px-4 sm:px-8 md:px-12 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
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

        <div className="portfolio-header relative z-10">
          <div>
            <p className="section-tag">FEATURED WORK</p>
            <h2 className="section-title text-4xl font-extrabold font-['Outfit']">
              {content.work.sectionTitle || 'Showcase'}
            </h2>
          </div>
          <Link href="/showcase/logo" className="btn btn-secondary px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5">
            <span>Explore 3D Showcase</span>
            <i className="ph ph-arrow-right text-base"></i>
          </Link>
        </div>

        <div className="relative z-10">
          <WorkSection />
        </div>

        <div className="portfolio-footer relative z-10">
          <i className="ph-fill ph-star-four"></i>
          <p>{content.work.sectionSubtitle || '10000+ successful projects across tech, gaming, finance, lifestyle & more.'}</p>
        </div>
      </motion.section>

      {/* ================= 4. PROCESS SECTION ================= */}
      <motion.section
        id="process"
        className="process relative overflow-hidden bg-zinc-950/60 border border-white/10 backdrop-blur-md rounded-[32px] max-w-6xl mx-4 sm:mx-8 xl:mx-auto my-16 p-8 pb-16 sm:p-12 sm:pb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
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

        <div className="relative z-10 w-full space-y-6">
          <p className="section-tag">MY PROCESS</p>
          <h2 className="section-title text-3xl sm:text-4xl font-extrabold font-['Outfit']">
            {content.process.sectionTitle || 'A Proven 4-Step Process'}
          </h2>

          <div className="timeline flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4 relative text-left">
            <div className="timeline-line hidden md:block absolute top-8 left-8 right-8 h-[2px] z-0"></div>

            {content.process.steps.map((step, idx) => {
              const icons = ['ph-lightbulb', 'ph-pencil-simple', 'ph-bezier-curve', 'ph-cube', 'ph-rocket'];
              const iconClass = icons[idx % icons.length];
              return (
                <div key={idx} className="timeline-step flex flex-col items-center text-center w-full md:w-[22%] relative z-10 group">
                  <div className="step-icon">
                    <i className={`ph ${iconClass}`}></i>
                  </div>
                  <div className="step-badge">{step.number || `0${idx + 1}`}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ================= 5. CONTACT & FOOTER SECTION ================= */}
      <section
        id="contact"
        className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between items-center pt-16 sm:pt-20 pb-0"
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