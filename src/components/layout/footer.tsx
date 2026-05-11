'use client'

import Link from 'next/link'
import { Crown, Mail, Phone, MapPin, Facebook, Youtube, MessageCircle, Shield, Zap, Clock, Send, ChevronRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-[#0A0A0F] border-t border-[#2D2D3A] mt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="relative container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors">CFL Marketplace</h2>
                <p className="text-xs text-text-muted">CrossFire Legends Vietnam</p>
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">
              Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam. An toàn, nhanh chóng, giá tốt với hàng ngàn tài khoản chất lượng.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: Shield, label: 'SSL 256-bit' },
                { icon: Zap, label: 'Giao dịch nhanh' },
                { icon: Clock, label: 'Hỗ trợ 24/7' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs shadow-sm">
                  <badge.icon className="w-3 h-3 text-primary" />
                  <span className="text-text-secondary">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group border border-border">
                <Facebook className="w-5 h-5 text-text-muted group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-red-600 hover:text-white transition-all group border border-border">
                <Youtube className="w-5 h-5 text-text-muted group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-green-500 hover:text-white transition-all group border border-border">
                <MessageCircle className="w-5 h-5 text-text-muted group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-primary hover:text-white transition-all group border border-border">
                <Send className="w-5 h-5 text-text-muted group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-primary rounded-full" />
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/marketplace', label: 'Marketplace' },
                { href: '/wallet', label: 'Nạp tiền' },
                { href: '/dashboard', label: 'Tài khoản' },
                { href: '/auth/login', label: 'Đăng nhập' },
                { href: '/auth/register', label: 'Đăng ký' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-primary rounded-full" />
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Hướng dẫn mua hàng' },
                { href: '#', label: 'Chính sách bảo hành' },
                { href: '#', label: 'Chính sách đổi trả' },
                { href: '#', label: 'Điều khoản sử dụng' },
                { href: '#', label: 'Chính sách bảo mật' },
                { href: '#', label: 'FAQ' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-primary rounded-full" />
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Địa chỉ</p>
                  <p className="text-text-secondary">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Hotline</p>
                  <p className="text-text-secondary">0901 234 567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="text-text-secondary">support@cfl-market.vn</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Giờ hỗ trợ</p>
                  <p className="text-text-secondary">24/7 - Luôn sẵn sàng</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-8 border-t border-[#2D2D3A]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-text-muted text-sm mb-3 md:mb-0">Phương thức thanh toán</p>
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="px-4 py-2 bg-surface rounded-xl border border-border shadow-sm">
                  <span className="text-sm font-medium text-primary">VietQR</span>
                </div>
                <div className="px-4 py-2 bg-surface rounded-xl border border-border shadow-sm">
                  <span className="text-sm font-medium text-pink-500">MoMo</span>
                </div>
                <div className="px-4 py-2 bg-surface rounded-xl border border-border shadow-sm">
                  <span className="text-sm font-medium text-blue-500">ATM/Ví Ngân hàng</span>
                </div>
                <div className="px-4 py-2 bg-surface rounded-xl border border-border shadow-sm">
                  <span className="text-sm font-medium text-green-500">Thẻ cào</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-[#2D2D3A] text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-semibold">CFL Marketplace</span>. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-text-muted/60 text-xs mt-2">
            Game CrossFire Legends là thương hiệu của SMILESPACE. Chúng tôi không liên kết với bất kỳ nhà phát triển game nào.
          </p>
        </div>
      </div>
    </footer>
  )
}
