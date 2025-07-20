import React from "react";

interface StatsCardProps {
  title: string;
  borderColor: string;
  stats: { label: string; value: string; accent: string }[];
  linkText: string;
  linkHref: string;
  linkColor: string;
}

export default function StatsCard({
  title,
  borderColor,
  stats,
  linkText,
  linkHref,
  linkColor,
}: StatsCardProps) {
  return (
    <section
      className={`col-span-1 bg-white dark:bg-[#171717] rounded-2xl shadow-md p-6 flex flex-col items-center gap-3 border-t-4 ${borderColor}`}
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <div className="flex flex-col gap-2 w-full">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex justify-between text-sm text-gray-600 dark:text-gray-300"
          >
            <span>{stat.label}</span>
            <span className={`font-semibold ${stat.accent}`}>{stat.value}</span>
          </div>
        ))}
      </div>
      <a href={linkHref} className={`mt-4 ${linkColor} hover:underline text-sm`}>
        {linkText}
      </a>
    </section>
  );
}
