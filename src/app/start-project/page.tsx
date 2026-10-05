'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  { id: 'brand-identity', label: 'Brand Identity' },
  { id: 'logo-design', label: 'Logo Design' },
  { id: 'ecommerce', label: 'Amazon A+ / E-Commerce' },
  { id: 'print', label: 'Print & Packaging' },
  { id: 'video', label: 'Video / Motion' },
];

const inputCls =
  'w-full px-4 py-3.5 sm:px-5 sm:py-4 bg-zinc-900/90 border border-zinc-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 rounded-xl text-sm sm:text-base text-white placeholder-zinc-400 transition-all outline-none';

const labelCls = 'block text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide mb-2';

export default function StartProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    timeline: '',
    projectDetails: '',
    referenceLinks: '',
  });

  const toggleService = (id: string) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.projectDetails) return;

    const servicesList =
      selectedServices.length > 0
        ? selectedServices.map((id) => SERVICES.find((s) => s.id === id)?.label ?? id).join(', ')
        : 'Not specified';

    // Log inquiry to backend database
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName,
          timeline: formData.timeline,
          services: selectedServices.map((id) => SERVICES.find((s) => s.id === id)?.label ?? id),
          projectDetails: formData.projectDetails,
          referenceLinks: formData.referenceLinks,
        }),
      });
    } catch (err) {
      console.error('Failed to log inquiry brief:', err);
    }

    const subject = encodeURIComponent(
      `New Project Brief from ${formData.fullName}${formData.companyName ? ` — ${formData.companyName}` : ''}`
    );
    const body = encodeURIComponent(
      `New Project Intake Brief\n\n` +
      `• Full Name: ${formData.fullName}\n` +
      `• Email: ${formData.email}\n` +
      `• Brand / Company: ${formData.companyName || 'Not provided'}\n` +
      `• Timeline / Budget: ${formData.timeline || 'Not specified'}\n` +
      `• Services Needed: ${servicesList}\n\n` +
      `• Project Details:\n${formData.projectDetails}\n\n` +
      `• Reference Links: ${formData.referenceLinks || 'None provided'}`
    );

    window.location.href = `mailto:z3shan.in@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-black">

      <Navbar />

      <main className="min-h-screen w-full bg-[#050508] pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 flex flex-col items-center justify-center">

        {/* Back link — left-aligned at card width */}
        <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-all group"
          >
            <i className="ph ph-arrow-left text-xs sm:text-sm group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ── SUCCESS STATE ── */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-12 shadow-2xl flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400/15 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.5)]">
              <i className="ph ph-check-bold text-cyan-400 text-2xl sm:text-3xl" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Brief Prepared!</h2>
              <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed">
                Your email client has opened with the intake brief addressed to{' '}
                <span className="text-cyan-400 font-mono">z3shan.in@gmail.com</span>.
                Hit send to deliver it.
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setSelectedServices([]); }}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer"
            >
              Submit Another Brief
            </button>
          </motion.div>
        ) : (

          /* ── FORM CARD ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto p-5 sm:p-10 md:p-14 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-2xl"
          >
            {/* Card Header */}
            <div className="text-center mb-6 sm:mb-10">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2 sm:mb-3 block">
                Project Intake
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight">
                Start a Project
              </h1>
              <p className="w-full text-center text-xs sm:text-sm md:text-base text-zinc-400 mt-2">
                Have a project in mind? Fill out the brief below and I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-7">

              {/* Row 1 — Full Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label htmlFor="fullName" className={labelCls}>
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelCls}>
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Row 2 — Company + Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label htmlFor="companyName" className={labelCls}>
                    Brand / Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Studio"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="timeline" className={labelCls}>
                    Estimated Timeline / Budget
                  </label>
                  <input
                    id="timeline"
                    name="timeline"
                    type="text"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g. 2 weeks / $1,500"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Row 3 — Services Needed */}
              <div>
                <label className={`${labelCls} mb-2.5`}>Services Needed</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {SERVICES.map((svc) => {
                    const active = selectedServices.includes(svc.id);
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleService(svc.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer select-none ${active
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                          : 'bg-zinc-900 border-zinc-700/80 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300'
                          }`}
                      >
                        {active && <i className="ph ph-check-bold text-cyan-400 text-xs" />}
                        <span>{svc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4 — Project Details */}
              <div>
                <label htmlFor="projectDetails" className={labelCls}>
                  Project Details / Scope <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  required
                  value={formData.projectDetails}
                  onChange={handleChange}
                  placeholder="Tell me about your goals, target audience, and key deliverables..."
                  className="w-full p-4 sm:p-5 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-sm sm:text-base text-white placeholder-zinc-400 min-h-[140px] sm:min-h-[160px] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all resize-y leading-relaxed"
                />
              </div>

              {/* Row 5 — Reference Links */}
              <div>
                <label htmlFor="referenceLinks" className={labelCls}>
                  Reference Links
                  <span className="ml-2 text-zinc-500 font-normal tracking-normal">(Optional)</span>
                </label>
                <input
                  id="referenceLinks"
                  name="referenceLinks"
                  type="text"
                  value={formData.referenceLinks}
                  onChange={handleChange}
                  placeholder="Links to Pinterest, Behance, or reference websites"
                  className={inputCls}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full min-h-[50px] sm:min-h-[58px] px-6 sm:px-8 py-3.5 sm:py-4 bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] flex items-center justify-center gap-2.5 mt-3 sm:mt-4 cursor-pointer"
                >
                  <i className="ph ph-paper-plane-tilt text-lg sm:text-xl font-bold" />
                  <span>Send Project Brief</span>
                </button>
                <p className="text-xs sm:text-sm text-zinc-400 text-center mt-3 font-medium">
                  🔒 Confidential • Direct response from Zeeshan within 24 hours
                </p>
              </div>

            </form>
          </motion.div>
        )}

      </main>

      <Footer />

    </div>
  );
}
