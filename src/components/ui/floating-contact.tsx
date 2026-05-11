'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Facebook, X } from 'lucide-react'

interface ContactLinks {
  zalo?: string
  facebook?: string
}

export function FloatingContactButtons() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [links, setLinks] = useState<ContactLinks>({})
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchContactLinks()
    checkUserRole()
  }, [])

  const fetchContactLinks = async () => {
    try {
      const res = await fetch('/api/settings/contacts')
      const data = await res.json()
      if (data.success) {
        setLinks(data.data || {})
      }
    } catch (error) {
      console.error('Failed to fetch contact links:', error)
    }
  }

  const checkUserRole = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.success && data.user?.role === 'ADMIN') {
        setIsAdmin(true)
      }
    } catch (error) {
      console.error('Failed to check user role:', error)
    }
  }

  // Don't render anything during SSR
  if (!mounted) return null

  const hasContacts = links.zalo || links.facebook

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {links.zalo ? (
              <motion.a
                href={links.zalo}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 }}
                className="group relative flex items-center gap-2"
              >
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1A1A24] rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2D2D3A]">
                  Zalo
                </div>
                <div className="w-14 h-14 rounded-full bg-[#0068FF] hover:bg-[#0068FF]/90 flex items-center justify-center shadow-lg shadow-[#0068FF]/30 transition-all hover:scale-110 cursor-pointer">
                  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="white">
                    <circle cx="24" cy="24" r="20" fill="#0068FF"/>
                    <path d="M24 12c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm-3 17.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm5 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="white"/>
                  </svg>
                </div>
              </motion.a>
            ) : isAdmin ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.5, x: 0 }}
                className="group relative flex items-center gap-2 cursor-not-allowed"
              >
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1A1A24] rounded-lg text-sm text-white whitespace-nowrap border border-[#2D2D3A]">
                  Chưa cấu hình
                </div>
                <div className="w-14 h-14 rounded-full bg-[#71717A] flex items-center justify-center opacity-50">
                  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="white">
                    <circle cx="24" cy="24" r="20" fill="#71717A"/>
                    <path d="M24 12c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm-3 17.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm5 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="white"/>
                  </svg>
                </div>
              </motion.div>
            ) : null}

            {links.facebook ? (
              <motion.a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 }}
                className="group relative flex items-center gap-2"
              >
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1A1A24] rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2D2D3A]">
                  Facebook
                </div>
                <div className="w-14 h-14 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 flex items-center justify-center shadow-lg shadow-[#1877F2]/30 transition-all hover:scale-110 cursor-pointer">
                  <Facebook className="w-7 h-7 text-white" />
                </div>
              </motion.a>
            ) : isAdmin ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative flex items-center gap-2 cursor-not-allowed"
              >
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1A1A24] rounded-lg text-sm text-white whitespace-nowrap border border-[#2D2D3A]">
                  Chưa cấu hình
                </div>
                <div className="w-14 h-14 rounded-full bg-[#71717A] flex items-center justify-center opacity-50">
                  <Facebook className="w-7 h-7 text-white" />
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8B3A] flex items-center justify-center shadow-xl shadow-[#FF6B00]/50 transition-all border-2 border-white/20"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-8 h-8 text-white" />
              {hasContacts && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
