'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Crown, Users, Shield, TrendingUp } from 'lucide-react'

interface Stats {
  availableAccounts: number
  soldAccounts: number
  totalUsers: number
  totalPurchases: number
}

interface AnimatedStatsProps {
  stats: Stats
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <>{count.toLocaleString()}</>
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  const statItems = [
    { 
      icon: ShoppingBag, 
      label: 'Tài khoản có sẵn', 
      value: stats.availableAccounts, 
      color: '#FF6B00',
      bg: 'rgba(255,107,0,0.1)',
      border: 'rgba(255,107,0,0.3)',
    },
    { 
      icon: Crown, 
      label: 'Tài khoản đã bán', 
      value: stats.soldAccounts, 
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.1)',
      border: 'rgba(34,197,94,0.3)',
    },
    { 
      icon: Users, 
      label: 'Người dùng', 
      value: stats.totalUsers, 
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.3)',
    },
    { 
      icon: TrendingUp, 
      label: 'Giao dịch thành công', 
      value: stats.totalPurchases, 
      color: '#EAB308',
      bg: 'rgba(234,179,8,0.1)',
      border: 'rgba(234,179,8,0.3)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((stat, index) => (
        <div 
          key={index}
          className="group relative p-6 md:p-8 rounded-2xl transition-all duration-500 hover:scale-105"
          style={{ 
            backgroundColor: '#1A1A24',
            border: `1px solid ${stat.border}`,
            boxShadow: `0 0 0 0 ${stat.color}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 40px ${stat.color}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 0 ${stat.color}`;
          }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
              background: `radial-gradient(circle at center, ${stat.color}10 0%, transparent 70%)`,
            }}
          />
          
          <div className="relative">
            <div 
              className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: stat.color }} />
            </div>
            
            <p className="text-3xl md:text-4xl font-bold text-center mb-1">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-sm text-[#71717A] text-center">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
