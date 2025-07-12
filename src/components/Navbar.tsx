export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 md:px-10 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
          S
        </div>
        <span className="ml-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          SmashScore
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-base font-medium">
        <a href="#players" className="hover:text-lime-500 transition">Players</a>
        <a href="#tournaments" className="hover:text-blue-500 transition">Tournaments</a>
        <a href="#analysis" className="hover:text-lime-500 transition">Analysis</a>
      </div>
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <span className="sr-only">Open menu</span>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </nav>
  );
}
