'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Wallet,
  ArrowDownLeft,
  RefreshCw,
  Filter,
  Download,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { TransactionSkeleton } from '@/components/ui/skeleton'

interface Deposit {
  id: string
  amount: number
  method: string
  transferNote: string
  status: string
  createdAt: string
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const fetchDeposits = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet/deposits')
      const data = await res.json()
      if (data.success) {
        setDeposits(data.data)
      } else {
        toast('error', data.error || 'Không thể tải dữ liệu')
      }
    } catch (error) {
      console.error('Failed to fetch deposits:', error)
      toast('error', 'Không thể kết nối server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchDeposits()
  }, [fetchDeposits])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDeposits()
  }

  const filteredDeposits = deposits.filter(deposit => {
    if (statusFilter === 'ALL') return true
    return deposit.status === statusFilter
  })

  const totalDeposited = deposits
    .filter(d => d.status === 'APPROVED')
    .reduce((sum, d) => sum + d.amount, 0)

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Đang chờ' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Từ chối' },
  ]

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="h-8 w-48 bg-surface rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-surface rounded animate-pulse" />
          </motion.div>
          <TransactionSkeleton rows={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Lịch sử nạp tiền</h1>
              <p className="text-text-secondary">
                Tổng đã nạp: <span className="text-success font-bold">{formatPrice(totalDeposited)}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleRefresh}
                isLoading={refreshing}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Làm mới
              </Button>
              <Link href="/wallet">
                <Button leftIcon={<ArrowDownLeft className="w-4 h-4" />}>
                  Nạp tiền
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        {deposits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="card p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-text-muted" />
                  <span className="text-sm text-text-muted">Lọc theo:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value as StatusFilter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === option.value
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-secondary hover:bg-surface/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-text-muted ml-auto">
                  {filteredDeposits.length} yêu cầu
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposits */}
        {filteredDeposits.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-sm text-text-muted font-medium">
              <div className="col-span-4">Thông tin</div>
              <div className="col-span-3">Mã giao dịch</div>
              <div className="col-span-2">Số tiền</div>
              <div className="col-span-2">Trạng thái</div>
            </div>
            <div className="divide-y divide-border">
              {filteredDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-surface/30 transition-colors"
                >
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      deposit.status === 'APPROVED' ? 'bg-success/10' :
                      deposit.status === 'PENDING' ? 'bg-warning/10' : 'bg-error/10'
                    }`}>
                      <Wallet className={`w-5 h-5 ${
                        deposit.status === 'APPROVED' ? 'text-success' :
                        deposit.status === 'PENDING' ? 'text-warning' : 'text-error'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{deposit.method || 'Chuyển khoản'}</p>
                      <p className="text-sm text-text-muted">
                        {formatDate(deposit.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-3 flex items-center">
                    <code className="text-sm bg-surface px-2 py-1 rounded">{deposit.transferNote}</code>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <span className="font-bold text-primary">{formatPrice(deposit.amount)}</span>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <StatusBadge status={deposit.status as any} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : deposits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <Wallet className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h2 className="text-xl font-bold mb-2">Chưa có yêu cầu nạp tiền</h2>
            <p className="text-text-secondary mb-6">Bạn chưa thực hiện yêu cầu nạp tiền nào</p>
            <Link href="/wallet" className="btn-primary inline-flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5" />
              Nạp tiền ngay
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <Filter className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <h2 className="text-lg font-bold mb-2">Không có kết quả</h2>
            <p className="text-text-secondary">Thử chọn bộ lọc khác</p>
            <Button
              variant="ghost"
              onClick={() => setStatusFilter('ALL')}
              className="mt-4"
            >
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
