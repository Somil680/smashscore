// components/TournamentPagination.tsx
'use client'

import React from 'react'
import useTournamentStore, { PAGE_SIZE } from '@/store/useTournamentStore' // Adjust path
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination' // Assuming you have shadcn/ui installed
import { useAuthStore } from '@/store/useAuthStore'

export function TournamentPagination() {
  const { currentPage, totalTournaments, fetchTournaments, loading } =
    useTournamentStore()
  const user = useAuthStore((s) => s.user)

  const totalPages = Math.ceil(totalTournaments / PAGE_SIZE)

  // This is the fix: During the initial load, totalTournaments is 0.
  // We should wait until loading is false before deciding to hide the component.
  if (totalPages <= 1 && !loading) {
    return null // Don't show pagination if there's only one page and we are not loading.
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      if (!user) return // If user is not logged in, do not fetch tournaments
      fetchTournaments(user?.id, currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      if (!user) return // If user is not logged in, do not fetch tournaments

      fetchTournaments(user?.id, currentPage + 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    if (!user) return // If user is not logged in, do not fetch tournaments
    fetchTournaments(user?.id, pageNumber - 1) // UI is 1-based, store is 0-based
  }

  // Basic logic to render page numbers (can be made more complex)
  const renderPageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage + 1}
            onClick={(e) => {
              e.preventDefault()
              if (!loading) handlePageClick(i)
            }}
            aria-disabled={loading}
            className={loading ? 'pointer-events-none text-gray-400' : ''}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pageNumbers
  }

  // If loading and there are no pages yet, you can optionally show a skeleton/loader
  if (loading && totalPages === 0) {
    return (
      <div className="h-10 w-full animate-pulse bg-gray-200 rounded-md"></div>
    )
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePrevious()
            }}
            aria-disabled={currentPage === 0 || loading}
            className={
              currentPage === 0 || loading
                ? 'pointer-events-none text-gray-400'
                : ''
            }
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleNext()
            }}
            aria-disabled={currentPage >= totalPages - 1 || loading}
            className={
              currentPage >= totalPages - 1 || loading
                ? 'pointer-events-none text-gray-400'
                : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
