'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
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
    weak: { label: 'Yếu', color: 'bg-error', width: '33%' },
    medium: { label: 'Trung bình', color: 'bg-warning', width: '66%' },
    strong: { label: 'Mạnh', color: 'bg-success', width: '100%' },
  }

  const { label, color, width } = config[strength]

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          className={`h-full ${color} transition-all duration-300`}
        />
      </div>
      <p className={`text-xs mt-1 ${strength === 'weak' ? 'text-error' : strength === 'medium' ? 'text-warning' : 'text-success'}`}>
        Độ mạnh: {label}
      </p>
    </div>
  )
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const currentPasswordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    currentPasswordRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCurrent) setShowCurrent(false)
        else if (showNew) setShowNew(false)
        else if (showConfirm) setShowConfirm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showCurrent, showNew, showConfirm])

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast('error', 'Mật khẩu mới không khớp')
      return
    }

    if (formData.newPassword.length < 6) {
      toast('error', 'Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Đổi mật khẩu thành công')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Đổi mật khẩu</h1>
          <div className="flex items-center gap-2 text-text-secondary">
            <ShieldCheck className="w-4 h-4" />
            <p>Bảo mật tài khoản của bạn với mật khẩu mới</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="relative">
              <label className="label">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  ref={currentPasswordRef}
                  type={showCurrent ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => updateField('currentPassword', e.target.value)}
                  className="input pl-12 pr-12"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  autoComplete="current-password"
                  aria-label="Mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  aria-label={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="label">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => updateField('newPassword', e.target.value)}
                  className="input pl-12 pr-12"
                  placeholder="Nhập mật khẩu mới"
                  required
                  autoComplete="new-password"
                  aria-label="Mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.newPassword} />
              {touched.newPassword && formData.newPassword && formData.newPassword.length < 6 && (
                <p className="text-xs text-error mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="label">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="input pl-12 pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  autoComplete="new-password"
                  aria-label="Xác nhận mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  {passwordsMatch ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">Mật khẩu khớp</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-error" />
                      <span className="text-sm text-error">Mật khẩu không khớp</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={loading} disabled={!passwordsMatch || formData.newPassword.length < 6}>
              Đổi mật khẩu
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
