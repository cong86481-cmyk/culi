'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Star } from 'lucide-react'
import { AccountCard } from '@/components/marketplace/account-card'
import { BannerCarousel } from '@/components/layout/banner-carousel'
import { AnimatedStats } from '@/components/ui/animated-stats'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { FeaturesSection } from '@/components/home/features-section'
import { CTASection } from '@/components/home/cta-section'
import type { Account } from '@/types'

interface Stats {
  availableAccounts: number
  soldAccounts: number
  totalUsers: number
  totalPurchases: number
}

export default function HomePage() {
  const [featuredAccounts, setFeaturedAccounts] = useState<Account[]>([])
  const [latestAccounts, setLatestAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<Stats>({
    availableAccounts: 0,
    soldAccounts: 0,
    totalUsers: 0,
    totalPurchases: 0,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [accountsRes, bannersRes] = await Promise.all([
          fetch('/api/accounts?pageSize=8'),
          fetch('/api/banners'),
        ])
        
        const accountsData = await accountsRes.json()
        if (accountsData.success) {
          setFeaturedAccounts(accountsData.data.items.filter((a: Account) => a.featured).slice(0, 4))
          setLatestAccounts(accountsData.data.items.slice(0, 8))
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0A0A0F' }}>
      <FloatingParticles />

      <BannerCarousel />

      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.3) 0%, transparent 70%)' }} />
        
        <div className="relative container mx-auto px-4">
          <AnimatedStats stats={stats} />
        </div>
      </section>

      {featuredAccounts.length > 0 && (
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B00]/5 to-transparent" />
          <div className="relative container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" 
                    style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)', color: 'white' }}>
                    <Star className="w-3 h-3" />
                    Nổi bật
                  </div>
                  <span className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #FF6B00 0%, #DC2626 100%)' }} />
                  <h2 className="text-2xl md:text-3xl font-bold">Tài khoản VIP</h2>
                </div>
                <p className="text-[#A1A1AA]">Những tài khoản chất lượng cao, rank elite</p>
              </div>
              <Link href="/marketplace?featured=true" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 group" 
                style={{ backgroundColor: '#252532', border: '1px solid #2D2D3A' }}>
                Xem tất cả
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAccounts.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  featured
                />
              ))}
            </div>
            <Link href="/marketplace" className="mt-8 mx-auto md:hidden flex w-fit items-center gap-2 px-6 py-3 rounded-xl" 
              style={{ backgroundColor: '#252532', border: '1px solid #2D2D3A' }}>
              Xem tất cả tài khoản
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <FeaturesSection />

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF6B00]/5" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #FF6B00 0%, #DC2626 100%)' }} />
                <h2 className="text-2xl md:text-3xl font-bold">Tài khoản mới nhất</h2>
                <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Live</span>
              </div>
              <p className="text-[#A1A1AA]">Cập nhật tài khoản mới liên tục mỗi ngày</p>
            </div>
            <Link href="/marketplace" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 group" 
              style={{ backgroundColor: '#252532', border: '1px solid #2D2D3A' }}>
              Xem tất cả
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestAccounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                index={index}
              />
            ))}
          </div>
          {latestAccounts.length === 0 && (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'rgba(26, 26, 36, 0.5)', border: '1px solid #2D2D3A' }}>
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#71717A]" />
              <h3 className="text-xl font-semibold mb-2">Chưa có tài khoản nào</h3>
              <p className="text-[#A1A1AA]">Hãy quay lại sau để xem các tài khoản mới</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  )
}
