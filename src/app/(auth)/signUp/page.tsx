// // components/LoginPage.tsx
// 'use client'

// import React, { useState } from 'react'
// import { supabase } from '@/lib/supabase' // Adjust path to your Supabase client
// import { Button } from '@/components/ui/button'
// import { useAuthStore } from '@/store/useAuthStore'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [message, setMessage] = useState('')
//   const { login } = useAuthStore() // Assuming you have a login function in your auth store
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setMessage('')

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       })

//       if (error) {
//         throw error
//       }
//       if (data?.user) {
//         const { id } = data.user
//         // Store in profile table
//         await supabase.from('profiles').insert({
//           id, // same as user.id
//           email: data.user.email || '',
//         })
//         await login(email, password)
//       }
//       setMessage('Login successful! Redirecting...')
//       // Handle successful login, e.g., redirect to a dashboard
//       window.location.href = '/'
//     } catch (error: unknown) {
//       setError((error as Error).message || 'An unexpected error occurred.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 bg-gradient-to-tr from-lime-400 via-blue-500 to-purple-600 p-10">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#111827]/40 rounded-2xl shadow-xl ">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500 flex items-center justify-center font-bold text-white text-2xl shadow-md">
//               S
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Sign Up to SmashScore
//           </h1>
//         </div>

//         {/* Login Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50  rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <label htmlFor="password-sr" className="sr-only">
//                 Create Password
//               </label>
//               <input
//                 id="password-sr"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>
//           {error && (
//             <div className="p-3 text-center text-sm text-red-700 bg-red-100 rounded-md">
//               {error}
//             </div>
//           )}
//           {message && (
//             <div className="p-3 text-center text-sm text-green-700 bg-green-100 rounded-md">
//               {message}
//             </div>
//           )}

//           <div>
//             <Button
//               type="submit"
//               variant={'default'}
//               disabled={loading}
//               className="w-full"
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
