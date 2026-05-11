'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, Crown, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateUsername = (username: string) => {
    if (!username) return 'Tên đăng nhập là bắt buộc'
    if (username.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Mật khẩu là bắt buộc'
    return ''
  }

  useEffect(() => {
    if (touched.username) {
      setErrors(prev => ({ ...prev, username: validateUsername(formData.username) }))
    }
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(formData.password) }))
    }
  }, [formData.username, formData.password, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowPassword(false)
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const usernameError = validateUsername(formData.username)
    const passwordError = validatePassword(formData.password)

    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError })
      setTouched({ username: true, password: true })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Đăng nhập thất bại')
        return
      }

      toast('success', 'Đăng nhập thành công!')
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/')
      router.refresh()
    } catch (error) {
      toast('error', 'Đã xảy ra lỗi kết nối')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
          <p className="text-text-secondary">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errors.general && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-sm" role="alert">
                {errors.general}
              </div>
            )}

            <Input
              label="Tên đăng nhập"
              type="text"
              placeholder="Nhập tên đăng nhập"
              icon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              onBlur={() => handleBlur('username')}
              error={touched.username ? errors.username : undefined}
              autoComplete="username"
              autoFocus
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                icon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-text-muted hover:text-white transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Đăng nhập
            </Button>

            <div className="text-center text-xs text-text-muted flex items-center justify-center gap-2">
              <Keyboard className="w-4 h-4" />
              <span>Ctrl + Enter để đăng nhập nhanh</span>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Chưa có tài khoản?{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
