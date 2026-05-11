'use client'

import { useState } from 'react'
import { Shield, Zap, Gift, Clock, BadgeCheck, TrendingUp, Headphones } from 'lucide-react'

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const features = [
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Bảo mật thông tin 100%, giao dịch có hợp đồng rõ ràng',
      color: '#FF6B00',
      bg: 'rgba(255,107,0,0.1)',
    },
    {
      icon: Zap,
      title: 'Giao dịch tức thì',
      description: 'Nhận thông tin tài khoản ngay sau khi thanh toán thành công',
      color: '#FBBF24',
      bg: 'rgba(251,191,36,0.1)',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc',
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      icon: Gift,
      title: 'Ưu đãi hấp dẫn',
      description: 'Nhiều chương trình khuyến mãi và quà tặng cho thành viên',
      color: '#EC4899',
      bg: 'rgba(236,72,153,0.1)',
    },
  ]

  return (
    <section className="py-20 relative" style={{ backgroundColor: '#0D0D14' }}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl" 
        style={{ background: '#FF6B00', filter: 'blur(100px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" 
        style={{ background: '#DC2626', filter: 'blur(100px)' }} />
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" 
            style={{ backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}>
            <BadgeCheck className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-sm font-medium text-[#FF6B00]">Đáng tin cậy</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn <span style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CFL Marketplace</span>?
          </h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto text-lg">
            Chúng tôi cung cấp dịch vụ mua bán tài khoản CrossFire Legends an toàn, nhanh chóng và tiện lợi nhất
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
              style={{ 
                backgroundColor: '#1A1A24', 
                border: `1px solid ${hoveredIndex === index ? feature.color : '#2D2D3A'}`,
                boxShadow: hoveredIndex === index ? `0 0 30px ${feature.color}20` : 'none'
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: feature.bg }}
              >
                <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#A1A1AA] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, text: 'Bảo mật SSL' },
            { icon: BadgeCheck, text: 'Đã xác minh' },
            { icon: TrendingUp, text: '10K+ Giao dịch' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-[#71717A]">
              <badge.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
