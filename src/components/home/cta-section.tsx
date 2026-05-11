'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Zap, Gift, Clock } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)' }} />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-50 blur-3xl" style={{ background: 'white', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/2 right-1/4 w-48 h-48 rounded-full opacity-50 blur-3xl" style={{ background: 'white', filter: 'blur(80px)' }} />
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-pulse" 
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          <Gift className="w-4 h-4 text-white" />
          <span className="text-white/90 text-sm font-medium">Ưu đãi đặc biệt cho thành viên mới</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Sẵn sàng để bắt đầu?
        </h2>
        <p className="text-white/80 mb-10 max-w-xl mx-auto text-xl">
          Đăng ký ngay hôm nay và nhận ưu đãi nạp tiền lần đầu lên đến <span className="font-bold">20%</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-10 py-4 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-2xl" 
            style={{ backgroundColor: 'white', color: '#FF6B00', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            Đăng ký ngay
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/marketplace" className="inline-flex items-center gap-2 px-10 py-4 font-semibold rounded-xl border-2 transition-all hover:scale-105" 
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
            Khám phá ngay
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-12 text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Bảo mật SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Giao dịch nhanh</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </section>
  )
}
