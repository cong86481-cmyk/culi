'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function FloatingContactButtons() {
  const [mounted, setMounted] = useState(false)
  const [zaloLink, setZaloLink] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchContactLinks()
  }, [])

  const fetchContactLinks = async () => {
    try {
      const res = await fetch('/api/settings/contacts')
      const data = await res.json()
      if (data.success && data.data.zalo_link) {
        setZaloLink(data.data.zalo_link)
      }
    } catch (error) {
      console.error('Failed to fetch contact links:', error)
    }
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <motion.a
        href={zaloLink || 'https://zalo.me/0812425559'}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-1 cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl shadow-[#0068FF]/50 transition-all border-2 border-white/20 flex items-center justify-center bg-white">
          <img
            src="https://img-cache.coccoc.com/image2?i=2&l=21/350264213"
            alt="Zalo"
            className="w-12 h-12 object-contain"
          />
        </div>
        <span className="text-xs text-white bg-[#0068FF] px-3 py-1 rounded-full shadow-lg whitespace-nowrap group-hover:bg-[#0068FF]/90 transition-colors font-medium">
          Zalo
        </span>
      </motion.a>
    </div>
  )
}
