'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your master password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid administrator password.');
      }
    } catch {
      setError('Failed to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] px-4 font-['Inter',sans-serif] relative overflow-hidden">

      {/* Ambient radial glow behind card — consistent with start-project */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10 blur-[120px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.14) 0%, rgba(37, 99, 235, 0.09) 45%, rgba(5, 5, 8, 0) 75%)'
        }}
      />

      {/* Centered Modern Glassmorphic Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-6">

        {/* Top Branding & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-tight font-['Outfit',sans-serif]">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-400 text-center mt-2">
            Enter your master password to access the dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm text-center flex items-center justify-center gap-2.5">
            <i className="ph ph-warning-circle text-red-400 text-lg flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-zinc-300 mb-2">
              Master Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-mono text-sm tracking-wider"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[52px] px-6 py-3.5 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.7)] transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5 text-sm tracking-wide"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <i className="ph ph-sign-in text-base" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Portfolio Link */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-cyan-400 transition-all group"
          >
            <i className="ph ph-arrow-left text-xs group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
