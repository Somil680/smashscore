import React from "react";

interface FloatingCTAProps {
  onClick: () => void;
}

export default function FloatingCTA({ onClick }: FloatingCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 bg-gradient-to-tr from-lime-400 to-blue-500 text-white rounded-full shadow-xl px-6 py-3 font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
