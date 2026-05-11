'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Crown } from 'lucide-react'

interface WelcomeNotificationProps {
  message: string
  subMessage?: string
  link?: { href: string; label: string }
}

export function WelcomeNotification({ message, subMessage, link }: WelcomeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenNotification = sessionStorage.getItem('welcome_notification_shown')
    if (!hasSeenNotification) {
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem('welcome_notification_shown', 'true')
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-20 left-1/2 z-[100] max-w-md w-full px-4"
        >
          <div 
            className="rounded-2xl p-5 shadow-2xl border"
            style={{ 
              backgroundColor: 'rgba(26, 26, 36, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 107, 0, 0.3)',
              boxShadow: '0 0 40px rgba(255, 107, 0, 0.2)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)' }}
              >
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4" style={{ color: '#FF6B00' }} />
                  <h3 className="font-bold text-lg" style={{ color: '#fff' }}>{message}</h3>
                </div>
                {subMessage && (
                  <p className="text-sm mb-3" style={{ color: '#A1A1AA' }}>{subMessage}</p>
                )}
                {link && (
                  <a
                    href={link.href}
                    className="inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{ 
                      background: 'linear-gradient(135deg, #FF6B00 0%, #DC2626 100%)',
                      color: 'white'
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: '#71717A' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function WelcomeNotificationLoader() {
  const [notificationData, setNotificationData] = useState<{
    enabled: boolean
    title: string
    message: string
    link: string
    linkLabel: string
  } | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.success) {
          setNotificationData({
            enabled: data.data.welcome_notification_enabled === 'true',
            title: data.data.welcome_notification_title || 'Chào mừng đến CFL Marketplace!',
            message: data.data.welcome_notification_message || '',
            link: data.data.welcome_notification_link || '/marketplace',
            linkLabel: data.data.welcome_notification_link_label || 'Khám phá ngay',
          })
        }
      } catch (error) {
        console.error('Failed to fetch notification settings:', error)
      }
    }
    fetchSettings()
  }, [])

  if (!notificationData || !notificationData.enabled) return null

  return (
    <WelcomeNotification
      message={notificationData.title}
      subMessage={notificationData.message}
      link={{
        href: notificationData.link,
        label: notificationData.linkLabel,
      }}
    />
  )
}
