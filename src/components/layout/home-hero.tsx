'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Crown, Shield, CheckCircle, Star, TrendingUp, Zap } from 'lucide-react'

const trustBadges = [
  { icon: Shield, label: 'Bảo mật', value: '256-bit SSL' },
  { icon: CheckCircle, label: 'Đã xác minh', value: '5000+ TK' },
  { icon: Star, label: 'Đánh giá', value: '4.9/5 sao' },
  { icon: TrendingUp, label: 'Giao dịch', value: '10K+' },
]

export function HomeHero() {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#111118] to-[#0A0A0F]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#FF6B00]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#DC2626]/10 blur-[100px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6B00]/10 backdrop-blur-sm mb-8 border border-[#FF6B00]/30"
          >
            <Crown className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-[#FF6B00] text-sm font-semibold">CrossFire Legends Vietnam</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Mua Bán Tài Khoản</span>
            <br />
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#DC2626] bg-clip-text text-transparent">
              CrossFire Legends
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#A1A1AA] mb-10 max-w-2xl mx-auto"
          >
            Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam. 
            An toàn, nhanh chóng, giá tốt với hàng ngàn tài khoản chất lượng.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link 
              href="/marketplace" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)', boxShadow: '0 0 30px rgba(255, 107, 0, 0.4)' }}
            >
              <span>Xem Marketplace</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-[#2D2D3A] hover:border-[#FF6B00] transition-all hover:bg-[#252532]"
              style={{ backgroundColor: '#1A1A24' }}
            >
              Đăng ký miễn phí
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(26, 26, 36, 0.8)', border: '1px solid rgba(45, 45, 58, 0.5)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 107, 0, 0.2)' }}>
                  <badge.icon className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-[#71717A]">{badge.label}</p>
                  <p className="font-semibold text-sm text-white">{badge.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
    </section>
  )
}
