'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Crown,
  Sword,
  Shirt,
  User,
  Calendar,
  Shield,
  Copy,
  Check,
  ArrowLeft,
  Eye,
  EyeOff,
  ShoppingCart,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate, parseJSON } from '@/lib/utils'
import { PurchaseModal } from '@/components/marketplace/purchase-modal'
import type { Account } from '@/types'

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch(`/api/accounts/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setAccount(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch account:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }

    fetchAccount()
    fetchUser()
  }, [params.id])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy tài khoản</h1>
          <Link href="/marketplace" className="btn-primary">
            Quay lại Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const isSold = account.status === 'SOLD'
  const images = Array.isArray(account.images) ? account.images : []
  const characters = parseJSON<string[]>(account.characters, [])
  const backpack = parseJSON<string[]>(account.backpack, [])

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-0 overflow-hidden"
            >
              <div className="relative h-[300px] md:h-[400px]">
                {account.thumbnail || images[0] ? (
                  <Image
                    src={account.thumbnail || images[0]}
                    alt={account.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Crown className="w-24 h-24 text-primary/50" />
                  </div>
                )}

                {/* Status Overlay */}
                {isSold && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-4xl font-bold text-error">ĐÃ BÁN</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {account.featured && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Nổi bật
                    </Badge>
                  )}
                  {account.vipLevel > 0 && (
                    <Badge variant="primary" className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      VIP {account.vipLevel}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-bold mb-4">Thông tin tài khoản</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="flex items-center gap-2 text-text-muted mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Rank</span>
                  </div>
                  <p className="font-bold text-lg">{account.rank}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="flex items-center gap-2 text-text-muted mb-1">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">VIP</span>
                  </div>
                  <p className="font-bold text-lg">Level {account.vipLevel}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="flex items-center gap-2 text-text-muted mb-1">
                    <Sword className="w-4 h-4" />
                    <span className="text-sm">VVIP Guns</span>
                  </div>
                  <p className="font-bold text-lg">{account.vipGuns}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface/50">
                  <div className="flex items-center gap-2 text-text-muted mb-1">
                    <Sword className="w-4 h-4" />
                    <span className="text-sm">Legendary</span>
                  </div>
                  <p className="font-bold text-lg">{account.legendaryGuns}</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-bold mb-4">Mô tả</h2>
              <p className="text-text-secondary whitespace-pre-line">{account.description}</p>
            </motion.div>

            {/* Characters */}
            {characters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h2 className="text-xl font-bold mb-4">Nhân vật</h2>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char, index) => (
                    <Badge key={index} variant="secondary">
                      <User className="w-3 h-3 mr-1" />
                      {char}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Backpack */}
            {backpack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h2 className="text-xl font-bold mb-4">Túi đồ</h2>
                <div className="flex flex-wrap gap-2">
                  {backpack.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      <Shirt className="w-3 h-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card sticky top-24"
            >
              <h1 className="text-2xl font-bold mb-4">{account.title}</h1>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">{formatPrice(account.price)}</p>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-surface/50 text-center">
                  <p className="text-2xl font-bold">{account.skins}</p>
                  <p className="text-xs text-text-muted">Skins</p>
                </div>
                <div className="p-3 rounded-lg bg-surface/50 text-center">
                  <p className="text-2xl font-bold">{characters.length}</p>
                  <p className="text-xs text-text-muted">Nhân vật</p>
                </div>
              </div>

              {/* Buy Button */}
              {!isSold ? (
                user ? (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="w-full mb-4"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Mua ngay
                  </Button>
                ) : (
                  <Link href="/auth/login" className="block">
                    <Button className="w-full mb-4" size="lg">
                      Đăng nhập để mua
                    </Button>
                  </Link>
                )
              ) : (
                <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-center text-error font-semibold mb-4">
                  Tài khoản đã được bán
                </div>
              )}

              {/* Account Credentials (for purchased accounts - show only if user bought) */}
              {isSold && user && (
                <div className="space-y-3 p-4 rounded-xl bg-surface/50 mb-4">
                  <h3 className="font-semibold text-sm text-text-muted">Thông tin tài khoản</h3>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Tài khoản</p>
                    <div className="flex items-center justify-between bg-background-card p-2 rounded-lg">
                      <code className="text-sm">{account.username}</code>
                      <button
                        onClick={() => copyToClipboard(account.username, 'username')}
                        className="p-1 hover:bg-surface rounded transition-colors"
                      >
                        {copied === 'username' ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Mật khẩu</p>
                    <div className="flex items-center justify-between bg-background-card p-2 rounded-lg">
                      <code className="text-sm">{showPassword ? account.password : '••••••••'}</code>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 hover:bg-surface rounded transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-text-muted" />
                          ) : (
                            <Eye className="w-4 h-4 text-text-muted" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(account.password, 'password')}
                          className="p-1 hover:bg-surface rounded transition-colors"
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
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Calendar className="w-4 h-4" />
                <span>Đăng ngày: {formatDate(account.createdAt)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {user && (
        <PurchaseModal
          account={account}
          userBalance={user.balance}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
