'use client';

import Script from 'next/script';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkSection from '@/components/WorkSection';
import Navbar from '@/components/Navbar';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
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

      {/* ================= 1. HERO SECTION (1stpage BG: Stone "Z" Neon Cave) ================= */}
      <motion.section
        id="home"
        className="hero relative min-h-screen flex items-center overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Explicit 1stpage BG Image Layer - Full Bleed on Mobile & Desktop */}
        <div className="absolute inset-0 z-0 w-full h-full min-h-[100dvh] pointer-events-none overflow-hidden">
          <img
            src="/images/1stpage-bg.jpg"
            alt="1stpage BG - Zeeshan Cyber Cave"
            className="w-full h-full min-h-[100dvh] object-cover object-center bg-cover bg-center"
          />
          {/* Subtle Left Dark Vignette for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/90 via-[#030712]/50 to-transparent w-full lg:w-2/3" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
        </div>

        <div className="hero-container relative z-10 px-4 sm:px-6 md:px-0">
          <div className="hero-content">
            <p className="hero-subtitle">BRAND STRATEGIST • AI & MULTIMEDIA DESIGNER</p>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem]">
              Timeless Craftsmanship. <span className="highlight">Next-Gen Velocity</span>
            </h1>
            <p className="hero-desc">
              Design isn&apos;t just about aesthetics, it&apos;s about connection and intent. Grounded in over a decade of hands-on execution and high-speed modern workflows, I forge distinct visual identities that leave a lasting mark across every screen and surface.
            </p>
            <div className="hero-actions flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="#work" className="btn btn-primary justify-center text-center w-full sm:w-auto">
                <span>Explore My Work</span>
                <i className="ph ph-arrow-right"></i>
              </Link>
              <Link href="#contact" className="btn btn-secondary justify-center text-center w-full sm:w-auto">
                <span>Let&apos;s Chat</span>
                <i className="ph ph-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Interactive Achievements & Stats Grid Linked to 3D Showcase Categories */}
          <motion.div
            className="stats-container"
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

      {/* ================= 2. ABOUT SECTION ("My Story" - PRESERVED) ================= */}
      <motion.section
        id="about"
        className="about relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-container">
          <div className="about-content-wrapper">
            {/* Glassmorphic Story Box */}
            <motion.div
              className="about-glass-box"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="section-tag">MY STORY</p>
              <h2 className="section-title">
                Frame by Frame.<br />Pixel by Pixel.
              </h2>
              <div className="divider"></div>
              <p className="about-text">
                I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don’t just design logos—I build immersive brand ecosystems. My journey began over a decade ago in the high-pressure print houses of Varanasi, mastering CorelDRAW and layout architecture by executing everything from local branding collaterals to rebuilding an entire 66-page magazine under tight deadlines.
              </p>
              <p className="about-text">
                As media transitioned, I channeled that foundational discipline into modern digital storytelling, where my active experience in video editing, live streaming, and content creation sharpened my understanding of audience psychology, visual pacing, and retention. Today, by fusing traditional design mastery (Adobe Premiere Pro, CorelDRAW, Canva, CapCut) with cutting-edge AI workflows (Leonardo.ai, Gemini, ChatGPT, Claude, Kling AI), I deliver premium quality at unmatched speeds—bridging core design fundamentals with next-gen generative technology to engineer high-converting visual solutions that dominate competitive spaces.
              </p>
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
        className="portfolio relative overflow-hidden py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="portfolio-header relative z-10">
          <div>
            <p className="section-tag">FEATURED WORK</p>
            <h2 className="section-title text-4xl font-extrabold font-['Outfit']">Showcase</h2>
          </div>
          <Link href="/showcase/logo" className="btn btn-secondary">
            <span>Explore 3D Showcase</span>
            <i className="ph ph-arrow-right"></i>
          </Link>
        </div>

        <div className="relative z-10">
          <WorkSection />
        </div>

        <div className="portfolio-footer relative z-10">
          <i className="ph-fill ph-star-four"></i>
          <p>10000+ successful projects across tech, gaming, finance, lifestyle & more.</p>
        </div>
      </motion.section>

      {/* ================= 4. PROCESS SECTION ================= */}
      <motion.section
        id="process"
        className="process relative overflow-hidden bg-zinc-950/60 border border-white/10 backdrop-blur-md rounded-[32px]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative z-10 w-full">
          <p className="section-tag">MY PROCESS</p>
          <h2 className="section-title text-3xl sm:text-4xl font-extrabold font-['Outfit']">
            A Proven <span className="highlight-cyan">4</span>-Step Process
          </h2>

          <div className="timeline">
            <div className="timeline-line"></div>

            <div className="timeline-step group p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300">
              <div className="step-icon">
                <i className="ph ph-lightbulb"></i>
              </div>
              <h3 className="step-num">
                01 <span className="step-title">Strategic Discovery & AI Ideation</span>
              </h3>
              <p>Leveraging LLMs and generative AI (Leonardo.ai, Claude) alongside deep brand research to explore broad creative directions and rapid concept benchmarking.</p>
            </div>

            <div className="timeline-step group p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300">
              <div className="step-icon">
                <i className="ph ph-pencil-simple"></i>
              </div>
              <h3 className="step-num">
                02 <span className="step-title">Foundation & Visual Architecture</span>
              </h3>
              <p>Distilling ideas with core design principles, structural composition, and typography hierarchy to establish a solid, memorable visual identity.</p>
            </div>

            <div className="timeline-step group p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300">
              <div className="step-icon">
                <i className="ph ph-bezier-curve"></i>
              </div>
              <h3 className="step-num">
                03 <span className="step-title">Precision Vectoring & Editing</span>
              </h3>
              <p>Translating concepts into pixel-perfect vectors and multimedia assets using CorelDRAW, Premiere Pro, and Canva for seamless scalability across print and digital media.</p>
            </div>

            <div className="timeline-step group p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300">
              <div className="step-icon">
                <i className="ph ph-cube"></i>
              </div>
              <h3 className="step-num">
                04 <span className="step-title">Ecosystem Deployment & Mockups</span>
              </h3>
              <p>Bringing brand assets to life with photorealistic 3D mockups, campaign-ready formats, and real-world collateral built for high conversion and market impact.</p>
            </div>
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