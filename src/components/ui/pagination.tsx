'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
  onPageSizeChange?: (size: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 12,
  totalItems,
  onPageSizeChange,
}: PaginationProps) {
  const [isHovering, setIsHovering] = useState(false)

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const showEllipsisStart = currentPage > 4
    const showEllipsisEnd = currentPage < totalPages - 3

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (showEllipsisStart) {
        pages.push(2)
        pages.push('start-ellipsis')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (showEllipsisEnd) {
        pages.push('end-ellipsis')
        pages.push(totalPages - 1)
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || totalPages * pageSize)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Page info */}
      {totalItems !== undefined && (
        <p className="text-sm text-text-muted order-2 sm:order-1">
          Hiển thị <span className="text-white font-medium">{startItem}</span> -{' '}
          <span className="text-white font-medium">{endItem}</span> của{' '}
          <span className="text-white font-medium">{totalItems}</span> kết quả
        </p>
      )}

      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* First & Previous */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-all',
            currentPage === 1
              ? 'text-text-muted cursor-not-allowed opacity-50'
              : 'text-text-secondary hover:bg-surface hover:text-white'
          )}
          aria-label="Trang đầu tiên"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-all',
            currentPage === 1
              ? 'text-text-muted cursor-not-allowed opacity-50'
              : 'text-text-secondary hover:bg-surface hover:text-white'
          )}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => {
            if (page === 'start-ellipsis' || page === 'end-ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-text-muted">
                  ...
                </span>
              )
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'w-10 h-10 rounded-lg font-medium transition-all',
                  currentPage === page
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-text-secondary hover:bg-surface hover:text-white'
                )}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next & Last */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-all',
            currentPage === totalPages
              ? 'text-text-muted cursor-not-allowed opacity-50'
              : 'text-text-secondary hover:bg-surface hover:text-white'
          )}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-all',
            currentPage === totalPages
              ? 'text-text-muted cursor-not-allowed opacity-50'
              : 'text-text-secondary hover:bg-surface hover:text-white'
          )}
          aria-label="Trang cuối"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-sm text-text-muted">Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={6}>6 / trang</option>
            <option value={12}>12 / trang</option>
            <option value={24}>24 / trang</option>
            <option value={48}>48 / trang</option>
          </select>
        </div>
      )}
    </div>
  )
}
