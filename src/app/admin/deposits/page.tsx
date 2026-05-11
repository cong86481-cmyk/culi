'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Wallet, User, DollarSign, RefreshCw, Filter, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { TransactionSkeleton } from '@/components/ui/skeleton'

interface Deposit {
  id: string
  userId: string
  amount: number
  method: string
  transferNote: string
  status: string
  createdAt: string
  user: {
    id: string
    username: string
    email: string
  }
}

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const fetchDeposits = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/deposits')
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

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id)
    try {
      const res = await fetch(`/api/admin/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', action === 'approve' ? 'Đã duyệt yêu cầu' : 'Đã từ chối yêu cầu')
      fetchDeposits()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    } finally {
      setProcessing(null)
    }
  }

  const filteredDeposits = deposits.filter(deposit => {
    if (statusFilter === 'ALL') return true
    return deposit.status === statusFilter
  })

  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING')
  const processedDeposits = deposits.filter((d) => d.status !== 'PENDING')

  const totalPending = pendingDeposits.reduce((sum, d) => sum + d.amount, 0)
  const totalApproved = deposits.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0)

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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Quản lý nạp tiền</h1>
              <p className="text-text-secondary">Duyệt hoặc từ chối yêu cầu nạp tiền</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              isLoading={refreshing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Làm mới
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Chờ duyệt</p>
                <p className="text-2xl font-bold">{pendingDeposits.length} yêu cầu</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Tổng chờ duyệt</p>
                <p className="text-2xl font-bold text-warning">{formatPrice(totalPending)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Đã duyệt (tổng)</p>
                <p className="text-2xl font-bold text-success">{formatPrice(totalApproved)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pending Deposits */}
        {pendingDeposits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <h2 className="text-xl font-bold">Yêu cầu chờ duyệt</h2>
              <Badge variant="warning" dot pulse>{pendingDeposits.length} mới</Badge>
            </div>

            <div className="space-y-4">
              {pendingDeposits.map((deposit) => (
                <div key={deposit.id} className="card border-warning/30">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-7 h-7 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xl text-primary">{formatPrice(deposit.amount)}</p>
                        <div className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{deposit.user?.username || 'Unknown'}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{deposit.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-1 flex-wrap">
                          <Wallet className="w-4 h-4 flex-shrink-0" />
                          <code className="bg-surface px-2 py-0.5 rounded">{deposit.transferNote}</code>
                          <span>•</span>
                          <span>{formatDate(deposit.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 lg:flex-shrink-0">
                      <Button
                        variant="secondary"
                        onClick={() => handleAction(deposit.id, 'reject')}
                        disabled={processing === deposit.id}
                        className="text-error border-error/30 hover:bg-error/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button
                        onClick={() => handleAction(deposit.id, 'approve')}
                        disabled={processing === deposit.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Duyệt
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Deposits / History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2 className="text-xl font-bold">Lịch sử giao dịch</h2>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-text-muted" />
              <div className="flex gap-2 flex-wrap">
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
            </div>
          </div>

          <div className="card">
            {filteredDeposits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Người dùng</th>
                      <th className="text-left p-4 font-semibold">Số tiền</th>
                      <th className="text-left p-4 font-semibold hidden md:table-cell">Mã GD</th>
                      <th className="text-left p-4 font-semibold hidden lg:table-cell">Ngày</th>
                      <th className="text-left p-4 font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeposits.map((deposit) => (
                      <tr key={deposit.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-white">{deposit.user?.username?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{deposit.user?.username || 'Unknown'}</p>
                              <p className="text-xs text-text-muted truncate hidden sm:block">{deposit.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-primary">{formatPrice(deposit.amount)}</span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <code className="text-sm bg-surface px-2 py-1 rounded">{deposit.transferNote}</code>
                        </td>
                        <td className="p-4 text-text-muted text-sm hidden lg:table-cell">
                          {formatDate(deposit.createdAt)}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={deposit.status as any} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                <p className="text-text-secondary">Không có yêu cầu nào</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
