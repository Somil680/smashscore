import React from "react";

interface FloatingCTAProps {
  onClick: () => void;
}

export default function FloatingCTA({ onClick }: FloatingCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 text-slate-950 font-bold font-mono text-lg uppercase tracking-wider px-6 py-3 hover:scale-105 transition-all duration-300 flex items-center gap-2 focus:outline-none shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]"
      style={{
        background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      }}
      aria-label="Add Player"
    >
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="7" r="4" />
        <path d="M11 11v7m-4 0h8" />
      </svg>
      Add Player
    </button>
  );
}
