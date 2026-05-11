'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  ShoppingBag,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Image,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Package,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Badge, StatusBadge } from '@/components/ui/badge'

interface Stats {
  totalUsers: number
  totalAvailableAccounts: number
  totalSoldAccounts: number
  pendingDeposits: number
  totalRevenue: number
  recentPurchases: any[]
  recentDeposits: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      } else {
        toast('error', data.error || 'Không thể tải dữ liệu')
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      toast('error', 'Không thể kết nối server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      icon: DollarSign,
      label: 'Tổng doanh thu',
      value: formatPrice(stats?.totalRevenue || 0),
      color: 'success',
      bg: 'bg-success/10',
    },
    {
      icon: Users,
      label: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      color: 'primary',
      bg: 'bg-primary/10',
    },
    {
      icon: ShoppingBag,
      label: 'Tài khoản đã bán',
      value: stats?.totalSoldAccounts || 0,
      color: 'warning',
      bg: 'bg-warning/10',
    },
    {
      icon: Wallet,
      label: 'Yêu cầu nạp tiền',
      value: stats?.pendingDeposits || 0,
      color: 'secondary',
      bg: 'bg-secondary/10',
      link: '/admin/deposits',
      badge: stats?.pendingDeposits ? { count: stats.pendingDeposits, variant: 'warning' as const } : null,
    },
  ]

  const quickLinks = [
    { href: '/admin/accounts', label: 'Quản lý tài khoản', icon: ShoppingBag, color: 'primary' },
    { href: '/admin/banners', label: 'Quản lý Banner', icon: Image, color: 'secondary' },
    { href: '/admin/users', label: 'Quản lý người dùng', icon: Users, color: 'success' },
    { href: '/admin/settings', label: 'Cài đặt website', icon: Wallet, color: 'warning' },
  ]

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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-text-secondary">Quản lý cửa hàng và người dùng</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {stat.link ? (
                <Link href={stat.link} className="block">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                    {stat.badge && (
                      <Badge variant={stat.badge.variant} size="sm" dot pulse>
                        {stat.badge.count} mới
                      </Badge>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="card card-hover flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-${link.color}/10 flex items-center justify-center`}>
                  <link.icon className={`w-6 h-6 text-${link.color}`} />
                </div>
                <span className="font-semibold">{link.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <h2 className="text-xl font-bold">Mua hàng gần đây</h2>
              </div>
              <Link href="/admin/accounts" className="text-primary text-sm hover:underline">
                Xem tất cả
              </Link>
            </div>

            {stats?.recentPurchases && stats.recentPurchases.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPurchases.slice(0, 5).map((purchase: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <ArrowDownRight className="w-5 h-5 text-success" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{purchase.account?.title || 'Tài khoản'}</p>
                        <p className="text-xs text-text-muted">{purchase.user?.username}</p>
                      </div>
                    </div>
                    <p className="font-bold text-success flex-shrink-0 ml-4">{formatPrice(purchase.price)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                <p className="text-text-secondary">Chưa có giao dịch nào</p>
              </div>
            )}
          </motion.div>

          {/* Recent Deposits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Yêu cầu nạp tiền gần đây</h2>
              </div>
              <Link href="/admin/deposits" className="text-primary text-sm hover:underline">
                Xem tất cả
              </Link>
            </div>

            {stats?.recentDeposits && stats.recentDeposits.length > 0 ? (
              <div className="space-y-3">
                {stats.recentDeposits.slice(0, 5).map((deposit: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{deposit.user?.username}</p>
                        <p className="text-xs text-text-muted">{formatDate(deposit.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-primary">{formatPrice(deposit.amount)}</p>
                      <StatusBadge status={deposit.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 mx-auto mb-3 text-text-muted" />
                <p className="text-text-secondary">Chưa có yêu cầu nào</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
