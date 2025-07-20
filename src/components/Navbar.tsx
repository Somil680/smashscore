// export default function Navbar() {
//   return (
//     <nav className="flex items-center justify-between px-4 py-3 md:px-10 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-20">
//       <div className="flex items-center gap-2">
//         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
//           S
//         </div>
//         <span className="ml-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
//           SmashScore
//         </span>
//       </div>
//       <div className="hidden md:flex gap-8 text-base font-medium">
//         <a href="/player" className="hover:text-lime-500 transition">Players</a>
//         <a href="#tournaments" className="hover:text-blue-500 transition">Tournaments</a>
//         <a href="#analysis" className="hover:text-lime-500 transition">Analysis</a>
//       </div>
//       <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
//         <span className="sr-only">Open menu</span>
//         <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        
//       </button>
//     </nav>
//   );
// }
// components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 md:px-10 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-20">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
          S
        </div>
        <span className="ml-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          SmashScore
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 text-base font-medium text-gray-700 dark:text-gray-300">
        <a href="/player" className="hover:text-lime-500 transition-colors duration-300">Players</a>
        <a href="/tournaments" className="hover:text-blue-500 transition-colors duration-300">Tournaments</a>
        <a href="/analysis" className="hover:text-lime-500 transition-colors duration-300">Analysis</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lime-500"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#111827] shadow-lg border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center gap-4 py-4 text-lg">
            <a href="/teams" className="hover:text-lime-500 transition-colors duration-300" onClick={() => setIsOpen(false)}>Teams</a>
            <a href="/tournaments" className="hover:text-blue-500 transition-colors duration-300" onClick={() => setIsOpen(false)}>Tournaments</a>
            <a href="/analysis" className="hover:text-lime-500 transition-colors duration-300" onClick={() => setIsOpen(false)}>Analysis</a>
          </div>
        </div>
      )}
    </nav>
  );
}