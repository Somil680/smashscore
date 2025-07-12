'use client';
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import StatsCard from "../components/StatsCard";
// import FloatingCTA from "../components/FloatingCTA";
import FloatingCTAWithModal from "@/components/FloatingCTAWithModal";

export default function Home() {

  function handleAddPlayer(data: { name: string; image: string; }): void {
    console.log("🚀 ~ handleAddPlayer ~ data:", data)
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <HeroBanner />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <StatsCard
          title="Player Stats"
          borderColor="border-lime-400"
          stats={[
            { label: "Wins", value: "12", accent: "text-lime-500" },
            { label: "Matches Played", value: "20", accent: "text-blue-500" },
          ]}
          linkText="View all players"
          linkHref="#"
          linkColor="text-blue-500"
        />
        <StatsCard
          title="Ongoing Tournaments"
          borderColor="border-blue-500"
          stats={[
            { label: "Summer Smash 2025", value: "Live", accent: "text-lime-500" },
            { label: "City League", value: "Quarterfinals", accent: "text-blue-500" },
          ]}
          linkText="See tournaments"
          linkHref="#"
          linkColor="text-lime-500"
        />
        <StatsCard
          title="Performance Analysis"
          borderColor="border-lime-400"
          stats={[
            { label: "Win Rate", value: "60%", accent: "text-lime-500" },
            { label: "Avg. Points/Match", value: "21.3", accent: "text-blue-500" },
          ]}
          linkText="View analytics"
          linkHref="#"
          linkColor="text-blue-500"
        />
      </main>
      <FloatingCTAWithModal onSubmit={handleAddPlayer} />    </div>
  );
}
