'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { AccountCard } from '@/components/marketplace/account-card'
import { MarketplaceFilters, type FilterState } from '@/components/marketplace/filters'
import { Pagination } from '@/components/ui/pagination'
import { AccountCardSkeleton } from '@/components/ui/skeleton'
import type { Account, Category } from '@/types'

function MarketplaceContent() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    rank: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  })
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 1,
    total: 0,
  })

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('pageSize', '12')
      if (filters.search) params.set('search', filters.search)
      if (filters.category) params.set('category', filters.category)
      if (filters.rank) params.set('rank', filters.rank)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.set('sortBy', filters.sortBy)

      const res = await fetch(`/api/accounts?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setAccounts(data.data.items)
        setPagination({
          totalPages: data.data.totalPages,
          total: data.data.total,
        })
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-text-secondary">
          Khám phá hàng trăm tài khoản CrossFire Legends chất lượng cao
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-8">
        <MarketplaceFilters categories={categories} onFilterChange={handleFilterChange} />
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6 text-text-secondary">
          Tìm thấy <span className="text-white font-semibold">{pagination.total}</span> tài khoản
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <AccountCardSkeleton key={i} />
          ))
        ) : accounts.length > 0 ? (
          accounts.map((account, index) => (
            <AccountCard key={account.id} account={account} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-text-muted">Không tìm thấy tài khoản nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  )
}

export default function MarketplacePage() {
  return (
    <div className="pt-24 pb-16" style={{ backgroundColor: '#0A0A0F', minHeight: '100vh' }}>
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="pt-24 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <MarketplaceContent />
        </Suspense>
      </div>
    </div>
  )
}
