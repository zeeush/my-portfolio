'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Types
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

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  timeline: string;
  services: string[];
  projectDetails: string;
  referenceLinks?: string;
  status: 'new' | 'replied';
  createdAt: string;
}

const CATEGORIES = [
  { id: 'logo', title: 'Logo & Brand Identity', folderSlug: 'logo', icon: 'ph-crown' },
  { id: 'banners', title: 'High-Converting Banners & Posters', folderSlug: 'banners', icon: 'ph-image' },
  { id: 'magazine', title: 'Full Magazine Layout', folderSlug: 'magazine', icon: 'ph-book-open' },
  { id: 'youtube', title: 'AI-Crafted YouTube Thumbnails', folderSlug: 'youtube', icon: 'ph-youtube-logo' },
  { id: 'instagram', title: 'Instagram Brand Campaigns', folderSlug: 'instagram', icon: 'ph-instagram-logo' },
  { id: 'creator', title: 'Content Creation & Media', folderSlug: 'creator', icon: 'ph-broadcast' },
];

const INITIAL_CONTENT: SiteContent = {
  home: {
    headline: 'Timeless Craftsmanship. Next-Gen Velocity',
    tagline: "Design isn't just about aesthetics, it's about connection and intent. Grounded in over a decade of hands-on execution and high-speed modern workflows, I forge distinct visual identities that leave a lasting mark across every screen and surface.",
    ctaText: 'Explore My Work',
    ctaLink: '#work',
    bgImage: '/images/1stpage-bg.jpg',
  },
  about: {
    bio: 'I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don’t just design logos—I build immersive brand ecosystems.',
    experienceYears: '12+',
    story: 'My journey began over a decade ago in the high-pressure print houses of Varanasi, mastering CorelDRAW and layout architecture by executing everything from local branding collaterals to rebuilding an entire 66-page magazine under tight deadlines.\n\nAs media transitioned, I channeled that foundational discipline into modern digital storytelling, where my active experience in video editing, live streaming, and content creation sharpened my understanding of audience psychology, visual pacing, and retention. Today, by fusing traditional design mastery (Adobe Premiere Pro, CorelDRAW, Canva, CapCut) with cutting-edge AI workflows (Leonardo.ai, Gemini, ChatGPT, Claude, Kling AI), I deliver premium quality at unmatched speeds—bridging core design fundamentals with next-gen generative technology to engineer high-converting visual solutions that dominate competitive spaces.',
    skills: [
      'Brand Strategy',
      'Logo Design',
      'Vector Architecture',
      'CorelDRAW',
      'Adobe Premiere Pro',
      'Generative AI & LLMs',
      'Motion Graphics',
      'Editorial Layouts',
      'Packaging Design',
      'Canva Pro',
      'CapCut',
    ],
    bgImage: '',
  },
  work: {
    sectionTitle: 'Selected Works',
    sectionSubtitle: '10000+ successful projects delivered across tech, gaming, finance, lifestyle & enterprise brands.',
    bgImage: '',
  },
  process: {
    sectionTitle: 'A Proven 4-Step Process',
    steps: [
      {
        number: '01',
        title: 'Strategic Discovery & AI ideation',
        description: 'Leveraging LLMs and generative AI (Leonardo.ai, Claude) alongside deep brand research to explore broad creative directions and rapid concept benchmarking.',
      },
      {
        number: '02',
        title: 'Foundation & Visual Architecture',
        description: 'Distilling ideas with core design principles, structural composition, and typography hierarchy to establish a solid, memorable visual identity.',
      },
      {
        number: '03',
        title: 'Precision Vectoring & Editing',
        description: 'Translating concepts into pixel-perfect vectors and multimedia assets using CorelDRAW, Premiere Pro, and Canva for seamless scalability across print and digital media.',
      },
      {
        number: '04',
        title: 'Ecosystem Deployment & Mockups',
        description: 'Bringing brand assets to life with photorealistic 3D mockups, campaign-ready formats, and real-world collateral built for high conversion and market impact.',
      },
    ],
    bgImage: '',
  },
};

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'work' | 'process' | 'inquiries'>('home');

  // CMS Content State
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [savingContent, setSavingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Project Form
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projYear, setProjYear] = useState(new Date().getFullYear().toString());
  const [projCategory, setProjCategory] = useState(CATEGORIES[0].id);
  const [projTagline, setProjTagline] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projFile, setProjFile] = useState<File | null>(null);
  const [projPreviewUrl, setProjPreviewUrl] = useState('');
  const [projExistingImageUrl, setProjExistingImageUrl] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchProjectQuery, setSearchProjectQuery] = useState('');

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // New Skill Input state
  const [newSkillInput, setNewSkillInput] = useState('');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const projFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Site Content
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setContent((prev) => ({
          home: { ...prev.home, ...(data.home || {}) },
          about: { ...prev.about, ...(data.about || {}) },
          work: { ...prev.work, ...(data.work || {}) },
          process: { ...prev.process, ...(data.process || {}) },
        }));
      }
    } catch (err) {
      console.error('Error loading site content:', err);
    }
  }, []);

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Failed to load projects', 'error');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  }, []);

  // Check Auth on Mount
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
              fetchContent();
              fetchProjects();
              fetchInquiries();
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
  }, [fetchContent, fetchProjects, fetchInquiries]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Please enter administrator password');
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
        showToast('Welcome to Portfolio Studio CMS', 'success');
        fetchContent();
        fetchProjects();
        fetchInquiries();
      } else {
        setLoginError(data.error || 'Invalid administrator password');
      }
    } catch {
      setLoginError('Authentication service unreachable');
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
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Save Site Content
  const handleSaveContent = async () => {
    try {
      setSavingContent(true);
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHasUnsavedChanges(false);
        showToast('All CMS changes saved successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to save changes');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving content';
      showToast(msg, 'error');
    } finally {
      setSavingContent(false);
    }
  };

  // Background Image Upload Handler
  const handleBackgroundUpload = async (
    file: File,
    section: 'home' | 'about' | 'work' | 'process'
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);

      const res = await fetch('/api/admin/upload-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContent((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            bgImage: data.imageUrl,
          },
        }));
        setHasUnsavedChanges(true);
        showToast(`${section.toUpperCase()} background uploaded! Click Save to apply.`, 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload background';
      showToast(msg, 'error');
    }
  };

  // Background Image Removal Handler
  const handleRemoveBackground = (section: 'home' | 'about' | 'work' | 'process') => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        bgImage: '',
      },
    }));
    setHasUnsavedChanges(true);
    showToast(`${section.toUpperCase()} background removed. Remember to Save Changes!`, 'success');
  };

  // Skills tag helpers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (content.about.skills.includes(trimmed)) {
      showToast('Skill already in list', 'error');
      return;
    }
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        skills: [...prev.about.skills, trimmed],
      },
    }));
    setNewSkillInput('');
    setHasUnsavedChanges(true);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        skills: prev.about.skills.filter((s) => s !== skillToRemove),
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Process Steps helpers
  const handleStepChange = (index: number, field: 'title' | 'description' | 'number', value: string) => {
    const newSteps = [...content.process.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: newSteps,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddStep = () => {
    const num = (content.process.steps.length + 1).toString().padStart(2, '0');
    const newStep = {
      number: num,
      title: 'New Workflow Phase',
      description: 'Detail the actions and deliverables for this step.',
    };
    setContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: [...prev.process.steps, newStep],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveStep = (index: number) => {
    if (content.process.steps.length <= 1) {
      showToast('Must keep at least 1 process step', 'error');
      return;
    }
    const filtered = content.process.steps.filter((_, i) => i !== index);
    setContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: filtered,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Project Form Reset
  const resetProjectForm = () => {
    setProjTitle('');
    setProjClient('');
    setProjYear(new Date().getFullYear().toString());
    setProjCategory(CATEGORIES[0].id);
    setProjTagline('');
    setProjDescription('');
    setProjFile(null);
    setProjPreviewUrl('');
    setProjExistingImageUrl('');
    setEditingProject(null);
    if (projFileInputRef.current) projFileInputRef.current.value = '';
  };

  // Start Edit Project
  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setProjTitle(p.title);
    setProjClient(p.companyName || p.title);
    setProjYear(p.year);
    setProjCategory(p.category);
    setProjTagline(p.tagline || '');
    setProjDescription(p.description || '');
    setProjExistingImageUrl(p.imageUrl);
    setProjPreviewUrl(p.imageUrl);
    setProjFile(null);
    // Smooth scroll to uploader form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Submit Project (Create or Update)
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showToast('Project title is required', 'error');
      return;
    }
    if (!projFile && !projExistingImageUrl) {
      showToast('Please upload or provide a preview image', 'error');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === projCategory) || CATEGORIES[0];

    try {
      setSubmittingProject(true);
      let imageUrl = projExistingImageUrl;

      if (projFile) {
        const formData = new FormData();
        formData.append('file', projFile);
        formData.append('folderSlug', catObj.folderSlug);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Image upload failed');
        }
        imageUrl = uploadData.imageUrl;
      }

      const tags = projTagline.match(/#[a-zA-Z0-9_]+/g) || [];

      const payload = {
        id: editingProject ? editingProject.id : undefined,
        title: projTitle.trim(),
        companyName: (projClient || projTitle).trim(),
        year: projYear.trim(),
        category: catObj.id,
        categoryName: catObj.title,
        folderSlug: catObj.folderSlug,
        tagline: projTagline.trim(),
        description: projDescription.trim(),
        tags,
        imageUrl,
      };

      const res = await fetch('/api/projects', {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to save project');
      }

      showToast(
        editingProject ? `Project "${projTitle}" updated!` : `Project "${projTitle}" created!`,
        'success'
      );

      resetProjectForm();
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting project';
      showToast(msg, 'error');
    } finally {
      setSubmittingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (p: Project) => {
    if (!confirm(`Are you sure you want to permanently delete "${p.title}"?`)) return;

    try {
      const res = await fetch(`/api/projects?id=${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${p.title}" deleted`, 'success');
        if (editingProject?.id === p.id) resetProjectForm();
        fetchProjects();
      } else {
        throw new Error(data.error || 'Failed to delete project');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting project';
      showToast(msg, 'error');
    }
  };

  // Reorder Projects (Move Up / Down)
  const handleReorderProject = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistic UI update
    setProjects(reordered);

    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: reordered }),
      });

      if (!res.ok) {
        // Rollback
        fetchProjects();
        showToast('Failed to update project order', 'error');
      } else {
        showToast('Order updated successfully', 'success');
      }
    } catch {
      fetchProjects();
      showToast('Error syncing project order', 'error');
    }
  };

  // Inquiries Actions: Toggle status
  const handleToggleInquiryStatus = async (inquiry: Inquiry) => {
    const newStatus = inquiry.status === 'new' ? 'replied' : 'new';
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiry.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiry.id ? { ...item, status: newStatus } : item))
        );
        showToast(`Lead marked as ${newStatus}`, 'success');
      } else {
        throw new Error(data.error || 'Failed to update lead');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating lead';
      showToast(msg, 'error');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showToast('Lead inquiry removed', 'success');
      } else {
        throw new Error(data.error || 'Failed to delete inquiry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting lead';
      showToast(msg, 'error');
    }
  };

  // Filtered inquiries count
  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;

  // Filtered projects list
  const filteredProjects = projects.filter((p) => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      (p.companyName && p.companyName.toLowerCase().includes(searchProjectQuery.toLowerCase())) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchProjectQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Filtered inquiries list
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = inquiryFilter === 'all' || inq.status === inquiryFilter;
    const q = inquirySearch.toLowerCase();
    const matchSearch =
      inq.fullName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.companyName.toLowerCase().includes(q) ||
      inq.projectDetails.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Render: Loading Screen
  if (authChecking) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050508] text-white">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4" />
        <p className="text-xs uppercase font-mono text-zinc-400 tracking-widest">
          Authenticating Studio CMS...
        </p>
      </div>
    );
  }

  // Render: High-Contrast Studio Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] px-4 font-['Inter',sans-serif] relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10 blur-[130px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, rgba(37, 99, 235, 0.08) 45%, rgba(5, 5, 8, 0) 75%)',
          }}
        />

        <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Studio Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
              Portfolio Studio CMS
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Enter your master password to access the content management system.
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-center gap-2.5">
              <i className="ph ph-warning-circle text-red-400 text-lg flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">Master Password</label>
              <input
                type="password"
                required
                autoFocus
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full min-h-[52px] px-6 py-3.5 mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5 text-sm tracking-wide"
            >
              {loginLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Unlocking Studio...</span>
                </>
              ) : (
                <>
                  <i className="ph ph-key text-base" />
                  <span>Access Studio CMS</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-wider font-mono"
            >
              <i className="ph ph-arrow-left text-xs" />
              Back to Live Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN STUDIO CMS DASHBOARD =================
  return (
    <div className="min-h-screen w-full bg-[#07070a] text-zinc-100 flex flex-col items-center font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl border shadow-2xl flex items-center gap-3 text-sm backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/90 border-red-500/50 text-red-200'
            }`}
          >
            <i
              className={`ph ${
                toast.type === 'success' ? 'ph-check-circle text-emerald-400' : 'ph-warning text-red-400'
              } text-xl flex-shrink-0`}
            />
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Studio Header Bar ── */}
      <header className="w-full sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <i className="ph ph-terminal-window text-white text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">Portfolio Studio CMS</span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Zeeshan Cyber Space • Content & Inquiries Management
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved Edits
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-semibold tracking-wide transition-all"
            >
              <i className="ph ph-arrow-square-out text-sm" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {savingContent ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-950/30 border-t-zinc-950 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="ph ph-floppy-disk text-sm" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/50 hover:border-red-500/40 text-zinc-400 hover:text-red-300 border border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <i className="ph ph-sign-out text-sm" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Top Tab Navigation Bar ── */}
      <nav className="w-full border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'home', label: 'Home / Hero', icon: 'ph-house' },
            { id: 'about', label: 'About', icon: 'ph-user' },
            { id: 'work', label: 'Work / Projects', icon: 'ph-palette' },
            { id: 'process', label: 'Process', icon: 'ph-lightning' },
            {
              id: 'inquiries',
              label: 'Inquiries (Leads)',
              icon: 'ph-tray',
              badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
            },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <i className={`ph ${tab.icon} text-sm ${active ? 'text-cyan-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-cyan-500 text-black font-extrabold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main Studio Body ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* ================= TAB 1: HOME / HERO EDITOR ================= */}
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <i className="ph ph-house text-cyan-400 text-2xl" />
                  Hero Section Editor
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Customize the landing headline, tagline description, primary call-to-action button, and hero background graphic.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                disabled={savingContent}
                className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/40 transition-all"
              >
                <i className="ph ph-check text-sm" />
                <span>Save Section</span>
              </button>
            </div>

            {/* Main Content Card Container */}
            <div className="flex-1 min-h-[70vh] flex flex-col justify-between p-8 sm:p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch flex-1">
                {/* Left Column: Text Inputs */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Hero Headline
                    </label>
                    <p className="text-xs text-zinc-400 mb-2 font-mono">
                      Tip: Separate with a period (.) to automatically highlight the second half (e.g. &ldquo;Timeless Craftsmanship. Next-Gen Velocity&rdquo;)
                    </p>
                    <input
                      type="text"
                      value={content.home.headline}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          home: { ...prev.home, headline: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 font-['Outfit'] text-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Hero Tagline / Subtitle
                    </label>
                    <textarea
                      rows={5}
                      value={content.home.tagline}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          home: { ...prev.home, tagline: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full p-4.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Primary CTA Text
                      </label>
                      <input
                        type="text"
                        value={content.home.ctaText}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, ctaText: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Primary CTA Link Destination
                      </label>
                      <input
                        type="text"
                        value={content.home.ctaLink}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, ctaLink: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="#work or /start-project"
                        className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Background Graphic Uploader */}
                <div className="flex flex-col h-full">
                  <BackgroundUploaderCard
                    title="Hero Section Background"
                    description="High-resolution banner graphic used as full-bleed backdrop behind the hero text."
                    imageUrl={content.home.bgImage || ''}
                    onUpload={(file) => handleBackgroundUpload(file, 'home')}
                    onRemove={() => handleRemoveBackground('home')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 2: ABOUT EDITOR ================= */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <i className="ph ph-user text-cyan-400 text-2xl" />
                  About Section Editor
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Manage your designer biography, foundational print story, experience metric, and core expertise skill pills.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                disabled={savingContent}
                className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/40 transition-all"
              >
                <i className="ph ph-check text-sm" />
                <span>Save Section</span>
              </button>
            </div>

            {/* Main Content Card Container */}
            <div className="flex-1 min-h-[70vh] flex flex-col justify-between p-8 sm:p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch flex-1">
                {/* Left Column: Story & Narrative */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Bio Lead Paragraph
                      </label>
                    </div>
                    <textarea
                      rows={4}
                      value={content.about.bio}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, bio: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Short summary introducing who you are and your design philosophy..."
                      className="w-full p-4.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Years Experience Badge
                      </label>
                      <input
                        type="text"
                        value={content.about.experienceYears}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, experienceYears: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="12+"
                        className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      My Story Narrative
                    </label>
                    <p className="text-xs text-zinc-400 mb-2 font-mono">
                      Separate distinct narrative paragraphs with a blank line (double enter).
                    </p>
                    <textarea
                      rows={7}
                      value={content.about.story}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, story: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full p-4.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm leading-relaxed font-sans"
                    />
                  </div>

                  {/* Skills Tag Manager */}
                  <div className="pt-4 border-t border-zinc-800">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Core Expertise & Toolchain Tags
                    </label>
                    <p className="text-xs text-zinc-400 mb-3">
                      Add or remove skills displayed in the about section.
                    </p>

                    {/* Add tag form */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add tool or skill (e.g. Cinema 4D, Figma)..."
                        className="flex-1 px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <i className="ph ph-plus-bold" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2">
                      {content.about.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                            title="Remove skill"
                          >
                            <i className="ph ph-x-bold text-[10px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Background Graphic Uploader */}
                <div className="flex flex-col h-full">
                  <BackgroundUploaderCard
                    title="About Section Background"
                    description="Subtle background graphic rendered behind the glassmorphic story box."
                    imageUrl={content.about.bgImage || ''}
                    onUpload={(file) => handleBackgroundUpload(file, 'about')}
                    onRemove={() => handleRemoveBackground('about')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 3: WORK / PORTFOLIO MANAGER ================= */}
        {activeTab === 'work' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <i className="ph ph-palette text-cyan-400 text-2xl" />
                  Work &amp; Projects CMS
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Upload unlimited showcase projects, organize into folders, edit metadata, and reorder live cards.
                </p>
              </div>
              <button
                onClick={handleSaveContent}
                disabled={savingContent}
                className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/40 transition-all"
              >
                <i className="ph ph-check text-sm" />
                <span>Save Section Titles</span>
              </button>
            </div>

            {/* Main Content Card Container */}
            <div className="flex-1 min-h-[70vh] flex flex-col justify-between p-8 sm:p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl space-y-10">
              {/* Section Settings: Titles & Background */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-tight">
                      Section Header Settings
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Customize the Work section headline and footer statistics banner text.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={content.work.sectionTitle}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            work: { ...prev.work, sectionTitle: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                        Footer Subtitle / Stats
                      </label>
                      <input
                        type="text"
                        value={content.work.sectionSubtitle}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            work: { ...prev.work, sectionSubtitle: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <BackgroundUploaderCard
                    title="Work Section Background"
                    description="Atmospheric backdrop layer behind portfolio grids."
                    imageUrl={content.work.bgImage || ''}
                    onUpload={(file) => handleBackgroundUpload(file, 'work')}
                    onRemove={() => handleRemoveBackground('work')}
                  />
                </div>
              </div>

            {/* Project Creator / Editor Box */}
            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {editingProject ? `Edit Project: "${editingProject.title}"` : 'Upload New Project'}
                  </h3>
                </div>
                {editingProject && (
                  <button
                    onClick={resetProjectForm}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer font-mono font-medium"
                  >
                    <i className="ph ph-x" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Target Showcase Category
                    </label>
                    <select
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title} (/work/{cat.folderSlug})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Title */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. SITM Academic Crest"
                      className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>

                  {/* Client / Company */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Client / Company Name
                    </label>
                    <input
                      type="text"
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      placeholder="e.g. SITM Educational Group"
                      className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Year */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Completion Year
                    </label>
                    <input
                      type="text"
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      placeholder="2025"
                      className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>

                  {/* Tagline / Hashtags */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Tagline &amp; Hashtags
                    </label>
                    <input
                      type="text"
                      value={projTagline}
                      onChange={(e) => setProjTagline(e.target.value)}
                      placeholder="ACADEMIC IDENTITY #InstitutionalIdentity #AcademicBranding"
                      className="w-full px-4.5 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                    Project Case Study / Brief Description
                  </label>
                  <textarea
                    rows={3}
                    value={projDescription}
                    onChange={(e) => setProjDescription(e.target.value)}
                    placeholder="Describe the creative approach, deliverables, typography, and visual impact..."
                    className="w-full p-4.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                {/* Image Upload Drag & Drop Area */}
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                    Project Preview Mockup Image *
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) {
                        const file = e.dataTransfer.files[0];
                        setProjFile(file);
                        setProjPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    onClick={() => projFileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700/80 hover:border-cyan-400/70 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-900/40 hover:bg-zinc-900/70"
                  >
                    <input
                      type="file"
                      ref={projFileInputRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          setProjFile(file);
                          setProjPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />

                    {projPreviewUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={projPreviewUrl}
                          alt="Preview"
                          className="max-h-48 max-w-full rounded-xl object-contain border border-white/10 shadow-lg"
                        />
                        <p className="text-xs text-cyan-400 font-mono">
                          Click or drag to replace image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl">
                          <i className="ph ph-upload-simple" />
                        </div>
                        <p className="text-sm font-medium text-zinc-200">
                          Drop project mockup image here or click to browse
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                          PNG, JPG, WEBP up to 25MB • Automatically placed into /public/work/{projCategory}/
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {editingProject && (
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer border border-zinc-700"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittingProject}
                    className="px-7 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-sm font-bold tracking-wide flex items-center gap-2.5 cursor-pointer shadow-lg shadow-cyan-900/40 disabled:opacity-50 transition-all"
                  >
                    {submittingProject ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Saving Project...</span>
                      </>
                    ) : (
                      <>
                        <i className="ph ph-plus-bold" />
                        <span>{editingProject ? 'Update Project' : 'Publish Project'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects List Manager */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Published Projects</span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-400">
                      {filteredProjects.length}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <i className="ph ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-base" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchProjectQuery}
                      onChange={(e) => setSearchProjectQuery(e.target.value)}
                      className="pl-11 pr-4 py-2.5 h-11 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                    filterCategory === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  All Categories ({projects.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = projects.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                        filterCategory === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat.title} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Project Cards List */}
              {loadingProjects ? (
                <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                  Loading projects...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-12 text-center bg-zinc-950/40 border border-zinc-800 rounded-2xl">
                  <i className="ph ph-folder-open text-3xl text-zinc-600 mb-2" />
                  <p className="text-sm text-zinc-400">No projects found matching the filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((p) => {
                    const globalIndex = projects.findIndex((item) => item.id === p.id);
                    return (
                      <div
                        key={p.id}
                        className="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group transition-all"
                      >
                        {/* Image Preview Banner */}
                        <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-bold bg-black/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                              {p.categoryName || p.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-black/75 backdrop-blur-md text-zinc-300 border border-white/10">
                              {p.year}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-bold text-white text-base leading-snug line-clamp-1">
                              {p.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
                              {p.tagline || p.description}
                            </p>
                          </div>

                          {/* Reorder and Action Buttons */}
                          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                            {/* Reorder */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={globalIndex === 0}
                                onClick={() => handleReorderProject(globalIndex, 'up')}
                                title="Move Earlier / Up"
                                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 flex items-center justify-center cursor-pointer border border-zinc-700/60"
                              >
                                <i className="ph ph-arrow-up text-xs" />
                              </button>
                              <button
                                type="button"
                                disabled={globalIndex === projects.length - 1}
                                onClick={() => handleReorderProject(globalIndex, 'down')}
                                title="Move Later / Down"
                                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 flex items-center justify-center cursor-pointer border border-zinc-700/60"
                              >
                                <i className="ph ph-arrow-down text-xs" />
                              </button>
                            </div>

                            {/* Edit & Delete */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEditProject(p)}
                                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-zinc-700/60 cursor-pointer"
                              >
                                <i className="ph ph-pencil-simple text-xs" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(p)}
                                className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                              >
                                <i className="ph ph-trash text-xs" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: PROCESS EDITOR ================= */}
        {activeTab === 'process' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <i className="ph ph-lightning text-cyan-400 text-2xl" />
                  Process &amp; Workflow Editor
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Edit the sequential workflow timeline steps, phase titles, deliverables, and optional backdrop.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-4.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-zinc-700 cursor-pointer transition-all"
                >
                  <i className="ph ph-plus" />
                  <span>Add Step</span>
                </button>
                <button
                  onClick={handleSaveContent}
                  disabled={savingContent}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/40 transition-all"
                >
                  <i className="ph ph-check text-sm" />
                  <span>Save Section</span>
                </button>
              </div>
            </div>

            {/* Main Content Card Container */}
            <div className="flex-1 min-h-[70vh] flex flex-col justify-between p-8 sm:p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start flex-1">
                {/* Left Column: Steps List */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                      Section Main Title
                    </label>
                    <input
                      type="text"
                      value={content.process.sectionTitle}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          process: { ...prev.process, sectionTitle: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>

                  <div className="space-y-4">
                    {content.process.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                              {step.number || `0${idx + 1}`}
                            </span>
                            <span className="text-xs uppercase tracking-wider font-mono text-zinc-400 font-semibold">
                              Phase {idx + 1}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-xs text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/20 cursor-pointer transition-colors"
                            title="Delete this step"
                          >
                            <i className="ph ph-trash text-base" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="sm:col-span-1">
                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                              Step Badge
                            </label>
                            <input
                              type="text"
                              value={step.number}
                              onChange={(e) => handleStepChange(idx, 'number', e.target.value)}
                              placeholder={`0${idx + 1}`}
                              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                              Step Title
                            </label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                              className="w-full px-4.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                            Step Description & Deliverables
                          </label>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                            className="w-full p-4 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Background Graphic Uploader */}
                <div className="sticky top-28">
                  <BackgroundUploaderCard
                    title="Process Section Background"
                    description="Backdrop texture displayed inside the process timeline container."
                    imageUrl={content.process.bgImage || ''}
                    onUpload={(file) => handleBackgroundUpload(file, 'process')}
                    onRemove={() => handleRemoveBackground('process')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 5: INQUIRIES / LEADS DATABASE ================= */}
        {activeTab === 'inquiries' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 flex-1 flex flex-col"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <i className="ph ph-tray text-cyan-400 text-2xl" />
                  Client Inquiries &amp; Leads Database
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Real-time client briefs submitted via the &ldquo;/start-project&rdquo; intake form.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchInquiries}
                  disabled={loadingInquiries}
                  className="px-4.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-zinc-700 cursor-pointer transition-all"
                >
                  <i className={`ph ph-arrows-clockwise ${loadingInquiries ? 'animate-spin' : ''}`} />
                  <span>Refresh Leads</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(['all', 'new', 'replied'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setInquiryFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all ${
                      inquiryFilter === filter
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {filter === 'all' ? `All (${inquiries.length})` : filter}
                  </button>
                ))}
              </div>

              <div className="relative">
                <i className="ph ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-base" />
                <input
                  type="text"
                  placeholder="Search by client, brand, email..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="pl-11 pr-4 py-2.5 h-11 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full sm:w-72"
                />
              </div>
            </div>

            {/* Inquiries Table inside elevated full-height card */}
            <div className="flex-1 min-h-[70vh] flex flex-col justify-between p-8 sm:p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden">
              {loadingInquiries ? (
                <div className="py-24 text-center text-zinc-500 font-mono text-xs flex-1 flex items-center justify-center">
                  Loading inquiries database...
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="py-24 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-2xl mb-3">
                    <i className="ph ph-inbox" />
                  </div>
                  <p className="text-sm text-zinc-400 font-medium">No project inquiries found.</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Submitted briefs from /start-project will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/80 border-b border-zinc-800">
                      <tr>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Status</th>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Received</th>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Client / Brand</th>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Email</th>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Timeline / Budget</th>
                        <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-zinc-400">Scope</th>
                        <th className="px-6 py-4 text-right font-mono text-xs uppercase tracking-wider text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {filteredInquiries.map((inq) => {
                        const dateFormatted = new Date(inq.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        return (
                          <tr
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className="hover:bg-zinc-900/60 transition-colors cursor-pointer group"
                          >
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
                                  inq.status === 'new'
                                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
                                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    inq.status === 'new' ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-500'
                                  }`}
                                />
                                {inq.status}
                              </span>
                            </td>

                            <td className="px-6 py-4 font-mono text-zinc-400 whitespace-nowrap">
                              {dateFormatted}
                            </td>

                            <td className="px-6 py-4">
                              <div>
                                <span className="font-semibold text-zinc-100">{inq.fullName}</span>
                                {inq.companyName && (
                                  <span className="block text-[11px] text-zinc-400 font-mono">
                                    {inq.companyName}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-cyan-400 font-mono">
                              <a
                                href={`mailto:${inq.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline flex items-center gap-1.5"
                              >
                                <i className="ph ph-envelope text-xs" />
                                <span>{inq.email}</span>
                              </a>
                            </td>

                            <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                              {inq.timeline || 'Flexible'}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {inq.services && inq.services.length > 0 ? (
                                  inq.services.slice(0, 2).map((s, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 gap-1.5"
                                    >
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-zinc-500 text-xs">None specified</span>
                                )}
                                {inq.services && inq.services.length > 2 && (
                                  <span className="inline-flex items-center text-xs text-zinc-400 font-mono font-semibold px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                    +{inq.services.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleInquiryStatus(inq)}
                                  title={inq.status === 'new' ? 'Mark as Replied' : 'Mark as New'}
                                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                    inq.status === 'new'
                                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-900/50'
                                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-700'
                                  }`}
                                >
                                  {inq.status === 'new' ? 'Mark Replied' : 'Mark New'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  title="Delete Lead"
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                                >
                                  <i className="ph ph-trash text-base" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Card Footer Summary Info */}
              <div className="pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-mono border-t border-zinc-800/80 gap-3">
                <div className="flex items-center gap-3">
                  <span>Total Inquiries: <strong className="text-white">{inquiries.length}</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span>Filtered: <strong className="text-cyan-400">{filteredInquiries.length}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <i className="ph ph-shield-check text-cyan-400 text-sm" />
                  <span>Real-time briefs from /start-project</span>
                </div>
              </div>
            </div>

            {/* Lead Details Modal / Drawer */}
            <AnimatePresence>
              {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
                  >
                    <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold ${
                              selectedInquiry.status === 'new'
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {selectedInquiry.status}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">
                            {new Date(selectedInquiry.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {selectedInquiry.fullName}
                        </h3>
                        <p className="text-xs font-mono text-zinc-400 mt-0.5">
                          {selectedInquiry.companyName || 'Independent Brief'}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-900 cursor-pointer"
                      >
                        <i className="ph ph-x text-lg" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 uppercase font-mono block mb-1">Email Address</span>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-cyan-400 font-mono font-medium hover:underline flex items-center gap-1.5"
                        >
                          <i className="ph ph-envelope text-sm" />
                          <span>{selectedInquiry.email}</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-zinc-500 uppercase font-mono block mb-1">Timeline & Budget</span>
                        <span className="text-white font-medium">{selectedInquiry.timeline || 'Flexible'}</span>
                      </div>
                    </div>

                    {selectedInquiry.services && selectedInquiry.services.length > 0 && (
                      <div>
                        <span className="text-zinc-500 uppercase font-mono text-xs block mb-2">
                          Requested Services
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedInquiry.services.map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 gap-1.5"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-zinc-500 uppercase font-mono text-xs block mb-2">
                        Project Brief Details
                      </span>
                      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                        {selectedInquiry.projectDetails}
                      </div>
                    </div>

                    {selectedInquiry.referenceLinks && (
                      <div>
                        <span className="text-zinc-500 uppercase font-mono text-xs block mb-1.5">
                          Reference Links
                        </span>
                        <a
                          href={selectedInquiry.referenceLinks}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline break-all text-xs font-mono"
                        >
                          {selectedInquiry.referenceLinks}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <i className="ph ph-trash" />
                        <span>Delete Lead</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleInquiryStatus(selectedInquiry)}
                          className="px-4.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold cursor-pointer"
                        >
                          {selectedInquiry.status === 'new' ? 'Mark Replied' : 'Mark New'}
                        </button>
                        <a
                          href={`mailto:${selectedInquiry.email}?subject=Regarding Your Project Brief with Zeeshan`}
                          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 shadow-md shadow-cyan-900/40"
                        >
                          <i className="ph ph-paper-plane-tilt" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ── Reusable Component: Background Uploader Card ──
interface BackgroundUploaderProps {
  title: string;
  description: string;
  imageUrl: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function BackgroundUploaderCard({
  title,
  description,
  imageUrl,
  onUpload,
  onRemove,
}: BackgroundUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <i className="ph ph-image text-cyan-400" />
            <span>{title}</span>
          </h3>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
            Backdrop Graphic
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{description}</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
          }
        }}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {imageUrl ? (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] w-full rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 group flex-1 flex flex-col">
            <img
              src={imageUrl}
              alt="Section Backdrop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
            
            {/* Top-right status pill */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Backdrop
              </span>
            </div>

            {/* Hover overlay with action */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-black/90 hover:bg-black text-cyan-400 rounded-xl text-xs font-mono font-semibold border border-cyan-500/50 cursor-pointer shadow-xl flex items-center gap-2 active:scale-95 transition-all"
              >
                <i className="ph ph-arrow-clockwise text-sm" />
                <span>Replace Backdrop</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
            <span className="font-mono text-zinc-400 truncate max-w-[220px]" title={imageUrl}>
              {imageUrl}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="px-3.5 py-2 rounded-lg hover:bg-red-950/30 text-red-400 hover:text-red-300 font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <i className="ph ph-trash" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              onUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700/80 hover:border-cyan-400/80 rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-zinc-900/40 hover:bg-zinc-900/70 min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex-1 flex flex-col items-center justify-center group"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl mb-4 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-950/50">
            <i className="ph ph-cloud-arrow-up" />
          </div>
          <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
            Drop image here or click to browse
          </p>
          <p className="text-xs text-zinc-400 mt-2 font-mono max-w-xs leading-relaxed">
            Auto-uploads to <span className="text-cyan-400">/public/uploads/</span> and binds to this section
          </p>
        </div>
      )}
    </div>
  );
}
