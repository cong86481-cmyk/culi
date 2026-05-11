'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types'

interface FiltersProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  category: string
  rank: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

export function MarketplaceFilters({ categories, onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    rank: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const saveSearch = (term: string) => {
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search.length >= 2) {
        saveSearch(filters.search)
      }
      onFilterChange(filters)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [filters])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const ranks = [
    { value: '', label: 'Tất cả rank' },
    { value: 'Đồng', label: 'Đồng' },
    { value: 'Bạc', label: 'Bạc' },
    { value: 'Vàng', label: 'Vàng' },
    { value: 'Bạch Kim', label: 'Bạch Kim' },
    { value: 'Kim Cương', label: 'Kim Cương' },
    { value: 'Cao Thủ', label: 'Cao Thủ' },
    { value: 'Chiến Thần', label: 'Chiến Thần' },
    { value: 'Thách Đấu', label: 'Thách Đấu' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'cheapest', label: 'Giá thấp nhất' },
    { value: 'expensive', label: 'Giá cao nhất' },
    { value: 'vip', label: 'VIP cao nhất' },
  ]

  const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      rank: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const hasActiveFilters = filters.category || filters.rank || filters.minPrice || filters.maxPrice

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3" ref={searchRef}>
        <div className="flex-1 relative">
          <Input
            placeholder="Tìm kiếm tài khoản..."
            icon={<Search className="w-5 h-5" />}
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value })
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <AnimatePresence>
            {showSuggestions && (recentSearches.length > 0 || filters.search.length >= 2) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A24] border border-[#2D2D3A] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {recentSearches.length > 0 && !filters.search && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-muted">Tìm kiếm gần đây</span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-primary hover:underline"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFilters({ ...filters, search: term })
                          setShowSuggestions(false)
                        }}
                        className="flex items-center gap-2 w-full p-2 text-sm text-text-secondary hover:bg-surface rounded-lg transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        {term}
                      </button>
                    ))}
                  </div>
                )}
                {filters.search.length >= 2 && (
                  <button
                    onClick={() => {
                      setShowSuggestions(false)
                    }}
                    className="flex items-center gap-2 w-full p-3 text-sm border-t border-[#2D2D3A] text-primary hover:bg-surface transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Tìm "{filters.search}"
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Bộ lọc
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Danh mục"
              options={categoryOptions}
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              placeholder="Chọn danh mục"
            />
            <Select
              label="Rank"
              options={ranks}
              value={filters.rank}
              onChange={(e) => setFilters({ ...filters, rank: e.target.value })}
              placeholder="Chọn rank"
            />
            <Input
              label="Giá từ"
              type="number"
              placeholder="VD: 100000"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <Input
              label="Giá đến"
              type="number"
              placeholder="VD: 500000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <Select
              label="Sắp xếp"
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-48"
            />
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile Sort */}
      <div className="flex md:hidden">
        <Select
          options={sortOptions}
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="flex-1"
        />
      </div>
    </div>
  )
}
