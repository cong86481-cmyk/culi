import Link from 'next/link'
import { ArrowRight, ShoppingBag, Crown, Users, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AccountCard } from '@/components/marketplace/account-card'
import { BannerCarousel } from '@/components/layout/banner-carousel'
import { AnimatedStats } from '@/components/ui/animated-stats'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { FeaturesSection } from '@/components/home/features-section'
import { CTASection } from '@/components/home/cta-section'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const [featuredAccounts, latestAccounts, stats] = await Promise.all([
    prisma.account.findMany({
      where: { status: 'AVAILABLE', featured: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.account.findMany({
      where: { status: 'AVAILABLE' },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    Promise.all([
      prisma.account.count({ where: { status: 'AVAILABLE' } }),
      prisma.account.count({ where: { status: 'SOLD' } }),
      prisma.user.count(),
      prisma.purchase.count(),
    ]),
  ])

  return {
    featuredAccounts,
    latestAccounts,
    stats: {
      availableAccounts: stats[0],
      soldAccounts: stats[1],
      totalUsers: stats[2],
      totalPurchases: stats[3],
    },
  }
}

export default async function HomePage() {
  const { featuredAccounts, latestAccounts, stats } = await getHomeData()

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Stats Section with Animation */}
      <section className="py-16 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.3) 0%, transparent 70%)' }} />
        
        <div className="relative container mx-auto px-4">
          <AnimatedStats stats={stats} />
        </div>
      </section>

      {/* Featured Accounts */}
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
                  account={{
                    ...account,
                    characters: JSON.parse(account.characters),
                    backpack: JSON.parse(account.backpack),
                    images: JSON.parse(account.images),
                  }}
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Latest Accounts */}
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
                account={{
                  ...account,
                  characters: JSON.parse(account.characters),
                  backpack: JSON.parse(account.backpack),
                  images: JSON.parse(account.images),
                }}
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

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
