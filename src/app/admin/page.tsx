'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FolderKanban,
  FolderOpen,
  FileText,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ChevronRight,
  Download,
  Lock,
  Save,
  Menu,
  Send,
  Sun,
  Moon,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

// ================= TYPES =================
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
    sectionTagline?: string;
    sectionSubtitle: string;
    bgImage?: string;
  };
  process: {
    sectionTitle: string;
    steps: { number: string; title: string; description: string }[];
    bgImage?: string;
  };
}

interface ProjectRecord {
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
  updatedAt?: string;
}

interface CategoryRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  projects?: {
    id: string;
    title: string;
    year: string;
    shortDesc: string;
    type: string;
    image: string;
  }[];
}

interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  timeline: string;
  budget?: string;
  services: string[];
  projectDetails: string;
  referenceLinks?: string;
  status: 'new' | 'replied';
  createdAt: string;
}

const CATEGORY_DEFINITIONS: CategoryRecord[] = [
  {
    id: 'logo',
    slug: 'logo',
    title: 'Logo & Brand Identity',
    description: 'Vector Systems & Visual Identities',
    coverImage: '/work/portfolio-covers/Glowing_vector_logo_in_space_2K_20260925163902_1790335679390.jpg',
  },
  {
    id: 'banners',
    slug: 'banners',
    title: 'High-Converting Banners & Posters',
    description: 'Performance Ad Creatives & Posters',
    coverImage: '/portfolio-assets/banners/banner_mockup_1.jpg',
  },
  {
    id: 'magazine',
    slug: 'magazine',
    title: 'Full Magazine Layout',
    description: 'Editorial Layouts & Multi-page Publications',
    coverImage: '/portfolio-assets/magazine/magazine_layout_1.jpg',
  },
  {
    id: 'youtube',
    slug: 'youtube',
    title: 'AI-Crafted YouTube Thumbnails',
    description: 'CTR-Boosted Gaming & Tech Thumbnails',
    coverImage: '/portfolio-assets/youtube/youtube_thumb_1.jpg',
  },
  {
    id: 'instagram',
    slug: 'instagram',
    title: 'Instagram Brand Campaigns',
    description: 'Social Media Carousels & Brand Kits',
    coverImage: '/portfolio-assets/instagram/instagram_post_1.jpg',
  },
  {
    id: 'creator',
    slug: 'creator',
    title: 'Content Creation & Media',
    description: 'Live Streaming Overlays & 3D Assets',
    coverImage: '/assets/hero_landscape_z.jpg',
  },
];

export default function AdminPage() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'categories' | 'content' | 'inquiries' | 'settings'>('dashboard');
  const [contentSubTab, setContentSubTab] = useState<'home' | 'about' | 'work' | 'process'>('home');
  // Theme State (Light vs Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('admin_theme');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch {
        // ignore
      }
    }
    return 'light';
  });

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('admin_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Data States
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [recentInquiriesCount, setRecentInquiriesCount] = useState(0);
  const [content, setContent] = useState<SiteContent>({
    home: { headline: '', tagline: '', ctaText: '', ctaLink: '', bgImage: '' },
    about: { bio: '', experienceYears: '', story: '', skills: [], bgImage: '' },
    work: { sectionTitle: '', sectionTagline: '', sectionSubtitle: '', bgImage: '' },
    process: { sectionTitle: '', steps: [], bgImage: '' },
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const lastSavedContentRef = useRef<string>('');
  const isContentInitialized = useRef(false);
  const autoSaveDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Filter & Search
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<'all' | 'new' | 'replied'>('all');

  // Modals State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [submittingProject, setSubmittingProject] = useState(false);

  // Project Form Fields
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projYear, setProjYear] = useState('');
  const [projCategory, setProjCategory] = useState('logo');
  const [projTagline, setProjTagline] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projImageUrl, setProjImageUrl] = useState('');
  const [projFile, setProjFile] = useState<File | null>(null);
  const [projPreviewUrl, setProjPreviewUrl] = useState('');
  const projFileInputRef = useRef<HTMLInputElement>(null);

  // Category Edit Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catCoverImage, setCatCoverImage] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Inquiry View Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);

  // Skill Input for About CMS
  const [newSkillInput, setNewSkillInput] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ================= API CALLS =================
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        const loaded: SiteContent = {
          home: { ...data.home },
          about: { ...data.about, skills: data.about?.skills || [] },
          work: { ...data.work },
          process: { ...data.process, steps: data.process?.steps || [] },
        };
        setContent(loaded);
        lastSavedContentRef.current = JSON.stringify(loaded);
        isContentInitialized.current = true;
        setAutoSaveStatus('saved');
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error('Error fetching site content:', err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Failed to load projects', 'error');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        const list: InquiryRecord[] = Array.isArray(data) ? data : [];
        setInquiries(list);
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        setRecentInquiriesCount(list.filter((inq) => new Date(inq.createdAt).getTime() >= sevenDaysAgo).length);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
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
              fetchCategories();
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
  }, [fetchContent, fetchProjects, fetchCategories, fetchInquiries]);

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
        showToast('Welcome to Portfolio CMS', 'success');
        fetchContent();
        fetchProjects();
        fetchCategories();
        fetchInquiries();
      } else {
        setLoginError(data.error || 'Invalid administrator password. Try: admin123');
      }
    } catch {
      setLoginError('Authentication service unreachable. Please retry.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      showToast('Logged out successfully', 'success');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Save Site Content (Manual or Auto-Triggered)
  const handleSaveContent = async () => {
    if (autoSaveDebounceTimer.current) {
      clearTimeout(autoSaveDebounceTimer.current);
    }
    try {
      setSavingContent(true);
      setAutoSaveStatus('saving');
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        lastSavedContentRef.current = JSON.stringify(content);
        setHasUnsavedChanges(false);
        setAutoSaveStatus('saved');
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        showToast('All CMS changes saved successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to save changes');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving content';
      setAutoSaveStatus('error');
      showToast(msg, 'error');
    } finally {
      setSavingContent(false);
    }
  };

  // Auto-Save Debounced Effect for Site Content Editor
  useEffect(() => {
    // Only run if content has already been initially loaded from server
    if (!isContentInitialized.current) return;

    const currentStringified = JSON.stringify(content);
    // If no changes compared to last saved state, keep saved state
    if (currentStringified === lastSavedContentRef.current) {
      setHasUnsavedChanges(false);
      return;
    }

    // Mark as unsaved with debounced auto-save pending
    setHasUnsavedChanges(true);
    setAutoSaveStatus('unsaved');

    if (autoSaveDebounceTimer.current) {
      clearTimeout(autoSaveDebounceTimer.current);
    }

    autoSaveDebounceTimer.current = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving');
        setSavingContent(true);
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          lastSavedContentRef.current = JSON.stringify(content);
          setHasUnsavedChanges(false);
          setAutoSaveStatus('saved');
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastSavedTime(timeStr);
        } else {
          throw new Error(data.error || 'Auto-save failed');
        }
      } catch (err) {
        console.error('Debounced auto-save error:', err);
        setAutoSaveStatus('error');
      } finally {
        setSavingContent(false);
      }
    }, 1200);

    return () => {
      if (autoSaveDebounceTimer.current) {
        clearTimeout(autoSaveDebounceTimer.current);
      }
    };
  }, [content]);

  // Background Image Upload for Sections
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
        showToast(`${section.toUpperCase()} background uploaded. Click "Save Changes" to apply.`, 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload background';
      showToast(msg, 'error');
    }
  };

  // Project Modal Open for Create
  const openCreateProjectModal = () => {
    setEditingProject(null);
    setProjTitle('');
    setProjClient('');
    setProjYear(new Date().getFullYear().toString());
    setProjCategory('logo');
    setProjTagline('');
    setProjDescription('');
    setProjImageUrl('');
    setProjFile(null);
    setProjPreviewUrl('');
    setProjectModalOpen(true);
  };

  // Project Modal Open for Edit
  const openEditProjectModal = (p: ProjectRecord) => {
    setEditingProject(p);
    setProjTitle(p.title);
    setProjClient(p.companyName || p.title);
    setProjYear(p.year || '2025');
    setProjCategory(p.category || 'logo');
    setProjTagline(p.tagline || '');
    setProjDescription(p.description || '');
    setProjImageUrl(p.imageUrl || '');
    setProjFile(null);
    setProjPreviewUrl(p.imageUrl || '');
    setProjectModalOpen(true);
  };

  // Handle Project Image File Pick
  const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjFile(file);
      const url = URL.createObjectURL(file);
      setProjPreviewUrl(url);
    }
  };

  // Save Project (Create or Update)
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showToast('Project title is required', 'error');
      return;
    }
    if (!projFile && !projImageUrl && !projPreviewUrl) {
      showToast('Please upload an image or provide an image URL', 'error');
      return;
    }

    const catObj = CATEGORY_DEFINITIONS.find((c) => c.id === projCategory) || CATEGORY_DEFINITIONS[0];

    try {
      setSubmittingProject(true);
      let imageUrl = projImageUrl || projPreviewUrl;

      // Upload file if new file was chosen
      if (projFile) {
        const formData = new FormData();
        formData.append('file', projFile);
        formData.append('folderSlug', catObj.slug);

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

      const tags = projTagline.match(/#[a-zA-Z0-9_]+/g) || [
        `#${catObj.id.toUpperCase()}`,
        '#CreativeDesign',
      ];

      const payload = {
        id: editingProject ? editingProject.id : undefined,
        title: projTitle.trim(),
        companyName: (projClient || projTitle).trim(),
        year: projYear.trim() || '2025',
        category: catObj.id,
        categoryName: catObj.title,
        folderSlug: catObj.slug,
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

      setProjectModalOpen(false);
      fetchProjects();
      fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting project';
      showToast(msg, 'error');
    } finally {
      setSubmittingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (p: ProjectRecord) => {
    if (!confirm(`Are you sure you want to permanently delete "${p.title}"?`)) return;

    try {
      const res = await fetch(`/api/projects?id=${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${p.title}" deleted`, 'success');
        fetchProjects();
        fetchCategories();
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

    setProjects(reordered);

    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: reordered }),
      });

      if (!res.ok) {
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

  // Category Edit Modal Open
  const openEditCategoryModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatDescription(cat.description || '');
    setCatCoverImage(cat.coverImage || '');
    setCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      setSavingCategory(true);
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          title: catTitle.trim(),
          description: catDescription.trim(),
          coverImage: catCoverImage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Folder "${catTitle}" updated successfully`, 'success');
        setCategoryModalOpen(false);
        fetchCategories();
      } else {
        throw new Error(data.error || 'Failed to update folder');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating folder';
      showToast(msg, 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  // Toggle Inquiry Status
  const handleToggleInquiryStatus = async (inq: InquiryRecord) => {
    const newStatus = inq.status === 'new' ? 'replied' : 'new';
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inq.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inq.id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry?.id === inq.id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
        showToast(`Lead marked as ${newStatus}`, 'success');
      }
    } catch {
      showToast('Failed to update lead status', 'error');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showToast('Lead removed', 'success');
      }
    } catch {
      showToast('Failed to delete lead', 'error');
    }
  };

  // Skills helpers
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
      process: { ...prev.process, steps: newSteps },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddStep = () => {
    const num = (content.process.steps.length + 1).toString().padStart(2, '0');
    setContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: [
          ...prev.process.steps,
          {
            number: num,
            title: 'New Workflow Step',
            description: 'Provide execution details for this step.',
          },
        ],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveStep = (index: number) => {
    if (content.process.steps.length <= 1) {
      showToast('Must keep at least 1 process step', 'error');
      return;
    }
    setContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: prev.process.steps.filter((_, i) => i !== index),
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      content,
      projects,
      categories,
      inquiries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON Backup downloaded!', 'success');
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = projectFilterCategory === 'all' || p.category === projectFilterCategory;
      const q = projectSearch.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.companyName && p.companyName.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.year && p.year.includes(q));
      return matchCat && matchSearch;
    });
  }, [projects, projectFilterCategory, projectSearch]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchStatus = inquiryFilterStatus === 'all' || inq.status === inquiryFilterStatus;
      const q = inquirySearch.toLowerCase();
      const matchSearch =
        !q ||
        inq.fullName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.companyName.toLowerCase().includes(q) ||
        inq.projectDetails.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [inquiries, inquiryFilterStatus, inquirySearch]);

  const newInquiriesCount = useMemo(() => {
    return inquiries.filter((inq) => inq.status === 'new').length;
  }, [inquiries]);

  const repliedInquiriesCount = useMemo(() => {
    return inquiries.filter((inq) => inq.status === 'replied').length;
  }, [inquiries]);

  const responseRate = useMemo(() => {
    if (inquiries.length === 0) return 100;
    return Math.round((repliedInquiriesCount / inquiries.length) * 100);
  }, [inquiries.length, repliedInquiriesCount]);

  const { topDemandService, topDemandServicePercent } = useMemo(() => {
    if (inquiries.length === 0) {
      return { topDemandService: 'Brand Identity', topDemandServicePercent: 0 };
    }
    const serviceCounts: Record<string, number> = {};
    inquiries.forEach((inq) => {
      if (Array.isArray(inq.services) && inq.services.length > 0) {
        inq.services.forEach((s) => {
          serviceCounts[s] = (serviceCounts[s] || 0) + 1;
        });
      }
    });
    const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
    if (sortedServices.length === 0) {
      return { topDemandService: 'Creative Services', topDemandServicePercent: 100 };
    }
    const [topName, count] = sortedServices[0];
    const percent = Math.round((count / inquiries.length) * 100);
    return { topDemandService: topName, topDemandServicePercent: percent };
  }, [inquiries]);

  // ================= LOADING STATE =================
  if (authChecking) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="w-10 h-10 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Checking administrator session...</p>
      </div>
    );
  }

  // ================= LOGIN VIEW (STANDARD, CLEAN, SIMPLE) =================
  if (!isAuthenticated) {
    return (
      <div className={`admin-theme min-h-screen w-full flex items-center justify-center p-4 font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        {/* Top Right Theme Toggle */}
        <div className="fixed top-4 right-4 z-20">
          <div
            className={`flex items-center p-1 rounded-lg border shadow-xs transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Light Mode"
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark Mode"
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400/20' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Portal Sign In
            </h1>
            <p className="text-sm text-slate-500">
              Enter your master password to access the portfolio content management system.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 pr-11 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Helpful Default Password Button */}
              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Default Password: <strong className="text-slate-800 font-mono">admin123</strong></span>
                <button
                  type="button"
                  onClick={() => setLoginPassword('admin123')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <span>Back to public portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD (STANDARD SAAS LAYOUT) =================
  return (
    <div className={`admin-theme min-h-screen w-full flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2.5 text-sm transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                P
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 text-sm tracking-tight truncate">Portfolio Admin</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block truncate">Zeeshan Brand & Media CMS</p>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* ── TOP LIGHT / DARK MODE TOGGLE ── */}
            <div
              className={`flex items-center p-0.5 sm:p-1 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-100 border-slate-200'
              }`}
              role="group"
              aria-label="Theme Mode"
            >
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Light Mode"
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Dark Mode"
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400/20' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="hidden md:inline">Unsaved changes</span>
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              <span className="hidden sm:inline">View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-medium transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT WRAPPER WITH SIDEBAR ── */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`md:w-60 flex-shrink-0 ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1 sticky top-22">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4" />
                <span>Folders</span>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
                {categories.length || 6}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('content');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Site Content</span>
              </div>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('inquiries');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Client Leads</span>
              </div>
              {newInquiriesCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white font-bold">
                  {newInquiriesCount}
                </span>
              )}
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Settings & Backup</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 min-w-0">
          {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Portfolio Overview</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage and update all 6 showcase folders, projects, site copy, and client leads.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openCreateProjectModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* ================= NEW: QUICK STATS SECTION ================= */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Quick Stats</h2>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                          Business Snapshot
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Client inquiry volume, incoming leads, and portfolio performance at a glance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>View All Inquiries</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Performance Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1: Total Inquiries */}
                  <div
                    onClick={() => setActiveTab('inquiries')}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Inquiries
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {inquiries.length}
                      </span>
                      <span className="text-xs font-medium text-slate-500">Total received</span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Recent 7 days</span>
                      <span className="font-semibold text-blue-600">{recentInquiriesCount} new</span>
                    </div>
                  </div>

                  {/* Metric 2: New Leads */}
                  <div
                    onClick={() => {
                      setInquiryFilterStatus('new');
                      setActiveTab('inquiries');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                      newInquiriesCount > 0
                        ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50/60'
                        : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        New Leads
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
                          newInquiriesCount > 0
                            ? 'bg-amber-100 text-amber-700 animate-pulse'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-extrabold tracking-tight ${
                          newInquiriesCount > 0 ? 'text-amber-700' : 'text-slate-900'
                        }`}
                      >
                        {newInquiriesCount}
                      </span>
                      {newInquiriesCount > 0 ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                          Pending Reply
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold">
                          All caught up
                        </span>
                      )}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Action status</span>
                      <span
                        className={
                          newInquiriesCount > 0
                            ? 'font-bold text-amber-700'
                            : 'font-semibold text-emerald-600'
                        }
                      >
                        {newInquiriesCount > 0 ? `${newInquiriesCount} need response` : 'Zero unread'}
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: Response Rate */}
                  <div
                    onClick={() => setActiveTab('inquiries')}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Response Rate
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {responseRate}%
                      </span>
                      <span className="text-xs font-medium text-slate-500">Processed</span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Handled leads</span>
                      <span className="font-semibold text-emerald-600">
                        {repliedInquiriesCount} of {inquiries.length}
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Lead Demand Focus */}
                  <div
                    onClick={() => setActiveTab('inquiries')}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Top Demand Service
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span
                        className="text-base font-bold text-slate-900 truncate"
                        title={topDemandService}
                      >
                        {topDemandService}
                      </span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Share of inquiries</span>
                      <span className="font-semibold text-indigo-600">
                        {topDemandServicePercent}% volume
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Distribution Bar */}
                <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">Leads Pipeline:</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {newInquiriesCount} New Leads ({inquiries.length > 0 ? Math.round((newInquiriesCount / inquiries.length) * 100) : 0}%)
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {repliedInquiriesCount} Replied ({responseRate}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48 h-2 rounded-full bg-slate-200 overflow-hidden flex">
                    <div
                      style={{ width: `${inquiries.length > 0 ? (newInquiriesCount / inquiries.length) * 100 : 0}%` }}
                      className="bg-amber-400 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${inquiries.length > 0 ? (repliedInquiriesCount / inquiries.length) * 100 : 100}%` }}
                      className="bg-emerald-500 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Projects
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{projects.length}</span>
                    <span className="text-xs text-slate-500">Live items</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('categories')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Active Folders
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{categories.length || 6}</span>
                    <span className="text-xs text-slate-500">Categories</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Client Leads
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{inquiries.length}</span>
                    {newInquiriesCount > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        {newInquiriesCount} new
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">All answered</span>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('content')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Site Content
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-900">4 Sections</span>
                    <span className="text-xs text-slate-500">Home • About • Work • Process</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump & Recent Leads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Management Shortcuts */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={openCreateProjectModal}
                      className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
                    >
                      <Plus className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="text-sm font-semibold text-slate-900">Add Project</div>
                      <div className="text-xs text-slate-500 mt-0.5">Upload a new portfolio item</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('categories')}
                      className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all"
                    >
                      <FolderOpen className="w-5 h-5 text-indigo-600 mb-2" />
                      <div className="text-sm font-semibold text-slate-900">Edit Folders</div>
                      <div className="text-xs text-slate-500 mt-0.5">Customize cover images & descriptions</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('content')}
                      className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all"
                    >
                      <FileText className="w-5 h-5 text-amber-600 mb-2" />
                      <div className="text-sm font-semibold text-slate-900">Edit Site Copy</div>
                      <div className="text-xs text-slate-500 mt-0.5">Headlines, bio, skills, and 4 steps</div>
                    </button>

                    <button
                      onClick={handleExportBackup}
                      className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all"
                    >
                      <Download className="w-5 h-5 text-emerald-600 mb-2" />
                      <div className="text-sm font-semibold text-slate-900">Backup Data</div>
                      <div className="text-xs text-slate-500 mt-0.5">Download full JSON archive</div>
                    </button>
                  </div>
                </div>

                {/* Recent Leads Preview */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">Recent Client Inquiries</h2>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      View all ({inquiries.length})
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-400">
                      No client inquiries recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {inquiries.slice(0, 4).map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setActiveTab('inquiries');
                          }}
                          className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="text-sm font-medium text-slate-900">{inq.fullName}</div>
                            <div className="text-xs text-slate-500">{inq.email} • {inq.companyName || 'Independent'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                inq.status === 'new'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {inq.status === 'new' ? 'New' : 'Replied'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PROJECTS MANAGER ================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Header with Search, Filter & Add Button */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Projects Manager</h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Add, edit, reorder, or remove projects. Changes synchronize directly with the live showcase.
                    </p>
                  </div>
                  <button
                    onClick={openCreateProjectModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects by title, client, or tag..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:w-64">
                    <select
                      value={projectFilterCategory}
                      onChange={(e) => setProjectFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="all">All Folders ({projects.length})</option>
                      {CATEGORY_DEFINITIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                {loadingProjects ? (
                  <div className="py-16 text-center text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
                    Loading projects...
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="py-16 text-center text-sm text-slate-500 space-y-3">
                    <p>No projects match your filter or search query.</p>
                    <button
                      onClick={() => {
                        setProjectSearch('');
                        setProjectFilterCategory('all');
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Clear search filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4 w-20">Preview</th>
                          <th className="py-3 px-4">Title & Client</th>
                          <th className="py-3 px-4">Folder / Category</th>
                          <th className="py-3 px-4 w-20">Year</th>
                          <th className="py-3 px-4 w-28 text-center">Order</th>
                          <th className="py-3 px-4 w-32 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProjects.map((p, index) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-center text-xs font-mono text-slate-400">
                              {index + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative flex-shrink-0">
                                {p.imageUrl ? (
                                  <Image
                                    src={p.imageUrl}
                                    alt={p.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900 leading-snug">{p.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {p.companyName && p.companyName !== p.title ? p.companyName : ''}
                                {p.tagline ? ` • ${p.tagline.slice(0, 45)}` : ''}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                {CATEGORY_DEFINITIONS.find((c) => c.id === p.category)?.title || p.categoryName || p.category}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-xs font-mono text-slate-600">
                              {p.year || '2025'}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleReorderProject(index, 'up')}
                                  disabled={index === 0}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleReorderProject(index, 'down')}
                                  disabled={index === filteredProjects.length - 1}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => openEditProjectModal(p)}
                                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(p)}
                                  className="p-1 rounded hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: CATEGORIES & FOLDERS ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <h1 className="text-xl font-bold text-slate-900">Showcase Folders (Categories)</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage the 6 portfolio folders. Edit their titles, descriptions, and cover images.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(categories.length > 0 ? categories : CATEGORY_DEFINITIONS).map((cat) => {
                  const categoryProjects = projects.filter((p) => p.category === cat.id || p.folderSlug === cat.slug);
                  return (
                    <div
                      key={cat.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover image header */}
                        <div className="relative h-40 bg-slate-100 border-b border-slate-200">
                          {cat.coverImage ? (
                            <Image
                              src={cat.coverImage}
                              alt={cat.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                              No Cover Image
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200 shadow-2xs">
                              {categoryProjects.length} Projects
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2">
                          <h2 className="text-base font-bold text-slate-900">{cat.title}</h2>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {cat.description || 'Vector systems, visual identity and collateral.'}
                          </p>
                          <div className="text-[11px] font-mono text-slate-400">
                            Folder Slug: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">/work/{cat.slug || cat.id}</code>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/work/${cat.slug || cat.id}`}
                          target="_blank"
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                        >
                          <span>Preview Folder</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <button
                          onClick={() => openEditCategoryModal(cat as CategoryRecord)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit Folder Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SITE CONTENT CMS ================= */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Header with Auto-Save Status & Save Button */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900">Site Content CMS</h1>
                    {/* Live Auto-save Status Badge */}
                    {autoSaveStatus === 'saved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Auto-saved{lastSavedTime ? ` • ${lastSavedTime}` : ''}</span>
                      </span>
                    )}
                    {autoSaveStatus === 'saving' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                        <span>Auto-saving...</span>
                      </span>
                    )}
                    {autoSaveStatus === 'unsaved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>Saving in 1s...</span>
                      </span>
                    )}
                    {autoSaveStatus === 'error' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Auto-save failed</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Edit copy, hero statements, experience, skills, and workflow. Changes auto-save as you type.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveContent}
                    disabled={savingContent}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {savingContent ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save All Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-tab pills */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: 'home', label: 'Home / Hero' },
                  { id: 'about', label: 'About & Skills' },
                  { id: 'work', label: 'Work Section Header' },
                  { id: 'process', label: '4-Step Process' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setContentSubTab(t.id as 'home' | 'about' | 'work' | 'process')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      contentSubTab === t.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* 1. HOME / HERO SECTION */}
              {contentSubTab === 'home' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                  <h2 className="text-base font-bold text-slate-900">Hero Section Settings</h2>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Hero Headline
                    </label>
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
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Hero Tagline / Subtitle
                    </label>
                    <textarea
                      rows={4}
                      value={content.home.tagline}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          home: { ...prev.home, tagline: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Call-To-Action Button Text
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
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        CTA Link Target
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
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Hero Background Image */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      Hero Background Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {content.home.bgImage && (
                        <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative flex-shrink-0">
                          <Image
                            src={content.home.bgImage}
                            alt="Hero background"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload New Hero Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleBackgroundUpload(f, 'home');
                            }}
                          />
                        </label>
                        <p className="text-[11px] text-slate-400">Current: {content.home.bgImage || 'Default background'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ABOUT & SKILLS */}
              {contentSubTab === 'about' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  <h2 className="text-base font-bold text-slate-900">About Section & Skills</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Short Bio Headline
                      </label>
                      <input
                        type="text"
                        value={content.about.bio}
                        onChange={(e) => {
                          setContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, bio: e.target.value },
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Experience Years Badge
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
                        placeholder="e.g. 12+"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Story / Narrative
                    </label>
                    <textarea
                      rows={6}
                      value={content.about.story}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, story: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Skills Tag Manager */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Skills & Tech Stack ({content.about.skills.length})
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {content.about.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Remove Skill"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 max-w-sm pt-1">
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
                        placeholder="Add a new skill (e.g. Figma, 3D Mockups)..."
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. WORK SECTION HEADER */}
              {contentSubTab === 'work' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                  <h2 className="text-base font-bold text-slate-900">Work Portfolio Section Header</h2>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Section Title (h2)
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
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Section Tagline
                    </label>
                    <input
                      type="text"
                      value={content.work.sectionTagline || ''}
                      onChange={(e) => {
                        setContent((prev) => ({
                          ...prev,
                          work: { ...prev.work, sectionTagline: e.target.value },
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Section Subtitle / Metrics
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
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 4. 4-STEP PROCESS */}
              {contentSubTab === 'process' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">4-Step Workflow Process</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Customize each methodology phase shown on the live site.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Step</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Process Section Title
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
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {content.process.steps.map((step, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
                              {step.number}
                            </span>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                              placeholder="Step Title"
                              className="font-semibold text-slate-900 text-sm bg-transparent border-b border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStep(index)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove Step"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                            placeholder="Detailed description of what is delivered in this step..."
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Sticky Save Bar when dirty or auto-saving */}
              {hasUnsavedChanges && (
                <div className="sticky bottom-4 z-20 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    {autoSaveStatus === 'saving' ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                        <span className="text-sm font-medium">Auto-saving CMS changes in background...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-sm font-medium">
                          Unsaved changes detected • Auto-saving in 1s...
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleSaveContent}
                    disabled={savingContent}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    {savingContent ? 'Saving...' : 'Save Immediately'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: CLIENT INQUIRIES & LEADS ================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Header with Search & Filter */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Client Inquiries & Briefs</h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Review project inquiries submitted through the &quot;Start Project&quot; form on your live website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {newInquiriesCount} Unreplied
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search leads by client name, email, company, or brief..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:w-48">
                    <select
                      value={inquiryFilterStatus}
                      onChange={(e) => setInquiryFilterStatus(e.target.value as 'all' | 'new' | 'replied')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="all">All Statuses ({inquiries.length})</option>
                      <option value="new">New ({newInquiriesCount})</option>
                      <option value="replied">Replied ({inquiries.length - newInquiriesCount})</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                {filteredInquiries.length === 0 ? (
                  <div className="py-16 text-center text-sm text-slate-500">
                    No client inquiries found matching your filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4 w-28">Status</th>
                          <th className="py-3 px-4">Client Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Company</th>
                          <th className="py-3 px-4">Timeline</th>
                          <th className="py-3 px-4 w-28 text-right">Date</th>
                          <th className="py-3 px-4 w-24 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInquiries.map((inq) => (
                          <tr
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  inq.status === 'new'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {inq.status === 'new' ? 'New Lead' : 'Replied'}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {inq.fullName}
                            </td>

                            <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                              {inq.email}
                            </td>

                            <td className="py-3 px-4 text-slate-600">
                              {inq.companyName || '—'}
                            </td>

                            <td className="py-3 px-4 text-slate-600 text-xs">
                              {inq.timeline || 'Flexible'}
                            </td>

                            <td className="py-3 px-4 text-right text-xs text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1 rounded hover:bg-rose-50 text-rose-500"
                                title="Delete lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 6: SETTINGS & BACKUP ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <h1 className="text-xl font-bold text-slate-900">Admin Settings & Data Backups</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage master credentials and export full backups of all portfolio content.
                </p>
              </div>

              {/* Appearance & Theme Setting */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Admin Appearance Mode</h2>
                    <p className="text-xs text-slate-500">
                      Switch between clean high-contrast Light mode and sleek Dark mode.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Active Theme: <span className="capitalize text-blue-600">{theme} Mode</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You can also quickly toggle this anytime from the top bar header.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-blue-400" />
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Password Information */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Master Password</h2>
                    <p className="text-xs text-slate-500">
                      Standard authentication key for this administrative dashboard.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Default master password:</span>
                    <code className="px-2 py-1 rounded bg-white border border-slate-300 font-mono text-slate-900 font-bold select-all">
                      admin123
                    </code>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    To set a custom production password, configure <code className="font-mono text-slate-800">ADMIN_PASSWORD</code> in your environment variables.
                  </p>
                </div>
              </div>

              {/* Data Export & Backup */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Export Complete Portfolio Data</h2>
                    <p className="text-xs text-slate-500">
                      Download a single JSON file containing all projects, categories, inquiries, and site copy.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Full JSON Archive</div>
                    <div className="text-xs text-slate-500">Includes {projects.length} projects, {categories.length || 6} folders, {inquiries.length} inquiries</div>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT PROJECT ================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Apex Global Brand Suite"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Folder / Category *
                  </label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {CATEGORY_DEFINITIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={projYear}
                    onChange={(e) => setProjYear(e.target.value)}
                    placeholder="2025"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Client / Company Name
                  </label>
                  <input
                    type="text"
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    placeholder="e.g. SITM Academic"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Project Type / Tagline
                  </label>
                  <input
                    type="text"
                    value={projTagline}
                    onChange={(e) => setProjTagline(e.target.value)}
                    placeholder="e.g. Identity System & Packaging"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Explain the creative direction, deliverables, and impact..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Image Uploader & Preview */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Mockup Image *
                </label>

                {projPreviewUrl ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-3 group">
                    <Image
                      src={projPreviewUrl}
                      alt="Project preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => projFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-semibold shadow-md cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => projFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload project image
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP</p>
                  </div>
                )}

                <input
                  ref={projFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProjectFileChange}
                  className="hidden"
                />

                <div className="mt-2 text-xs text-slate-500">
                  Or enter direct image URL:{' '}
                  <input
                    type="text"
                    value={projImageUrl}
                    onChange={(e) => {
                      setProjImageUrl(e.target.value);
                      setProjPreviewUrl(e.target.value);
                    }}
                    placeholder="/images/showcase/... or https://..."
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProject}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submittingProject ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CATEGORY / FOLDER ================= */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Edit Folder: {editingCategory.title}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Folder Title *
                </label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Folder Description
                </label>
                <textarea
                  rows={3}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Folder Cover Image URL
                </label>
                <input
                  type="text"
                  value={catCoverImage}
                  onChange={(e) => setCatCoverImage(e.target.value)}
                  placeholder="/work/portfolio-covers/... or image url"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {catCoverImage && (
                  <div className="mt-3 relative h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <Image
                      src={catCoverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  {savingCategory ? 'Saving...' : 'Save Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INQUIRY DETAILS ================= */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lead Details: {selectedInquiry.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">Email</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">WhatsApp / Phone</span>
                  {selectedInquiry.phone ? (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <span>{selectedInquiry.phone}</span>
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-slate-500">—</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">Company / Brand</span>
                  <span className="text-sm font-medium text-slate-800">
                    {selectedInquiry.companyName || 'Independent'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">Budget Bracket</span>
                  <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    {selectedInquiry.budget || 'Flexible'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">Target Timeline</span>
                  <span className="text-sm font-medium text-slate-800">
                    {selectedInquiry.timeline || 'Flexible'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedInquiry.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedInquiry.status === 'new' ? 'New Lead' : 'Replied'}
                  </span>
                </div>
              </div>

              {selectedInquiry.services && selectedInquiry.services.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 block mb-1.5">
                    Services Requested
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInquiry.services.map((svc) => (
                      <span
                        key={svc}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
                  Project Brief & Requirements
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.projectDetails}
                </div>
              </div>

              {selectedInquiry.referenceLinks && (
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
                    Reference Links
                  </span>
                  <p className="text-xs text-blue-600 break-all">
                    {selectedInquiry.referenceLinks}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleInquiryStatus(selectedInquiry)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedInquiry.status === 'new'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {selectedInquiry.status === 'new' ? 'Mark as Replied' : 'Mark as New'}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Design Project Inquiry`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
