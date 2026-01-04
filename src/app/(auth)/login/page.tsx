// components/LoginPage.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
// import Link from 'next/link'

export default function LoginPage() {
  const user = useAuthStore((s) => {
    return s.user;
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login, loading, error } = useAuthStore()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    if (!error) {
      router.push('/')
    }
  }
  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  },[])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 bg-gradient-to-tr from-lime-400 via-blue-500 to-purple-600 p-10">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#111827]/40 rounded-2xl shadow-xl ">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500 flex items-center justify-center font-bold text-white text-2xl shadow-md">
              S
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to SmashScore
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, Admin!
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50  rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password-sr" className="sr-only">
                Password
              </label>
              <input
                id="password-sr"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          {error && (
            <div className="p-3 text-center text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div>
            <Button
              type="submit"
              variant={'default'}
              disabled={loading}
              className="w-full"
            >
              <LogIn className="h-10 w-10 text-blue-100" />{' '}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            {/* <p>
              dont have an account -{' '}
              <Link className="underline" href={'signUp'}>
                Create Account
              </Link>
            </p> */}
          </div>
        </form>
      </div>
    </div>
  )
}
