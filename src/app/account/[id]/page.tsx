import Link from 'next/link'
import { Crown, Shield, Zap, Gift, Clock, Users, ShoppingBag, Star, TrendingUp } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CrossFire Legends <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, title: 'An toàn 100%', desc: 'Bảo mật tuyệt đối' },
            { icon: Zap, title: 'Giao dịch nhanh', desc: 'Nhận acc ngay' },
            { icon: Gift, title: 'Ưu đãi hấp dẫn', desc: 'Nhiều khuyến mãi' },
            { icon: Clock, title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng' },
          ].map((f, i) => (
            <div key={i} className="card text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/marketplace" className="btn-primary text-lg px-8 py-4">
            Khám phá Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}
