'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Crown, Star, Eye, Clock, TrendingUp } from 'lucide-react'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import type { Account } from '@/types'

interface AccountCardProps {
  account: Account
  index?: number
  featured?: boolean
}

export function AccountCard({ account, index = 0, featured = false }: AccountCardProps) {
  const isSold = account.status === 'SOLD'
  const isFeatured = account.featured
  const isHot = account.vipLevel >= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/marketplace/${account.id}`}>
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#FF6B00]/20 ${
          isSold ? 'opacity-70' : featured 
            ? 'border-2 hover:border-[#FF6B00] shadow-lg shadow-[#FF6B00]/20' 
            : 'border hover:border-[#FF6B00]/50'
        }`} style={{ backgroundColor: '#1A1A24' }}>
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to right, rgba(255,107,0,0.5), rgba(161,161,170,0.5), rgba(255,107,0,0.5))', padding: '1px' }}>
              <div className="w-full h-full rounded-2xl" style={{ backgroundColor: '#1A1A24' }} />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="relative h-52 overflow-hidden">
            {account.thumbnail ? (
              <Image
                src={account.thumbnail}
                alt={account.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <Crown className="w-20 h-20 text-primary/50" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #1A1A24 0%, transparent 50%)' }} />

            {/* Status Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {isFeatured && !isSold && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)' }}
                  >
                    <Star className="w-3 h-3" />
                    Nổi bật
                  </motion.div>
                )}
                {isHot && !isSold && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold animate-pulse"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    <Zap className="w-3 h-3" />
                    HOT
                  </motion.div>
                )}
              </div>

              {/* VIP Badge */}
              {account.vipLevel > 0 && !isSold && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,107,0,0.5)' }}>
                  <Crown className="w-4 h-4" style={{ color: '#FF6B00' }} />
                  <span className="font-bold text-sm" style={{ color: '#FF6B00' }}>VIP {account.vipLevel}</span>
                </div>
              )}
            </div>

            {/* Sold Overlay */}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#EF4444' }}>ĐÃ BÁN</div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Tài khoản đã có chủ nhân mới</p>
                </div>
              </div>
            )}

            {/* Hover Quick View */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,107,0,0.2)', backdropFilter: 'blur(2px)' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-xl"
                style={{ backgroundColor: 'white', color: '#0A0A0F' }}
              >
                <Eye className="w-5 h-5" />
                Xem chi tiết
              </motion.div>
            </div>

            {/* Urgency Indicator - Limited */}
            {!isSold && account.vipGuns >= 5 && (
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-sm text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#FBBF24' }}>
                  <TrendingUp className="w-3 h-3" />
                  Collection hiếm
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative p-5">
            {/* Title */}
            <h3 className="font-bold text-lg line-clamp-2 transition-colors mb-3 min-h-[3.5rem]" style={{ color: '#fff' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B00'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
            >
              {account.title}
            </h3>

            {/* Price & Rank */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {formatPrice(account.price)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#252532' }}>
                <span style={{ color: '#A1A1AA' }}>Rank</span>
                <span className="font-semibold" style={{ color: '#FF6B00' }}>{account.rank}</span>
              </div>
            </div>

            {/* Stats Grid */}
            {account.description && (
              <p className="text-sm text-[#A1A1AA] line-clamp-2 mb-4">
                {account.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(45, 45, 58, 0.5)' }}>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#71717A' }}>
                <Clock className="w-3 h-3" />
                {formatRelativeTime(account.createdAt)}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF6B00' }}>
                Xem ngay
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
