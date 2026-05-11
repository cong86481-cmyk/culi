'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

let toastId = 0
const listeners: ((toast: Toast) => void)[] = []

export function toast(type: ToastType, message: string, duration = 4000) {
  const newToast: Toast = { id: String(++toastId), type, message, duration }
  listeners.forEach((listener) => listener(newToast))
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())

  const removeToast = useCallback((id: string) => {
    setExitingIds(prev => new Set([...Array.from(prev), id]))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      setExitingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }, [])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration || 4000)
    }
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [removeToast])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-error flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
  }

  const backgrounds = {
    success: 'border-success/30 bg-success/10',
    error: 'border-error/30 bg-error/10',
    warning: 'border-warning/30 bg-warning/10',
    info: 'border-primary/30 bg-primary/10',
  }

  const progressColors = {
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-primary',
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border ${backgrounds[t.type]} backdrop-blur-xl shadow-lg bg-[#1A1A24]/90`}
              role="alert"
              aria-live="polite"
            >
              {icons[t.type]}
              <span className="text-white flex-1 text-sm leading-relaxed">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: (t.duration || 4000) / 1000, ease: 'linear' }}
                  className={`h-full ${progressColors[t.type]} origin-left`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
