'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Layers,
  Globe,
  Box,
  Video,
  Clock,
  DollarSign,
  Send,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  Phone,
  Mail,
  User,
  Link2,
  Zap,
  HelpCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ================= DATA DEFINITIONS =================
interface ServiceOption {
  id: string;
  label: string;
  description: string;
  icon: typeof Palette;
  popular?: boolean;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'brand-identity',
    label: 'Brand Identity',
    description: 'Logo systems, color palette, guidelines & vector assets',
    icon: Palette,
    popular: true,
  },
  {
    id: 'logo-design',
    label: 'Logo Design',
    description: 'Modern iconic emblem, wordmark & monograms',
    icon: Sparkles,
  },
  {
    id: 'social-media',
    label: 'Social Media & Ads',
    description: 'High-converting banners, feed kits, carousels & ads',
    icon: Layers,
    popular: true,
  },
  {
    id: 'web-digital',
    label: 'Web & Digital UI',
    description: 'Landing pages, portfolio sites & responsive interfaces',
    icon: Globe,
  },
  {
    id: 'packaging-print',
    label: 'Packaging & Print',
    description: 'Merch, apparel, magazine layouts & product boxes',
    icon: Box,
  },
  {
    id: '3d-media',
    label: '3D & Motion Assets',
    description: '3D rendering, video assets & animated emblems',
    icon: Video,
  },
];

const BUDGET_OPTIONS = [
  { id: 'starter', label: '< $500', desc: 'Starter / Single Asset' },
  { id: 'standard', label: '$500 – $1,500', desc: 'Core Identity / Campaign' },
  { id: 'pro', label: '$1,500 – $3,000', desc: 'Full Brand Suite / Multi-Asset' },
  { id: 'enterprise', label: '$3,000+', desc: 'Complete Brand Ecosystem' },
  { id: 'flexible', label: 'Flexible', desc: 'Open to recommendations' },
];

const TIMELINE_OPTIONS = [
  { id: 'rush', label: 'Rush (< 1 Week)', desc: 'Fast turnaround priority', icon: Zap },
  { id: 'standard', label: 'Standard (2–3 Weeks)', desc: 'Balanced creative cycle', icon: Clock },
  { id: 'flexible', label: 'Flexible (> 1 Month)', desc: 'Strategic & iterative', icon: Briefcase },
];

const WHATSAPP_PHONE = '918299114703';
const OFFICIAL_EMAIL = 'z3shan.in@gmail.com';

export default function StartProjectPage() {
  // Navigation step state: 1 = Services, 2 = Budget & Timeline, 3 = Vision & Contact
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [viewMode, setViewMode] = useState<'stepped' | 'all'>('stepped');

  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>(['brand-identity']);
  const [selectedBudget, setSelectedBudget] = useState<string>('$500 – $1,500');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('Standard (2–3 Weeks)');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email'>('whatsapp');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDetails: '',
    referenceLinks: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Toggle service selection
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Compile readable services list
  const formattedServicesList = useMemo(() => {
    return selectedServices
      .map((id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label || id)
      .join(', ');
  }, [selectedServices]);

  // Validate step requirements
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1 && selectedServices.length === 0) {
      errors.services = 'Please pick at least one service.';
    }
    if (step === 3 || viewMode === 'all') {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Please provide your name.';
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        errors.email = 'Please provide a valid email address.';
      }
      if (!formData.projectDetails.trim()) {
        errors.projectDetails = 'Please briefly outline your project goals or deliverables.';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Build formatted text brief
  const buildBriefText = () => {
    return (
      `*PROJECT INTAKE BRIEF — ZEESHAN PORTFOLIO*\n\n` +
      `👤 *Client Name:* ${formData.fullName || 'Not specified'}\n` +
      `📧 *Email:* ${formData.email || 'Not specified'}\n` +
      `📱 *WhatsApp/Phone:* ${formData.phone || 'Not provided'}\n` +
      `🏢 *Brand / Company:* ${formData.companyName || 'Independent / Startup'}\n` +
      `🛠️ *Services Needed:* ${formattedServicesList}\n` +
      `💰 *Estimated Budget:* ${selectedBudget}\n` +
      `⏱️ *Timeline:* ${selectedTimeline}\n` +
      `💬 *Preferred Channel:* ${preferredContact === 'whatsapp' ? 'WhatsApp' : 'Email'}\n\n` +
      `📋 *Project Goals & Scope:*\n${formData.projectDetails || 'To be discussed'}\n\n` +
      `🔗 *Reference Links:* ${formData.referenceLinks || 'None provided'}`
    );
  };

  // Handle submit to backend
  const submitInquiryToBackend = async () => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          timeline: selectedTimeline,
          budget: selectedBudget,
          services: selectedServices.map(
            (id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label || id
          ),
          projectDetails: formData.projectDetails,
          referenceLinks: formData.referenceLinks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.inquiry?.id || `inq_${Date.now()}`;
      }
    } catch (err) {
      console.error('Failed to save inquiry to database:', err);
    }
    return `inq_${Date.now()}`;
  };

  // Submit via Email
  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    const inqId = await submitInquiryToBackend();
    setSubmittedInquiryId(inqId);
    setIsSubmitting(false);

    const subject = encodeURIComponent(
      `New Project Brief: ${formData.fullName}${formData.companyName ? ` (${formData.companyName})` : ''}`
    );
    const body = encodeURIComponent(buildBriefText());
    window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=${subject}&body=${body}`;
  };

  // Submit via WhatsApp
  const handleWhatsAppSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    const inqId = await submitInquiryToBackend();
    setSubmittedInquiryId(inqId);
    setIsSubmitting(false);

    const text = encodeURIComponent(buildBriefText());
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
  };

  // Copy brief summary
  const copyBriefSummary = () => {
    navigator.clipboard.writeText(buildBriefText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Cyber Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Top Header Navigation */}
        <div className="w-full flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/50 text-xs sm:text-sm font-medium text-zinc-300 hover:text-cyan-300 transition-all group backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>

          {/* Quick view toggle */}
          {!submittedInquiryId && (
            <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/90 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('stepped')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  viewMode === 'stepped'
                    ? 'bg-cyan-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Guided Steps
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  viewMode === 'all'
                    ? 'bg-cyan-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All on One Page
              </button>
            </div>
          )}
        </div>

        {/* ── SUCCESS STATE SCREEN ── */}
        {submittedInquiryId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl mx-auto my-auto p-6 sm:p-10 md:p-14 bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-cyan-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col items-center text-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-400/15 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)]">
              <CheckCircle2 className="w-10 h-10 text-cyan-400" />
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                Brief Logged #{submittedInquiryId.slice(-6)}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight pt-2">
                Project Brief Received!
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Thank you, <span className="text-cyan-300 font-semibold">{formData.fullName}</span>!
                Your requirements have been securely logged. I review all incoming project briefs personally and respond within{' '}
                <span className="text-white font-bold">24 hours</span>.
              </p>
            </div>

            {/* Quick Summary Pill Card */}
            <div className="w-full max-w-lg p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2 font-mono text-xs text-zinc-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Services:</span>
                <span className="text-cyan-300 font-sans font-medium text-right truncate max-w-[240px]">
                  {formattedServicesList}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Timeline:</span>
                <span className="text-white">{selectedTimeline}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Budget:</span>
                <span className="text-emerald-400 font-bold">{selectedBudget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Direct Contact:</span>
                <span className="text-zinc-300 truncate max-w-[200px]">
                  {formData.email} {formData.phone ? `• ${formData.phone}` : ''}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                  `Hi Zeeshan, I just submitted project brief #${submittedInquiryId.slice(
                    -6
                  )} on your portfolio for ${formData.companyName || formData.fullName}. Let's chat!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={copyBriefSummary}
                className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Brief</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedInquiryId(null);
                setCurrentStep(1);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  companyName: '',
                  projectDetails: '',
                  referenceLinks: '',
                });
              }}
              className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors pt-2 cursor-pointer underline underline-offset-4"
            >
              Start another project brief
            </button>
          </motion.div>
        ) : (
          /* ── MAIN REDESIGNED PROJECT INTAKE EXPERIENCE ── */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT / MAIN COLUMN: Interactive Intake Steps (Cols: 7 or 8) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {/* Header Box */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>DIRECT CLIENT INTAKE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Start a Project
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
                  Tell me about your goals, brand, and timeline. Fill this quick brief to get custom ideas and transparent pricing within 24 hours.
                </p>
              </div>

              {/* Progress Step Bar (If stepped mode) */}
              {viewMode === 'stepped' && (
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Step {currentStep} of 3
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {currentStep === 1 && 'Select Services'}
                      {currentStep === 2 && 'Timeline & Budget'}
                      {currentStep === 3 && 'Details & Contact'}
                    </span>
                  </div>
                  {/* Visual Progress Track */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500 ease-out"
                      style={{
                        width:
                          currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%',
                      }}
                    />
                  </div>

                  {/* Step Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`text-left p-2 rounded-xl text-xs transition-all cursor-pointer ${
                        currentStep === 1
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      1. Deliverables
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep(1)) setCurrentStep(2);
                      }}
                      className={`text-left p-2 rounded-xl text-xs transition-all cursor-pointer ${
                        currentStep === 2
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      2. Scope & Budget
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep(1)) setCurrentStep(3);
                      }}
                      className={`text-left p-2 rounded-xl text-xs transition-all cursor-pointer ${
                        currentStep === 3
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      3. Contact & Brief
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 1: SERVICES (What are we building?) ── */}
              {(viewMode === 'all' || currentStep === 1) && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-cyan-400" />
                        <span>1. What do you need created?</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                        Choose one or more areas of focus for this project.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400/80 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20">
                      {selectedServices.length} Selected
                    </span>
                  </div>

                  {validationErrors.services && (
                    <p className="text-xs text-rose-400 font-semibold">{validationErrors.services}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {SERVICE_OPTIONS.map((svc) => {
                      const isSelected = selectedServices.includes(svc.id);
                      const Icon = svc.icon;
                      return (
                        <div
                          key={svc.id}
                          onClick={() => toggleService(svc.id)}
                          className={`relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none group ${
                            isSelected
                              ? 'bg-gradient-to-br from-cyan-950/60 to-zinc-900 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                          }`}
                        >
                          {svc.popular && (
                            <span className="absolute top-3 right-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                              Popular
                            </span>
                          )}
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-cyan-400 text-zinc-950'
                                  : 'bg-zinc-800 text-zinc-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-1 pr-6">
                              <h3
                                className={`text-sm font-bold transition-colors ${
                                  isSelected ? 'text-cyan-300' : 'text-white'
                                }`}
                              >
                                {svc.label}
                              </h3>
                              <p className="text-xs text-zinc-400 leading-snug line-clamp-2">
                                {svc.description}
                              </p>
                            </div>
                          </div>

                          {/* Checkmark corner indicator */}
                          <div
                            className={`absolute bottom-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-cyan-400 text-zinc-950'
                                : 'border border-zinc-700 bg-transparent opacity-40'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {viewMode === 'stepped' && (
                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (validateStep(1)) setCurrentStep(2);
                        }}
                        className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
                      >
                        <span>Continue to Budget & Timeline</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.section>
              )}

              {/* ── STEP 2: BUDGET & TIMELINE ── */}
              {(viewMode === 'all' || currentStep === 2) && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md space-y-6"
                >
                  {/* Budget Options */}
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span>2. Estimated Budget Bracket</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                        Helps define the depth of deliverables and exploration rounds.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BUDGET_OPTIONS.map((b) => {
                        const active = selectedBudget === b.label;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBudget(b.label)}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              active
                                ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <span
                              className={`text-sm font-bold ${
                                active ? 'text-emerald-400' : 'text-white'
                              }`}
                            >
                              {b.label}
                            </span>
                            <span className="text-[11px] text-zinc-400 mt-1 leading-tight">
                              {b.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Options */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>Desired Turnaround & Launch</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                        When do you need the final assets delivered?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {TIMELINE_OPTIONS.map((t) => {
                        const active = selectedTimeline === t.label;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTimeline(t.label)}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                              active
                                ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400 text-zinc-950'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <span
                                className={`text-xs font-bold block ${
                                  active ? 'text-cyan-300' : 'text-white'
                                }`}
                              >
                                {t.label}
                              </span>
                              <span className="text-[10px] text-zinc-400">{t.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {viewMode === 'stepped' && (
                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
                      >
                        <span>Continue to Details & Contact</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.section>
              )}

              {/* ── STEP 3: DETAILS & CONTACT INFO ── */}
              {(viewMode === 'all' || currentStep === 3) && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md space-y-6"
                >
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      <span>3. About Your Project & Contact</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      Give me the essentials so I can prepare tailored solutions for you.
                    </p>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Your Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Alex Morgan"
                          className={`w-full pl-10 pr-4 py-3 bg-zinc-900 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                            validationErrors.fullName
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                              : 'border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          }`}
                        />
                      </div>
                      {validationErrors.fullName && (
                        <p className="text-[11px] text-rose-400 mt-1 font-medium">
                          {validationErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex@company.com"
                          className={`w-full pl-10 pr-4 py-3 bg-zinc-900 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                            validationErrors.email
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                              : 'border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          }`}
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="text-[11px] text-rose-400 mt-1 font-medium">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    {/* WhatsApp / Phone (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        WhatsApp / Phone Number
                        <span className="text-zinc-500 font-normal ml-1.5">(For direct chat)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Company / Brand Name */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Brand / Company Name
                        <span className="text-zinc-500 font-normal ml-1.5">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="e.g. Apex Studio, Nova Health"
                          className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details Description */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Project Vision & Key Deliverables <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      name="projectDetails"
                      required
                      rows={4}
                      value={formData.projectDetails}
                      onChange={handleInputChange}
                      placeholder="What is your brand about? Who is your target audience? What key feelings, aesthetic (cyberpunk, minimal, luxury), or deliverables do you have in mind?"
                      className={`w-full p-4 bg-zinc-900 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all leading-relaxed resize-y ${
                        validationErrors.projectDetails
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                          : 'border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      }`}
                    />
                    {validationErrors.projectDetails && (
                      <p className="text-[11px] text-rose-400 mt-1 font-medium">
                        {validationErrors.projectDetails}
                      </p>
                    )}
                  </div>

                  {/* Reference Links */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Inspiration / Reference Links
                      <span className="text-zinc-500 font-normal ml-1.5">
                        (Behance, Pinterest, Google Drive, Website)
                      </span>
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        name="referenceLinks"
                        value={formData.referenceLinks}
                        onChange={handleInputChange}
                        placeholder="https://pinterest.com/... or https://behance.net/..."
                        className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Preferred contact channel toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      Where would you prefer to receive the initial concepts & reply?
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <button
                        type="button"
                        onClick={() => setPreferredContact('whatsapp')}
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          preferredContact === 'whatsapp'
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Direct WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredContact('email')}
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          preferredContact === 'email'
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span>Official Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Final Submit Buttons Bar */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* WhatsApp One-Click Submit Button */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppSubmit()}
                        disabled={isSubmitting}
                        className="py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Transmit via WhatsApp (Fastest)</span>
                      </button>

                      {/* Official Email / Brief Submit Button */}
                      <button
                        type="button"
                        onClick={() => handleEmailSubmit()}
                        disabled={isSubmitting}
                        className="py-3.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Official Brief</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>100% Confidential • Direct response from Zeeshan within 24 hours</span>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>

            {/* RIGHT COLUMN: Live Interactive "Project Brief Ticket" (Cols: 5 or 4) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black/95 border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
                {/* Subtle top neon beam */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                      LIVE BRIEF TICKET
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">ZEESHAN // 2026</span>
                </div>

                {/* Client & Brand Info */}
                <div className="py-4 border-b border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Brand / Client
                  </span>
                  <div className="text-base font-bold text-white font-['Outfit'] truncate">
                    {formData.companyName || formData.fullName || 'New Brand Project'}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {formData.email || 'Awaiting contact details...'}
                  </div>
                </div>

                {/* Selected Deliverables List */}
                <div className="py-4 border-b border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      Deliverables ({selectedServices.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServices.map((id) => {
                      const svc = SERVICE_OPTIONS.find((s) => s.id === id);
                      return (
                        <span
                          key={id}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/20"
                        >
                          {svc?.label || id}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Scope Parameters */}
                <div className="py-4 border-b border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Budget</span>
                    <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                      {selectedBudget}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Timeline
                    </span>
                    <span className="font-medium text-white text-xs mt-0.5 block">
                      {selectedTimeline}
                    </span>
                  </div>
                </div>

                {/* Scope Snippet Preview */}
                <div className="py-4 border-b border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Scope Overview
                  </span>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed italic">
                    {formData.projectDetails
                      ? `"${formData.projectDetails}"`
                      : 'Add your project goals and requirements to see preview...'}
                  </p>
                </div>

                {/* Direct Contact Perks */}
                <div className="pt-4 space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Free creative intake consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Guaranteed response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Direct collaboration with Zeeshan</span>
                  </div>
                </div>

                {/* Bottom Direct Transmit Action */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppSubmit()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp Now</span>
                  </button>
                </div>
              </div>

              {/* Direct Help / Quick Reach Card */}
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Have immediate questions?</span>
                    <span className="text-[11px] text-zinc-400">Direct WhatsApp available</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                    'Hello Zeeshan! I have a quick question about starting a project.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-white transition-all text-xs font-mono font-semibold"
                >
                  Ask Zeeshan
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
