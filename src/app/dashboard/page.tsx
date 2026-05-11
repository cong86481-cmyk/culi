'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Wallet,
  ShoppingBag,
  Clock,
  User,
  ArrowRight,
  Package,
  Lock,
  RefreshCw,
  TrendingUp,
  Shield,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  username: string
  email: string
  balance: number
  transferNote: string | null
  createdAt: string
}

interface Purchase {
  id: string
  accountId: string
  price: number
  createdAt: string
  account: {
    title: string
    thumbnail: string | null
    username: string
    password: string
  }
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
}

interface DashboardStats {
  totalSpent: number
  totalDeposits: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats>({ totalSpent: 0, totalDeposits: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [userRes, purchasesRes, transactionsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/purchases'),
        fetch('/api/wallet/transactions'),
      ])

      const userData = await userRes.json()
      const purchasesData = await purchasesRes.json()
      const transactionsData = await transactionsRes.json()

      if (userData.success) setUser(userData.user)
      if (purchasesData.success) {
        setPurchases(purchasesData.data)
        const totalSpent = purchasesData.data.reduce((sum: number, p: Purchase) => sum + p.price, 0)
        setStats(prev => ({ ...prev, totalSpent }))
      }
      if (transactionsData.success) {
        setTransactions(transactionsData.data)
        const totalDeposits = transactionsData.data
          .filter((t: Transaction) => t.type === 'DEPOSIT')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        setStats(prev => ({ ...prev, totalDeposits }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast('error', 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <a href="/auth/login" className="btn-primary">Đăng nhập</a>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Tài khoản của tôi</h1>
              <p className="text-text-secondary">Xem thông tin và quản lý tài khoản</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              isLoading={refreshing}
              aria-label="Làm mới dữ liệu"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
              <p className="text-text-secondary">{user.email}</p>
              <p className="text-sm text-text-muted mt-1">
                Tham gia: {formatDate(user.createdAt)}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/dashboard/change-password" className="btn-ghost text-sm">
                <Shield className="w-4 h-4" />
                Đổi mật khẩu
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Số dư</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(user.balance)}</p>
              </div>
            </div>
            <Link
              href="/wallet"
              className="flex items-center gap-2 text-sm text-primary hover:underline mt-4"
            >
              Nạp thêm tiền
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Tài khoản đã mua</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
            </div>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2 text-sm text-success hover:underline mt-4"
            >
              Xem lịch sử
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Tổng đã chi</p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2 text-sm text-warning hover:underline mt-4"
            >
              Xem chi tiết
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Giao dịch</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
            <Link
              href="/dashboard/deposits"
              className="flex items-center gap-2 text-sm text-secondary hover:underline mt-4"
            >
              Xem chi tiết
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Tài khoản đã mua gần đây</h2>
            <Link href="/dashboard/purchases" className="text-primary hover:underline text-sm">
              Xem tất cả
            </Link>
          </div>

          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.slice(0, 3).map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{purchase.account.title}</p>
                    <p className="text-sm text-text-muted">{formatDate(purchase.createdAt)}</p>
                  </div>
                  <p className="font-bold text-primary flex-shrink-0">{formatPrice(purchase.price)}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <p className="text-lg text-text-secondary mb-2">Bạn chưa mua tài khoản nào</p>
              <p className="text-sm text-text-muted mb-6">Khám phá marketplace để tìm tài khoản phù hợp</p>
              <Link href="/marketplace" className="btn-primary inline-flex items-center gap-2">
                <Package className="w-5 h-5" />
                Khám phá Marketplace
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
