import React from "react";
import { motion } from "framer-motion";

export type MatchType = "singles" | "doubles";

interface MatchTypeSelectorProps {
  value: MatchType | null;
  onChange: (type: MatchType) => void;
}

const MATCH_TYPES = [
  { type: "singles", label: "Singles (1v1)", desc: "One player per side.", color: "from-blue-400 to-blue-600" },
  { type: "doubles", label: "Doubles (2v2)", desc: "Two players per side.", color: "from-lime-400 to-green-500" },
];

export default function MatchTypeSelector({ value, onChange }: MatchTypeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold mb-2 text-white">Choose Match Type</h2>
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
        {MATCH_TYPES.map((m) => (
          <motion.button
            key={m.type}
            type="button"
            onClick={() => onChange(m.type as MatchType)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 min-w-[200px] max-w-xs rounded-2xl shadow-lg px-6 py-8 bg-gradient-to-tr ${m.color} text-white font-semibold text-lg transition-all duration-300 border-4 ${
              value === m.type ? "border-white ring-4 ring-lime-300" : "border-transparent opacity-80 hover:opacity-100"
            }`}
            aria-pressed={value === m.type}
          >
            <div className="text-2xl mb-2">{m.label}</div>
            <div className="text-base opacity-80">{m.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
