'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingBag,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
  Crown,
  Settings,
  Package,
  ChevronDown,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface User {
  id: string
  username: string
  email: string
  role: string
  balance: number
}

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [pathname])

  const navLinks: Array<{
    href: string
    label: string
    icon: typeof Home
    highlight?: boolean
  }> = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/wallet', label: 'Nạp tiền', icon: Wallet },
  ]

  const userMenuItems = user?.role === 'ADMIN'
    ? [
        { href: '/admin', label: 'Quản trị', icon: Settings },
        { href: '/dashboard', label: 'Tài khoản', icon: User },
        { href: '/dashboard/purchases', label: 'Lịch sử mua', icon: Package },
      ]
    : [
        { href: '/dashboard', label: 'Tài khoản', icon: User },
        { href: '/dashboard/purchases', label: 'Lịch sử mua', icon: Package },
        { href: '/dashboard/deposits', label: 'Lịch sử nạp', icon: Wallet },
      ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background-primary/95 backdrop-blur-xl shadow-lg border-b border-border/50 py-3' 
          : 'bg-transparent backdrop-blur-sm py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform bg-white">
              <Image src="/images/logo.png" alt="Culi Shop" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold gradient-text">Culi Shop</h1>
              <p className="text-xs text-text-muted">Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                  link.highlight
                    ? pathname === link.href
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/30'
                      : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                    : pathname === link.href
                      ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                      : 'text-text-secondary hover:text-primary hover:bg-surface/60'
                )}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="hidden xl:inline-flex items-center gap-1 text-xs bg-orange-500/20 px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Balance */}
            {user && (
              <Link
                href="/wallet"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/80 border border-border hover:border-primary hover:bg-primary/10 transition-all backdrop-blur-sm"
              >
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-semibold text-white">
                  {formatPrice(user.balance)}
                </span>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-surface/50 hover:bg-surface transition-all border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{user.username[0].toUpperCase()}</span>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform', isUserMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 glass-dark rounded-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="text-sm text-text-muted">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface/80 text-text-secondary hover:text-white transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-text-muted" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' })
                            window.location.href = '/'
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-surface/60 transition-all hidden sm:block">
                  Đăng nhập
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-border pt-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      link.highlight
                        ? pathname === link.href
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg'
                          : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                        : pathname === link.href
                          ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                          : 'text-text-secondary hover:text-white hover:bg-surface/60'
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
