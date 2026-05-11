'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Shield, Zap, Gift, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, parseJSON } from '@/lib/utils'
import type { Account } from '@/types'

interface PurchaseModalProps {
  account: Account
  userBalance: number
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PurchaseModal({ account, userBalance, isOpen, onClose, onSuccess }: PurchaseModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const canAfford = userBalance >= account.price
  const characters = parseJSON<string[]>(account.characters, [])
  const backpack = parseJSON<string[]>(account.backpack, [])

  const handlePurchase = async () => {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/purchase/${account.id}`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.error || 'Mua thất bại')
        return
      }

      setPurchased(true)
      onSuccess()
    } catch (error) {
      alert('Đã xảy ra lỗi khi mua')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-background-card rounded-3xl border border-border shadow-2xl overflow-hidden"
        >
          {!purchased ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold">Xác nhận mua tài khoản</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Account Info */}
                <div className="p-4 rounded-xl bg-surface/50">
                  <h3 className="font-semibold mb-2">{account.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>Rank {account.rank}</span>
                    {account.vipLevel > 0 && (
                      <Badge variant="primary" size="sm">VIP {account.vipLevel}</Badge>
                    )}
                  </div>
                </div>

                {/* Price & Balance */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="text-sm text-text-muted">Giá tài khoản</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(account.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">Số dư của bạn</p>
                    <p className="text-xl font-semibold">{formatPrice(userBalance)}</p>
                  </div>
                </div>

                {/* Warning */}
                {!canAfford && (
                  <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning">
                    <p className="text-sm">
                      Số dư không đủ. Vui lòng{' '}
                      <a href="/wallet" className="underline font-semibold">nạp thêm tiền</a>{' '}
                      để tiếp tục.
                    </p>
                  </div>
                )}

                {canAfford && (
                  <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success">
                    <p className="text-sm flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Bạn có đủ số dư để mua tài khoản này
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-3">
                <Button variant="secondary" onClick={onClose} className="flex-1">
                  Hủy
                </Button>
                <Button
                  onClick={handlePurchase}
                  isLoading={isLoading}
                  disabled={!canAfford}
                  className="flex-1"
                >
                  Xác nhận mua
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-success" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Mua tài khoản thành công!</h2>
                <p className="text-text-secondary mb-6">
                  Thông tin tài khoản đã được lưu vào lịch sử mua hàng
                </p>

                {/* Account Credentials */}
                <div className="space-y-3 text-left">
                  <div className="p-4 rounded-xl bg-surface/50 space-y-2">
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                      <User className="w-4 h-4" />
                      <span>Tài khoản</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-white font-mono">{account.username}</code>
                      <button
                        onClick={() => copyToClipboard(account.username, 'username')}
                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                      >
                        {copied === 'username' ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface/50 space-y-2">
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Mật khẩu</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-white font-mono">{account.password}</code>
                      <button
                        onClick={() => copyToClipboard(account.password, 'password')}
                        className="p-2 hover:bg-surface rounded-lg transition-colors"
                      >
                        {copied === 'password' ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button onClick={() => router.push('/dashboard/purchases')} className="w-full mt-6">
                  Xem lịch sử mua hàng
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function User(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.className?.split(' ')[1] || "24"} height={props.className?.split(' ')[1] || "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}
