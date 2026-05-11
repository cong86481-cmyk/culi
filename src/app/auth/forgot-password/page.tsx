'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Crown, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

type Step = 'email' | 'otp' | 'success'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email là bắt buộc'
    if (!emailRegex.test(email)) return 'Email không hợp lệ'
    return ''
  }

  const validateOTP = (otp: string) => {
    if (!otp) return 'Mã OTP là bắt buộc'
    if (otp.length !== 6) return 'Mã OTP phải có 6 chữ số'
    if (!/^\d+$/.test(otp)) return 'Mã OTP chỉ chứa số'
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
    if (touched.otp) {
      setErrors(prev => ({ ...prev, otp: validateOTP(formData.otp) }))
    }
    if (touched.newPassword) {
      setErrors(prev => ({ ...prev, newPassword: validatePassword(formData.newPassword) }))
    }
    if (touched.confirmPassword) {
      if (formData.confirmPassword !== formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }))
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
  }, [formData, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(formData.email)
    if (emailError) {
      setErrors({ email: emailError })
      setTouched({ email: true })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', data.message || 'Mã OTP đã được gửi')
      setStep('otp')
      setCountdown(60)
    } catch (error) {
      toast('error', 'Đã xảy ra lỗi kết nối')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    setFormData(prev => ({ ...prev, otp: '' }))

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', data.message || 'Mã OTP mới đã được gửi')
      setCountdown(60)
    } catch (error) {
      toast('error', 'Đã xảy ra lỗi kết nối')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpError = validateOTP(formData.otp)
    const passwordError = validatePassword(formData.newPassword)
    const confirmError = formData.confirmPassword !== formData.newPassword ? 'Mật khẩu xác nhận không khớp' : ''

    if (otpError || passwordError || confirmError) {
      setErrors({
        otp: otpError,
        newPassword: passwordError,
        confirmPassword: confirmError,
      })
      setTouched({ otp: true, newPassword: true, confirmPassword: true })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Đặt lại mật khẩu thành công!')
      setStep('success')
    } catch (error) {
      toast('error', 'Đã xảy ra lỗi kết nối')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return
    
    const newOtp = formData.otp.split('')
    newOtp[index] = value
    const updatedOtp = newOtp.join('')
    
    setFormData({ ...formData, otp: updatedOtp })
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData) {
      setFormData({ ...formData, otp: pastedData })
      
      // Focus last filled or last input
      const focusIndex = Math.min(pastedData.length, 5)
      const input = document.getElementById(`otp-${focusIndex}`)
      input?.focus()
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
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Quên mật khẩu?</h1>
          <p className="text-text-secondary">
            {step === 'email' && 'Nhập email để nhận mã xác thực'}
            {step === 'otp' && 'Nhập mã OTP đã gửi đến email của bạn'}
            {step === 'success' && 'Đặt lại mật khẩu thành công'}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <form onSubmit={handleRequestOTP} className="space-y-6" noValidate>
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
                autoFocus
              />

              <div className="p-4 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary">
                    Mã OTP sẽ được gửi đến email của bạn. Mã có hiệu lực trong <strong className="text-white">5 phút</strong>.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Gửi mã OTP
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: OTP & New Password */}
        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <form onSubmit={handleResetPassword} className="space-y-6" noValidate>
              <div className="text-center mb-4">
                <p className="text-sm text-text-secondary">
                  Mã OTP đã được gửi đến<br />
                  <strong className="text-white">{formData.email}</strong>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium mb-3">Mã OTP</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={formData.otp[index] || ''}
                      onChange={(e) => handleOtpInput(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onBlur={() => handleBlur('otp')}
                      className={`
                        w-12 h-14 text-center text-xl font-bold rounded-xl
                        bg-surface border transition-all
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                        ${touched.otp && errors.otp 
                          ? 'border-red-500' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    />
                  ))}
                </div>
                {touched.otp && errors.otp && (
                  <p className="text-sm text-red-500 mt-2 text-center">{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="Mật khẩu mới"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  onBlur={() => handleBlur('newPassword')}
                  error={touched.newPassword ? errors.newPassword : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Xác nhận mật khẩu mới"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-9 text-text-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Đặt lại mật khẩu
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className={`text-sm ${countdown > 0 ? 'text-text-muted' : 'text-primary hover:underline'} transition-colors`}
                >
                  {countdown > 0 
                    ? `Gửi lại mã sau ${countdown}s` 
                    : 'Gửi lại mã OTP'
                  }
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setFormData(prev => ({ ...prev, otp: '' }))
                    }}
                    className="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Nhập lại email
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thành công!</h2>
            <p className="text-text-secondary mb-6">
              Mật khẩu của bạn đã được đặt lại thành công.
            </p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Đăng nhập ngay
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
