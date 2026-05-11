'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Crown, Keyboard, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong'

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty'
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  if (strength === 'empty') return null

  const config = {
    weak: { label: 'Yếu', color: 'bg-error' },
    medium: { label: 'Trung bình', color: 'bg-warning' },
    strong: { label: 'Mạnh', color: 'bg-success' },
  }

  const { label, color } = config[strength]

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              (strength === 'weak' && level === 1) ||
              (strength === 'medium' && level <= 2) ||
              (strength === 'strong' && level <= 3)
                ? color
                : 'bg-surface'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength === 'weak' ? 'text-error' : strength === 'medium' ? 'text-warning' : 'text-success'}`}>
        Độ mạnh: {label}
      </p>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email là bắt buộc'
    if (!emailRegex.test(email)) return 'Email không hợp lệ'
    return ''
  }

  const validateUsername = (username: string) => {
    if (!username) return 'Tên đăng nhập là bắt buộc'
    if (username.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự'
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Tên đăng nhập chỉ chứa chữ và số'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Mật khẩu là bắt buộc'
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    return ''
  }

  useEffect(() => {
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }))
    }
    if (touched.username) {
      setErrors(prev => ({ ...prev, username: validateUsername(formData.username) }))
    }
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(formData.password) }))
    }
    if (touched.confirmPassword && formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.password !== formData.confirmPassword ? 'Mật khẩu xác nhận không khớp' : ''
      }))
    }
  }, [formData, touched])

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
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const confirmError = formData.password !== formData.confirmPassword ? 'Mật khẩu xác nhận không khớp' : ''

    if (usernameError || emailError || passwordError || confirmError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError
      })
      setTouched({ username: true, email: true, password: true, confirmPassword: true })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Đăng ký thất bại')
        return
      }

      toast('success', 'Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      toast('error', 'Đã xảy ra lỗi kết nối')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

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
          <h1 className="text-3xl font-bold mb-2">Tạo tài khoản mới</h1>
          <p className="text-text-secondary">Tham gia cộng đồng CFL Marketplace</p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Tên đăng nhập"
              type="text"
              placeholder="Nhập tên đăng nhập"
              icon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              onBlur={() => handleBlur('username')}
              error={touched.username ? errors.username : undefined}
              helper="Ít nhất 3 ký tự, chỉ chữ và số"
              autoComplete="username"
              autoFocus
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              autoComplete="email"
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
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-text-muted hover:text-white transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              autoComplete="new-password"
            />

            {formData.confirmPassword && passwordsMatch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-success text-sm"
              >
                <Check className="w-4 h-4" />
                Mật khẩu khớp
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!passwordsMatch || !!errors.username || !!errors.email || !!errors.password}
            >
              Đăng ký
            </Button>

            <div className="text-center text-xs text-text-muted flex items-center justify-center gap-2">
              <Keyboard className="w-4 h-4" />
              <span>Ctrl + Enter để đăng ký nhanh</span>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
