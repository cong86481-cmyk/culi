'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  ShoppingBag,
  RefreshCw,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { TransactionSkeleton } from '@/components/ui/skeleton'

interface Purchase {
  id: string
  accountId: string
  price: number
  createdAt: string
  account: {
    id: string
    title: string
    thumbnail: string | null
    username: string
    password: string
    rank: string
    vipLevel: number
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await fetch('/api/purchases')
      const data = await res.json()
      if (data.success) {
        setPurchases(data.data)
      } else {
        toast('error', data.error || 'Không thể tải dữ liệu')
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
      toast('error', 'Không thể kết nối server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchPurchases()
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(field)
      toast('success', 'Đã sao chép vào clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast('error', 'Không thể sao chép')
    }
  }

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleCredentials = (id: string) => {
    setShowCredentials((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="h-8 w-48 bg-surface rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-surface rounded animate-pulse" />
          </motion.div>
          <TransactionSkeleton rows={3} />
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Tài khoản đã mua</h1>
              <p className="text-text-secondary">Xem thông tin các tài khoản đã mua ({purchases.length} tài khoản)</p>
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

        {/* Purchases */}
        {purchases.length > 0 ? (
          <div className="space-y-6">
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{purchase.account.title}</h3>
                    <p className="text-sm text-text-muted">
                      Mua ngày: {formatDate(purchase.createdAt)}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatPrice(purchase.price)}</p>
                </div>

                {/* Account Details */}
                <div className="p-4 rounded-xl bg-surface/50 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="text-sm text-text-muted">Tài khoản</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-background-card px-3 py-1 rounded-lg">
                        {purchase.account.username}
                      </code>
                      <button
                        onClick={() => copyToClipboard(purchase.account.username, `user-${purchase.id}`)}
                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                        aria-label="Sao chép tài khoản"
                      >
                        {copied === `user-${purchase.id}` ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="text-sm text-text-muted">Mật khẩu</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-background-card px-3 py-1 rounded-lg">
                        {showPasswords[purchase.id]
                          ? purchase.account.password
                          : '••••••••'}
                      </code>
                      <button
                        onClick={() => togglePassword(purchase.id)}
                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                        aria-label={showPasswords[purchase.id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPasswords[purchase.id] ? (
                          <EyeOff className="w-4 h-4 text-text-muted" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(purchase.account.password, `pass-${purchase.id}`)}
                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                        aria-label="Sao chép mật khẩu"
                      >
                        {copied === `pass-${purchase.id}` ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Copy All */}
                  <div className="pt-3 border-t border-border">
                    <button
                      onClick={() => toggleCredentials(purchase.id)}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Shield className="w-4 h-4" />
                      {showCredentials[purchase.id] ? 'Ẩn thông tin' : 'Hiện thông tin đăng nhập nhanh'}
                    </button>
                    {showCredentials[purchase.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 p-3 bg-background-card rounded-lg"
                      >
                        <pre className="text-sm whitespace-pre-wrap">
                          {`Tài khoản: ${purchase.account.username}
Mật khẩu: ${purchase.account.password}`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(
                            `Tài khoản: ${purchase.account.username}\nMật khẩu: ${purchase.account.password}`,
                            `all-${purchase.id}`
                          )}
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          Sao chép tất cả
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 flex-wrap text-sm text-text-muted">
                  <span className="px-3 py-1 bg-surface rounded-full">Rank: {purchase.account.rank}</span>
                  {purchase.account.vipLevel > 0 && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                      VIP {purchase.account.vipLevel}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Link href={`/marketplace/${purchase.account.id}`} className="btn-ghost text-sm flex-1 text-center">
                    Xem chi tiết tài khoản
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h2 className="text-xl font-bold mb-2">Chưa có tài khoản nào</h2>
            <p className="text-text-secondary mb-6">Bạn chưa mua tài khoản nào từ cửa hàng</p>
            <Link href="/marketplace" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Khám phá Marketplace
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
