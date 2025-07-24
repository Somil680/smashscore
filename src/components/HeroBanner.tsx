import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'

export default function HeroBanner() {
  const user = useAuthStore((s) => s.user)

  return (
    <section className="flex flex-col items-center justify-center text-center py-12 px-4 md:py-20 md:px-0 bg-gradient-to-br from-lime-100 via-white to-blue-100 dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#0a0a0a] relative">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
        Track. Compete. <span className="text-lime-500">Win</span>.<br />
        <span className="text-blue-500">SmashScore</span> for Badminton
      </h1>
      <p className="max-w-xl text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
        Effortlessly manage players, create tournaments, and track live match
        scores. Your game, your stats, your story.
      </p>
      {user ? (
        <Link
          href="start-match"
          className="inline-block bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:scale-105 transition-transform text-lg"
        >
          Start a Match
        </Link>
      ) : (
        <Link
          href="login"
          className="inline-block bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:scale-105 transition-transform text-lg"
        >
          Sign In to Start
        </Link>
      )}
    </section>
  )
}
