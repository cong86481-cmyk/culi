'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  image: string
  link?: string
  title?: string
  subtitle?: string
  isActive: boolean
  order: number
}

interface BannerCarouselProps {
  autoPlay?: boolean
  interval?: number
}

const fallbackBanners: Banner[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/gaming1/1920/600',
    link: '/marketplace',
    title: 'CrossFire Legends Marketplace',
    subtitle: 'Nền tảng mua bán tài khoản uy tín số 1 Việt Nam',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/gaming2/1920/600',
    link: '/marketplace',
    title: 'Tài Khoản VIP Chất Lượng',
    subtitle: 'Rank cao, vũ khí hiếm, skin đẹp',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/gaming3/1920/600',
    link: '/auth/register',
    title: 'Đăng ký ngay hôm nay',
    subtitle: 'Nhận ưu đãi nạp tiền lần đầu lên đến 20%',
    isActive: true,
    order: 3,
  },
]

export function BannerCarousel({ autoPlay = true, interval = 4000 }: BannerCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, banners.length])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setBanners(data.data)
      }
      // If no banners in DB, use fallback - already set
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (loading) {
    return (
      <div className="relative h-[300px] md:h-[400px] overflow-hidden" style={{ backgroundColor: '#111118' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <Image
              src={banner.image}
              alt={banner.title || 'Banner'}
              fill
              className="object-cover"
              priority={index === 0}
              unoptimized
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-base md:text-lg text-white/80 mb-4">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="inline-block px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)', boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)' }}
                    >
                      Xem ngay
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[#FF6B00]' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
