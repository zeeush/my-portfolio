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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-4 font-['Inter',sans-serif]">
      {/* Centered Modern Glassmorphic Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-6">
        
        {/* Top Branding & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Back to Portfolio Link */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-wider font-mono"
          >
            ← Back to Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
}
