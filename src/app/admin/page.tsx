'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  companyName: string;
  year: string;
  category: string;
  categoryName: string;
  folderSlug: string;
  tagline: string;
  description: string;
  tags?: string[];
  imageUrl: string;
  createdAt?: string;
}

const CATEGORIES = [
  {
    id: 'logo',
    title: 'Logo & Brand Identity',
    subtitle: 'Vector Systems & Visual Identities',
    folderSlug: 'logo',
    icon: 'ph-crown',
  },
  {
    id: 'banners',
    title: 'High-Converting Banners & Posters',
    subtitle: 'High-Impact Performance Ad Creatives',
    folderSlug: 'banners',
    icon: 'ph-image',
  },
  {
    id: 'magazine',
    title: 'Full Magazine Layout',
    subtitle: 'Editorial Typography & Multi-Page Layouts',
    folderSlug: 'magazine',
    icon: 'ph-book-open',
  },
  {
    id: 'youtube',
    title: 'AI-Crafted YouTube Thumbnails',
    subtitle: 'CTR-Optimized Visual Gaming Graphics',
    folderSlug: 'youtube',
    icon: 'ph-youtube-logo',
  },
  {
    id: 'instagram',
    title: 'Instagram Brand Campaigns',
    subtitle: 'Viral Social Media Kits & Carousels',
    folderSlug: 'instagram',
    icon: 'ph-instagram-logo',
  },
  {
    id: 'creator',
    title: 'Content Creation & Media',
    subtitle: 'Immersive 3D & Live Streaming Assets',
    folderSlug: 'creator',
    icon: 'ph-broadcast',
  },
];

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard states
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  // Image selection state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Notification / Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Category filter for Manage Uploads
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Failed to load existing projects', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    let ignore = false;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setIsAuthenticated(!!data.authenticated);
            if (data.authenticated) {
              fetchProjects();
            }
          }
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      } finally {
        if (!ignore) setAuthChecking(false);
      }
    }
    checkAuth();
    return () => {
      ignore = true;
    };
  }, [fetchProjects]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Please enter your administrator password');
      return;
    }

    try {
      setLoginLoading(true);
      setLoginError('');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginPassword('');
        showToast('Administrator access granted', 'success');
        fetchProjects();
      } else {
        setLoginError(data.error || 'Invalid administrator password');
        showToast(data.error || 'Access Denied', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setLoginError(msg);
      showToast(msg, 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      showToast('Logged out securely', 'success');
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const resetForm = () => {
    setTitle('');
    setYear(new Date().getFullYear().toString());
    setCategory(CATEGORIES[0].id);
    setTagline('');
    setDescription('');
    setFile(null);
    setPreviewUrl('');
    setExistingImageUrl('');
    setEditingProject(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setYear(project.year);
    setCategory(project.category);
    setTagline(project.tagline);
    setDescription(project.description);
    setExistingImageUrl(project.imageUrl);
    setPreviewUrl(project.imageUrl);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a Project / Client Name', 'error');
      return;
    }

    if (!file && !existingImageUrl) {
      showToast('Please select or upload a project preview image', 'error');
      return;
    }

    const selectedCatObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

    try {
      setSubmitting(true);
      let imageUrl = existingImageUrl;

      // 1. Upload Image file if new file selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderSlug', selectedCatObj.folderSlug);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          if (uploadRes.status === 401) {
            setIsAuthenticated(false);
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error(uploadData.error || 'Image upload failed');
        }

        imageUrl = uploadData.imageUrl;
      }

      // 2. Extract hashtags from tagline
      const tags = tagline.match(/#[a-zA-Z0-9_]+/g) || [];

      const payload = {
        id: editingProject ? editingProject.id : undefined,
        title: title.trim(),
        companyName: title.trim(),
        year: year.trim(),
        category: selectedCatObj.id,
        categoryName: selectedCatObj.title,
        folderSlug: selectedCatObj.folderSlug,
        tagline: tagline.trim(),
        description: description.trim(),
        tags,
        imageUrl,
      };

      // 3. Post / Put to /api/projects
      const res = await fetch('/api/projects', {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(resData.error || 'Failed to save project');
      }

      showToast(
        editingProject
          ? `Project "${title}" updated successfully!`
          : `Project "${title}" saved to /public/work/${selectedCatObj.folderSlug}/!`,
        'success'
      );

      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during submission';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project Handler
  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects?id=${project.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Project "${project.title}" deleted`, 'success');
        if (editingProject?.id === project.id) {
          resetForm();
        }
        fetchProjects();
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        showToast('Session expired. Please log in again.', 'error');
      } else {
        throw new Error(data.error || 'Failed to delete project');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting project';
      showToast(message, 'error');
    }
  };

  // Filter projects by category and search term
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  // Loading State while verifying session
  if (authChecking) {
    return (
      <main className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_30px_rgba(0,229,255,0.4)]" />
          <span className="font-mono text-sm uppercase tracking-widest text-cyan-400">Verifying Security Session...</span>
        </div>
      </main>
    );
  }

  // ================= 1. DARK THEME LOGIN SCREEN (IF UNAUTHENTICATED) =================
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen w-full bg-[#050508] text-white flex items-center justify-center selection:bg-cyan-400 selection:text-black overflow-hidden font-['Outfit',sans-serif] px-4 py-16">
        {/* Background Ambient Glow Orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[180px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-transparent to-[#050508]/95 pointer-events-none" />
        </div>

        {/* Top Navbar */}
        <Navbar />

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3.5 shadow-2xl transition-all ${
              toast.type === 'success'
                ? 'bg-cyan-950/90 border-cyan-400/50 text-cyan-100 shadow-[0_0_30px_rgba(0,229,255,0.4)]'
                : 'bg-red-950/90 border-red-500/50 text-red-100 shadow-[0_0_30px_rgba(255,0,0,0.4)]'
            }`}
          >
            <i className={`ph ${toast.type === 'success' ? 'ph-check-circle' : 'ph-warning-circle'} text-2xl text-cyan-400`}></i>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        {/* Perfectly Centered Login Card */}
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center my-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#080a10]/95 border border-cyan-500/30 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_60px_rgba(0,240,255,0.15),0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden"
          >
            {/* Top Cyan Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            {/* Glowing Brand Icon / Security Emblem */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-400/60 shadow-[0_0_30px_rgba(0,229,255,0.35)] flex items-center justify-center mb-4 group">
                <i className="ph ph-shield-check text-3xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]"></i>
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 mb-2">
                ADMIN ACCESS PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Dashboard Verification
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-['Inter'] leading-relaxed max-w-xs">
                Enter your administrator master password to manage portfolio work and upload new assets.
              </p>
            </div>

            {/* Error Banner */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <i className="ph ph-warning-circle text-lg text-red-400 shrink-0"></i>
                <span>{loginError}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="flex flex-col text-left">
                <label className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>MASTER PASSWORD</span>
                  <i className="ph ph-lock-key text-cyan-400 text-sm"></i>
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter administrator password..."
                  className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 font-sans text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="relative overflow-hidden w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-zinc-950 font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {/* Light Sweep Shimmer Effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                {loginLoading ? (
                  <>
                    <i className="ph ph-spinner animate-spin text-xl"></i>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <i className="ph ph-key text-lg"></i>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link
                href="/"
                className="text-xs font-mono text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <span>← Return to Public Portfolio</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // ================= 2. AUTHENTICATED ADMIN DASHBOARD =================
  return (
    <main className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col items-center justify-between selection:bg-cyan-400 selection:text-black font-['Outfit',sans-serif]">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 -right-32 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Sleek Top Navigation Bar (Fixed h-16) */}
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-28 right-6 lg:right-12 z-50 px-6 py-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3.5 shadow-2xl transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-cyan-950/90 border-cyan-400/50 text-cyan-100 shadow-[0_0_30px_rgba(0,229,255,0.4)]'
              : 'bg-red-950/90 border-red-500/50 text-red-100 shadow-[0_0_30px_rgba(255,0,0,0.4)]'
          }`}
        >
          <i className={`ph ${toast.type === 'success' ? 'ph-check-circle' : 'ph-warning-circle'} text-2xl text-cyan-400`}></i>
          <span className="text-base font-medium">{toast.message}</span>
        </div>
      )}

      {/* Clean Main Container with pt-32 Top Clearance */}
      <div className="w-full max-w-7xl lg:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center pt-32 pb-24 relative z-10">
        
        {/* Dashboard Header Banner */}
        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs font-semibold tracking-widest uppercase">
                ADMIN DASHBOARD
              </span>
              <div className="inline-flex items-center gap-3 h-11 px-5 rounded-xl bg-cyan-950/30 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,229,255,0.15)] backdrop-blur-md">
                <i className="ph ph-folder-notch-open text-cyan-400 text-lg"></i>
                <span className="text-xs font-medium text-zinc-300 font-mono">Target Folder:</span>
                <code className="text-cyan-300 font-semibold font-mono text-sm tracking-wide">
                  /public/work/{selectedCategoryObj.folderSlug}/
                </code>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Portfolio Upload & Management
            </h1>
            <p className="text-sm lg:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Upload, edit, persist, and organize your work across all 6 category folders with real-time live preview.
            </p>
          </div>

          {/* Action buttons in proper flex row with gap-4 */}
          <div className="flex flex-row items-center gap-4 flex-wrap sm:flex-nowrap shrink-0">
            {/* Refresh Data Button */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex-none shrink-0"
            >
              <button
                onClick={fetchProjects}
                className="relative overflow-hidden inline-flex items-center justify-center text-center px-6 py-3 min-h-[44px] rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 text-zinc-950 font-extrabold text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(0,242,254,0.65)] hover:shadow-[0_0_32px_rgba(0,242,254,0.95)] transition-all duration-300 gap-2 cursor-pointer group/btn whitespace-nowrap"
              >
                <span className="tracking-wide uppercase whitespace-nowrap leading-none">Refresh</span>
                <i className="ph ph-arrows-clockwise text-base font-bold text-zinc-950 group-hover/btn:rotate-180 transition-transform duration-500" />
              </button>
            </motion.div>

            {/* View Main Showcase Button */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex-none shrink-0"
            >
              <Link
                href="/#work"
                className="relative overflow-hidden inline-flex items-center justify-center text-center px-6 py-3 min-h-[44px] rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-100 hover:bg-purple-600/50 hover:border-purple-400 font-extrabold text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(192,132,252,0.7)] transition-all duration-300 gap-2 cursor-pointer group/btn backdrop-blur-md whitespace-nowrap"
              >
                <span className="tracking-wide uppercase group-hover/btn:text-white transition-colors whitespace-nowrap leading-none">Showcase</span>
                <i className="ph ph-arrow-up-right text-base font-bold text-purple-200 group-hover/btn:text-white transition-transform" />
              </Link>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex-none shrink-0"
            >
              <button
                onClick={handleLogout}
                className="relative overflow-hidden inline-flex items-center justify-center text-center px-6 py-3 min-h-[44px] rounded-lg bg-zinc-900/90 border border-red-500/40 text-red-300 hover:bg-red-950/60 hover:border-red-400 hover:text-red-200 font-extrabold text-sm tracking-wide uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all duration-300 gap-2 cursor-pointer group/btn backdrop-blur-md whitespace-nowrap"
              >
                <span className="tracking-wide uppercase whitespace-nowrap leading-none">Sign Out</span>
                <i className="ph ph-sign-out text-base font-bold group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* ================= SECTION 1: TWO-COLUMN FORM & LIVE PREVIEW GRID (GAP-10) ================= */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-6">
          
          {/* Left Column (7 cols): Upload & Edit Form */}
          <div className="lg:col-span-7 w-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-['Outfit']">
                <i className={`ph ${editingProject ? 'ph-pencil-line' : 'ph-cloud-arrow-up'} text-cyan-400 text-3xl`}></i>
                <span>{editingProject ? `Editing: ${editingProject.title}` : 'Upload New Project'}</span>
              </h2>
              {editingProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-400 hover:text-white font-mono transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              
              {/* Dropdown: Portfolio Category */}
              <div className="w-full">
                <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                  Portfolio Category & Destination Folder
                </label>
                <div className="relative w-full">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans appearance-none cursor-pointer pr-10"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                        {cat.title} — ({cat.subtitle})
                      </option>
                    ))}
                  </select>
                  <i className="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg pointer-events-none"></i>
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-mono flex items-center gap-1.5">
                  <span>File Save Path:</span>
                  <code className="text-cyan-300 font-semibold font-mono text-xs">/public/work/{selectedCategoryObj.folderSlug}/</code>
                </p>
              </div>

              {/* Media Image Dropzone */}
              <div className="w-full">
                <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                  Project Preview Image (PNG, JPG, WEBP)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full min-h-[160px] border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                      : previewUrl
                      ? 'border-cyan-500/40 bg-zinc-900/70'
                      : 'border-white/20 bg-zinc-900/40 hover:border-cyan-400/60 hover:bg-zinc-900/80'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                      <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-white/20 shadow-xl flex-shrink-0">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-base font-semibold text-white truncate max-w-xs">
                          {file ? file.name : 'Current Project Image'}
                        </p>
                        <p className="text-xs text-cyan-400 font-mono mt-1">
                          Destination: /public/work/{selectedCategoryObj.folderSlug}/
                        </p>
                        <button
                          type="button"
                          className="mt-3 text-xs text-cyan-300 hover:text-white underline font-mono flex items-center gap-1.5"
                        >
                          <i className="ph ph-arrows-clockwise text-sm"></i>
                          <span>Click to Replace Image</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-1">
                        <i className="ph ph-cloud-arrow-up text-3xl"></i>
                      </div>
                      <p className="text-base font-medium text-white">
                        Drag & Drop project image here, or <span className="text-cyan-400 underline font-semibold">Browse Files</span>
                      </p>
                      <p className="text-xs text-zinc-400">
                        High-Resolution PNG, JPG, WEBP (Max 15MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Two Column Input Row: Project Name & Year */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 w-full">
                  <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                    Project / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SITM Academic Crest or CyberTech Brand"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                    Project Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Tagline Input */}
              <div className="w-full">
                <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                  Category & Industry Tagline (With Hashtags)
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Complete Identity & Brand Guidelines for FinTech Startup #Branding #FinTech"'
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                />
              </div>

              {/* Project Description Input */}
              <div className="w-full">
                <label className="block text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wide mb-2.5">
                  Project Description & Deliverables
                </label>
                <textarea
                  rows={3}
                  placeholder="2-3 lines detailing the project background, challenges solved, design principles, or tools used (Leonardo.ai, CorelDRAW, Premiere Pro)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans leading-relaxed resize-y"
                />
              </div>

              {/* Form Action Submit Buttons */}
              <div className="w-full flex items-center gap-4 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-bold font-['Outfit'] text-base tracking-wider uppercase shadow-[0_0_30px_rgba(0,229,255,0.45)] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <i className="ph ph-spinner animate-spin text-2xl"></i>
                      <span>Processing Upload...</span>
                    </>
                  ) : (
                    <>
                      <i className={`ph ${editingProject ? 'ph-floppy-disk' : 'ph-plus-circle'} text-2xl`}></i>
                      <span>{editingProject ? 'Save Project Changes' : 'Upload Project to Portfolio'}</span>
                    </>
                  )}
                </button>

                {editingProject && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-4 px-6 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 text-sm font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column (5 cols): Live Card Preview (Sticky on Scroll) */}
          <div className="lg:col-span-5 w-full sticky top-[100px]">
            <div className="w-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                  <i className="ph ph-device-mobile-camera text-lg"></i>
                  LIVE CARD PREVIEW
                </span>
                <span className="px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
                  {selectedCategoryObj.title}
                </span>
              </div>

              {/* Exact Replica of Showcase Card */}
              <div className="w-full bg-zinc-900/90 border border-white/15 rounded-2xl overflow-hidden shadow-2xl group transition-all">
                <div className="relative w-full h-60 sm:h-64 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-600 gap-2">
                      <i className="ph ph-image-square text-5xl text-zinc-700"></i>
                      <span className="text-sm font-mono">No Image Selected</span>
                    </div>
                  )}

                  {/* Year Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-cyan-400 font-mono text-xs font-bold shadow-md">
                    {year || '2025'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                    {tagline || 'CATEGORY & INDUSTRY TAGLINE #Hashtag'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mb-2.5 line-clamp-1">
                    {title || 'Project / Client Name'}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                    {description ||
                      'Project background, design principles, tools utilized (Leonardo.ai, CorelDRAW, Premiere Pro), or high-conversion market results will render here.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 text-xs text-zinc-400 font-mono flex items-center justify-between">
                <span>Path: /public/work/{selectedCategoryObj.folderSlug}/</span>
                <span className="text-cyan-400 font-semibold">Live Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: MANAGE UPLOADS (FULL WIDTH SECTION) ================= */}
        <section className="w-full mt-16 col-span-12 border-t border-white/10 pt-10">
          <div className="w-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit'] flex items-center gap-3">
                  <i className="ph ph-folder-open text-cyan-400 text-3xl"></i>
                  <span>Manage Uploads ({projects.length} Total Projects)</span>
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  View, filter, edit, or delete existing portfolio items from <code className="text-cyan-300 font-mono">data/projects.json</code>.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <i className="ph ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg"></i>
                <input
                  type="text"
                  placeholder="Search by title, tagline, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
                />
              </div>
            </div>

            {/* Pill-Shaped Filter Buttons */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] border border-cyan-300'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10 hover:border-cyan-400/40'
                }`}
              >
                All Projects ({projects.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = projects.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      filterCategory === cat.id
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] border border-cyan-300'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10 hover:border-cyan-400/40'
                    }`}
                  >
                    {cat.title} ({count})
                  </button>
                );
              })}
            </div>

            {/* Responsive 3-Column Grid */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3">
                <i className="ph ph-spinner animate-spin text-4xl text-cyan-400"></i>
                <span className="text-sm font-mono">Loading dynamic projects...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/30">
                <i className="ph ph-folder-dashed text-5xl text-zinc-600 mb-2"></i>
                <p className="text-base font-medium text-zinc-300">No projects found for this filter.</p>
                <p className="text-xs text-zinc-500 mt-1">Try selecting another filter or upload a new project above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative w-full h-52 bg-zinc-950 overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/050508/00e5ff?text=Project+Image';
                          }}
                        />
                        <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-cyan-400 font-mono text-xs font-bold shadow-md">
                          {project.year}
                        </div>
                        <div className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-full bg-cyan-950/90 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-xs font-semibold">
                          {project.categoryName || project.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                          {project.tagline}
                        </div>
                        <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2.5 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
                      <span className="text-xs text-zinc-500 font-mono truncate max-w-[150px]" title={project.imageUrl}>
                        {project.imageUrl}
                      </span>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(project)}
                          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-cyan-400 hover:text-black text-cyan-300 border border-cyan-400/30 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
                        >
                          <i className="ph ph-pencil-simple text-base"></i>
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(project)}
                          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
                        >
                          <i className="ph ph-trash text-base"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
