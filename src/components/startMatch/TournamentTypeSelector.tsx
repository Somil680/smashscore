'use client';
import React from "react";
import { motion } from "framer-motion";

export type TournamentType = "knockout" | "league" | "round-robin";

interface TournamentTypeSelectorProps {
  value: TournamentType | null;
  onChange: (type: TournamentType) => void;
}

const TOURNAMENT_TYPES: { type: TournamentType; label: string; desc: string; color: string }[] = [
  { type: "knockout", label: "Knockout", desc: "Single elimination. Lose and you're out.", color: "from-pink-400 to-red-500" },
  { type: "league", label: "League", desc: "Everyone plays everyone. Most wins wins!", color: "from-blue-400 to-blue-600" },
  { type: "round-robin", label: "Round Robin", desc: "Groups, then knockout finals.", color: "from-lime-400 to-green-500" },
];

export default function TournamentTypeSelector({ value, onChange }: TournamentTypeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold mb-2">Select Tournament Type</h2>
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
        {TOURNAMENT_TYPES.map((t) => (
          <motion.button
            key={t.type}
            type="button"
            onClick={() => onChange(t.type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 min-w-[200px] max-w-xs rounded-2xl shadow-lg px-6 py-8 bg-gradient-to-tr ${t.color} text-white font-semibold text-lg transition-all duration-300 border-4 ${
              value === t.type ? "border-white ring-4 ring-lime-300" : "border-transparent opacity-80 hover:opacity-100"
            }`}
            aria-pressed={value === t.type}
          >
            <div className="text-2xl mb-2">{t.label}</div>
            <div className="text-base opacity-80">{t.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
