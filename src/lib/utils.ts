import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}

export function generateTransferNote(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CFL${timestamp}${random}`
}

export function parseJSON<T>(json: T | string, defaultValue: T): T {
  if (Array.isArray(json)) {
    return json as T
  }
  try {
    return JSON.parse(json as string)
  } catch {
    return defaultValue
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'text-success bg-success/10',
    SOLD: 'text-error bg-error/10',
    PENDING: 'text-warning bg-warning/10',
    APPROVED: 'text-success bg-success/10',
    REJECTED: 'text-error bg-error/10',
  }
  return colors[status] || 'text-text-secondary bg-surface'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: 'Còn hàng',
    SOLD: 'Đã bán',
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
  }
  return labels[status] || status
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} tháng trước`
  }
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} năm trước`
}

// Validation helpers
export const validators = {
  email: (email: string): string => {
    if (!email) return 'Email là bắt buộc'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Email không hợp lệ'
    return ''
  },

  password: (password: string, minLength = 6): string => {
    if (!password) return 'Mật khẩu là bắt buộc'
    if (password.length < minLength) return `Mật khẩu phải có ít nhất ${minLength} ký tự`
    return ''
  },

  username: (username: string, minLength = 3): string => {
    if (!username) return 'Tên đăng nhập là bắt buộc'
    if (username.length < minLength) return `Tên đăng nhập phải có ít nhất ${minLength} ký tự`
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới'
    return ''
  },

  required: (value: string, fieldName: string): string => {
    if (!value?.trim()) return `${fieldName} là bắt buộc`
    return ''
  },

  minLength: (value: string, length: number, fieldName: string): string => {
    if (value.length < length) return `${fieldName} phải có ít nhất ${length} ký tự`
    return ''
  },

  maxLength: (value: string, length: number, fieldName: string): string => {
    if (value.length > length) return `${fieldName} không được quá ${length} ký tự`
    return ''
  },

  positiveNumber: (value: number, fieldName: string): string => {
    if (value <= 0) return `${fieldName} phải lớn hơn 0`
    return ''
  },
}

// Debounce helper for client-side
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

// Throttle helper for client-side
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Clamp number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}
