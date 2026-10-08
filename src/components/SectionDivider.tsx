'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  accent?: 'cyan' | 'purple' | 'amber' | 'emerald';
  className?: string;
  label?: string;
}

export default function SectionDivider({
  accent = 'cyan',
  className = '',
  label,
}: SectionDividerProps) {
  const accentGradients = {
    cyan: {
      line: 'from-transparent via-cyan-400/40 via-cyan-300 to-transparent',
      glow: 'from-transparent via-cyan-500/25 to-transparent',
      dot: 'bg-cyan-400 shadow-[0_0_12px_#00e5ff]',
      border: 'border-cyan-500/30',
      text: 'text-cyan-300/80',
    },
    purple: {
      line: 'from-transparent via-purple-400/40 via-fuchsia-300 to-transparent',
      glow: 'from-transparent via-purple-500/25 to-transparent',
      dot: 'bg-purple-400 shadow-[0_0_12px_#c084fc]',
      border: 'border-purple-500/30',
      text: 'text-purple-300/80',
    },
    amber: {
      line: 'from-transparent via-amber-400/40 via-yellow-200 to-transparent',
      glow: 'from-transparent via-amber-500/25 to-transparent',
      dot: 'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
      border: 'border-amber-500/30',
      text: 'text-amber-300/80',
    },
    emerald: {
      line: 'from-transparent via-emerald-400/40 via-teal-200 to-transparent',
      glow: 'from-transparent via-emerald-500/25 to-transparent',
      dot: 'bg-emerald-400 shadow-[0_0_12px_#34d399]',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300/80',
    },
  };

  const currentTheme = accentGradients[accent] || accentGradients.cyan;

  return (
    <div
      aria-hidden="true"
      className={`relative w-full flex items-center justify-center py-6 sm:py-8 pointer-events-none select-none overflow-hidden ${className}`}
    >
      <div className="relative w-full max-w-5xl px-4 sm:px-8 flex items-center justify-center">
        {/* Soft background glow pulse */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.2 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-x-0 h-6 -top-2.5 bg-gradient-to-r ${currentTheme.glow} blur-lg pointer-events-none`}
        />

        {/* Outer subtle baseline */}
        <div className="absolute inset-x-8 sm:inset-x-12 h-px bg-white/[0.04]" />

        {/* Animated Expanding Divider Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full h-[1.5px] bg-gradient-to-r ${currentTheme.line} origin-center`}
        >
          {/* Subtle moving shimmer light beam across the line */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: 'easeInOut',
              repeatDelay: 1.5,
            }}
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[0.5px]"
          />
        </motion.div>

        {/* Center Jewel / Diamond Node with Pulsing Rings */}
        <motion.div
          initial={{ scale: 0, rotate: 45, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 45, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'backOut' }}
          className="relative z-10 flex items-center justify-center -mx-2"
        >
          {/* Outer diamond halo */}
          <span className="w-5 h-5 rounded-[3px] bg-[#050508] border border-white/15 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.9)]">
            {/* Inner jewel dot */}
            <span
              className={`w-2 h-2 rounded-[2px] ${currentTheme.dot} animate-pulse`}
            />
          </span>

          {/* Optional Micro Badge / Label */}
          {label && (
            <div className="-rotate-45 absolute -bottom-5 whitespace-nowrap text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#090a10] border border-white/10 text-zinc-400">
              {label}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
