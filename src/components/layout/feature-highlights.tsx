'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Clock, Headphones, Wallet, BadgeCheck, TrendingUp, Lock, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Bảo Mật Tuyệt Đối',
    description: 'Mã hóa SSL 256-bit, bảo vệ thông tin và giao dịch của bạn 24/7',
    color: 'from-primary to-orange-500',
  },
  {
    icon: Zap,
    title: 'Giao Dịch Nhanh Chóng',
    description: 'Mua tài khoản chỉ trong 3 bước đơn giản, nhận account ngay lập tức',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BadgeCheck,
    title: 'Tài Khoản Đã Kiểm Duyệt',
    description: '100% tài khoản được kiểm tra chất lượng trước khi đăng bán',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Headphones,
    title: 'Hỗ Trợ 24/7',
    description: 'Đội ngũ hỗ trợ chuyên nghiệp, giải đáp mọi thắc mắc của bạn',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Thanh Toán An Toàn',
    description: 'Nhiều hình thức thanh toán, hoàn tiền nếu tài khoản có vấn đề',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: RefreshCw,
    title: 'Đổi Trả Dễ Dàng',
    description: 'Chính sách đổi trả linh hoạt trong 24h nếu không hài lòng',
    color: 'from-rose-500 to-red-500',
  },
]

const steps = [
  {
    number: '01',
    title: 'Chọn Tài Khoản',
    description: 'Duyệt qua hàng trăm tài khoản với đa dạng rank và giá cả',
    icon: TrendingUp,
  },
  {
    number: '02',
    title: 'Thanh Toán',
    description: 'Chọn phương thức thanh toán an toàn, nạp tiền vào ví',
    icon: Wallet,
  },
  {
    number: '03',
    title: 'Nhận Account',
    description: 'Nhận thông tin đăng nhập ngay sau khi thanh toán thành công',
    icon: BadgeCheck,
  },
]

export function FeatureHighlights() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-primary via-background-secondary to-background-primary" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Tại sao chọn CFL Marketplace?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nền tảng mua bán hàng đầu
            <span className="gradient-text"> Việt Nam</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm giao dịch tốt nhất với độ an toàn và uy tín hàng đầu
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-2xl bg-background-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.color} blur-xl opacity-10`} />
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-2xl bg-background-card flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              Chỉ 3 bước đơn giản
            </span>
            <h3 className="text-2xl md:text-3xl font-bold">
              Mua Tài Khoản Trong Tích Tắc
            </h3>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-primary p-1">
                      <div className="w-full h-full rounded-full bg-background-card flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                  <p className="text-text-secondary text-sm max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-primary">
            <Lock className="w-5 h-5 text-white/80" />
            <span className="text-white font-medium">
              Giao dịch an toàn 100% - Bảo vệ bởi SSL 256-bit
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
