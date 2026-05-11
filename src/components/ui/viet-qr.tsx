'use client'

import { useEffect, useState, useMemo } from 'react'

interface VietQRProps {
  bankId: string
  accountNumber: string
  accountName: string
  amount: number
  transferNote: string
  size?: number
  template?: 'compact' | 'qr_only' | 'print'
}

export function VietQR({
  bankId,
  accountNumber,
  accountName,
  amount,
  transferNote,
  size = 200,
  template = 'compact'
}: VietQRProps) {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      setLoading(true)
      setError(false)
      
      try {
        // VietQR.io API - miễn phí, không cần API key
        const encodedNote = encodeURIComponent(transferNote)
        const encodedName = encodeURIComponent(accountName)
        
        // Template options: compact, qr_only, print
        const imageType = template === 'qr_only' ? 'image' : 'qr_only'
        
        const url = `https://img.vietqr.io/image/${bankId}-${accountNumber}-${imageType}.png?amount=${amount}&addInfo=${encodedNote}&accountName=${encodedName}`
        
        setQrUrl(url)
      } catch (err) {
        console.error('Failed to generate QR:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (amount > 0 && transferNote) {
      generateQR()
    }
  }, [bankId, accountNumber, accountName, amount, transferNote, template])

  if (loading) {
    return (
      <div 
        className="bg-white rounded-xl flex items-center justify-center animate-pulse"
        style={{ width: size, height: size }}
      >
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !qrUrl) {
    return (
      <div 
        className="bg-gray-100 rounded-xl flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <p className="text-xs text-gray-500 text-center p-2">QR không khả dụng</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <img
        src={qrUrl}
        alt="VietQR Payment"
        width={size}
        height={size}
        className="rounded-xl"
        onError={() => setError(true)}
      />
      {error && (
        <div 
          className="absolute inset-0 bg-white rounded-xl flex items-center justify-center"
        >
          <p className="text-xs text-gray-500 text-center p-2">QR không khả dụng</p>
        </div>
      )}
    </div>
  )
}

// Các ngân hàng được hỗ trợ bởi VietQR
export const SUPPORTED_BANKS = {
  'vietcombank': { id: '970436', name: 'Vietcombank', shortName: 'VCB' },
  'vietinbank': { id: '970415', name: 'VietinBank', shortName: 'VTB' },
  'bidv': { id: '970418', name: 'BIDV', shortName: 'BIDV' },
  'agribank': { id: '970405', name: 'Agribank', shortName: 'AGB' },
  'mbbank': { id: '970422', name: 'MB Bank', shortName: 'MB' },
  'tpbank': { id: '970423', name: 'TPBank', shortName: 'TPB' },
  'acb': { id: '970416', name: 'ACB', shortName: 'ACB' },
  'vpbank': { id: '970432', name: 'VPBank', shortName: 'VPB' },
  'techcombank': { id: '970407', name: 'Techcombank', shortName: 'TCB' },
  'sacombank': { id: '970403', name: 'Sacombank', shortName: 'SCB' },
  'eximbank': { id: '970431', name: 'Eximbank', shortName: 'EIB' },
  'shinhanbank': { id: '970424', name: 'Shinhan Bank', shortName: 'SHB' },
  'hdbank': { id: '970437', name: 'HDBank', shortName: 'HDB' },
  'msb': { id: '970426', name: 'MSB', shortName: 'MSB' },
  'ocb': { id: '970448', name: 'OCB', shortName: 'OCB' },
  'pvcombank': { id: '970412', name: 'PVComBank', shortName: 'PVC' },
  'vietcapital': { id: '970427', name: 'Bản Việt', shortName: 'VCB' },
  'bab': { id: '970409', name: 'BAB', shortName: 'BAB' },
  'vccb': { id: '970439', name: 'VCCB', shortName: 'VCC' },
  'baoviet': { id: '970433', name: 'Bảo Việt Bank', shortName: 'BV' },
  'gpbank': { id: '970406', name: 'GPBank', shortName: 'GPB' },
  'pgbank': { id: '970430', name: 'PGBank', shortName: 'PGB' },
  'dongabank': { id: '970406', name: 'DongA Bank', shortName: 'DAB' },
  'ncb': { id: '970419', name: 'NCB', shortName: 'NCB' },
  'vrb': { id: '970421', name: 'VRB', shortName: 'VRB' },
  'scb': { id: '970403', name: 'SCB', shortName: 'SCB' },
  'ivb': { id: '970438', name: 'Indovina Bank', shortName: 'IVB' },
  'ubank': { id: '970425', name: 'UBank', shortName: 'UBK' },
  'momo': { id: 'MOMO', name: 'MoMo', shortName: 'MOMO' },
} as const

export type BankCode = keyof typeof SUPPORTED_BANKS
