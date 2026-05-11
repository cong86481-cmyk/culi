'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  Copy,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Sparkles,
  RefreshCw,
  Banknote,
  ArrowLeft,
  Smartphone,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { VietQR } from '@/components/ui/viet-qr'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

interface User {
  id: string
  username: string
  email: string
  balance: number
  transferNote: string | null
}

interface Deposit {
  id: string
  amount: number
  method: string
  transferNote: string
  status: string
  createdAt: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
}

interface BankInfo {
  bank_name: string
  bank_account: string
  bank_holder: string
}

const QUICK_AMOUNTS = [
  { label: '10K', value: 10000 },
  { label: '20K', value: 20000 },
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '200K', value: 200000 },
  { label: '500K', value: 500000 },
]

export default function WalletPage() {
  const [user, setUser] = useState<User | null>(null)
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit')
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositInfo, setShowDepositInfo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bank_name: 'Vietcombank',
    bank_account: '',
    bank_holder: '',
  })

  useEffect(() => {
    fetchData()
    fetchBankInfo()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchBankInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/bank-info')
      const data = await res.json()
      if (data.success) {
        setBankInfo(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch bank info:', error)
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [userRes, depositsRes, transactionsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/wallet/deposits'),
        fetch('/api/wallet/transactions'),
      ])

      const userData = await userRes.json()
      const depositsData = await depositsRes.json()
      const transactionsData = await transactionsRes.json()

      if (userData.success) setUser(userData.user)
      if (depositsData.success) setDeposits(depositsData.data)
      if (transactionsData.success) setTransactions(transactionsData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast('error', 'Không thể kết nối server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(field)
      toast('success', 'Đã sao chép vào clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast('error', 'Không thể sao chép')
    }
  }

  const handleQuickAmount = (amount: number) => {
    setDepositAmount(amount.toString())
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (!amount || amount < 10000) {
      toast('error', 'Số tiền nạp tối thiểu là 10,000 VNĐ')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      setShowDepositInfo(true)
      toast('success', 'Tạo yêu cầu nạp tiền thành công!')
      fetchData()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewDeposit = () => {
    setShowDepositInfo(false)
    setDepositAmount('')
  }

  const pendingDeposits = deposits.filter(d => d.status === 'PENDING')
  const recentDeposits = deposits.slice(0, 3)
  const recentTransactions = transactions.slice(0, 5)

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-surface rounded animate-pulse mb-4" />
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
              <a href="/auth/login" className="btn-primary">Đăng nhập</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Ví của tôi</h1>
              <p className="text-text-secondary">Quản lý số dư và nạp tiền</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              isLoading={refreshing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Làm mới
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card bg-gradient-primary border-0 overflow-hidden relative">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-8 h-8 text-white/80" />
                  <span className="text-white/80">Số dư tài khoản</span>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {formatPrice(user.balance)}
                </p>
                <div className="flex items-center gap-2 text-white/60 text-sm mt-4">
                  <Clock className="w-4 h-4" />
                  <span>Cập nhật: {formatDate(new Date().toISOString())}</span>
                </div>
              </div>
              <button onClick={handleRefresh} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors" aria-label="Làm mới số dư">
                <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warning" />
              Đang chờ xử lý
              {pendingDeposits.length > 0 && (
                <Badge variant="warning" dot pulse>{pendingDeposits.length}</Badge>
              )}
            </h3>
            {pendingDeposits.length > 0 ? (
              <div className="space-y-3">
                {pendingDeposits.map((deposit) => (
                  <div key={deposit.id} className="p-3 rounded-xl bg-warning/10 border border-warning/20">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-warning">{formatPrice(deposit.amount)}</span>
                      <StatusBadge status={deposit.status as any} size="sm" />
                    </div>
                    <p className="text-xs text-text-muted mt-1">Mã: {deposit.transferNote}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Banknote className="w-10 h-10 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">Không có yêu cầu nào đang chờ</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'deposit'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-white'
            }`}
          >
            Nạp tiền
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-white'
            }`}
          >
            Lịch sử giao dịch
          </button>
        </div>

        {activeTab === 'deposit' && !showDepositInfo && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Nạp tiền qua ngân hàng</h2>
              <form onSubmit={handleDeposit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Số tiền nạp (VNĐ)</label>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền (tối thiểu 10,000)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleQuickAmount(item.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          depositAmount === item.value.toString()
                            ? 'bg-primary text-white'
                            : 'bg-surface hover:bg-surface/80 text-text-secondary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Vietcombank info */}
                <div className="p-4 rounded-xl bg-[#1A3A5C]/20 border border-[#1A3A5C]/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A3A5C] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">VCB</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Vietcombank</p>
                      <p className="text-xs text-[#71717A]">Ngân hàng nhận</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary">
                    <span className="font-semibold">Lưu ý:</span> Sau khi tạo yêu cầu, vui lòng chuyển khoản đúng số tiền với nội dung được cung cấp. Tiền sẽ được cộng tự động trong vài phút.
                  </p>
                </div>
                <Button type="submit" className="w-full" isLoading={isSubmitting}>Tạo yêu cầu nạp tiền</Button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'deposit' && showDepositInfo && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Quét QR để thanh toán</h2>
                <button onClick={handleNewDeposit} className="text-sm text-primary hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Tạo yêu cầu mới
                </button>
              </div>

              <div className="p-4 rounded-xl bg-success/10 border border-success/20 mb-6">
                <p className="text-sm text-success font-medium">Số tiền cần nạp</p>
                <p className="text-3xl font-bold text-success">{formatPrice(parseFloat(depositAmount))}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
                <VietQR
                  bankId="970436"
                  accountNumber={bankInfo.bank_account}
                  accountName={bankInfo.bank_holder}
                  amount={parseFloat(depositAmount)}
                  transferNote={user.transferNote || 'CFL000000XX'}
                  size={280}
                  template="qr_only"
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex gap-2">
                  <a
                    href="https://vietqr.io/vietcombank"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    Mở App Banking
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyToClipboard(bankInfo.bank_account, 'account')}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    {copied === 'account' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    STK: {bankInfo.bank_account}
                  </button>
                  <button
                    onClick={() => copyToClipboard(user?.transferNote || 'CFL000000XX', 'note')}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    {copied === 'note' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    Nội dung CK
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-surface/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Ngân hàng</span>
                    <span className="font-medium">{bankInfo.bank_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Số tài khoản</span>
                    <span className="font-medium font-mono">{bankInfo.bank_account}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Tên tài khoản</span>
                    <span className="font-medium">{bankInfo.bank_holder}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Nội dung CK</span>
                      <span className="font-bold text-primary">{user?.transferNote || 'CFL000000XX'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-warning">
                  <span className="font-semibold">Lưu ý:</span> Quét QR bên trên hoặc nhập thủ công. Đảm bảo <strong>nội dung chuyển khoản</strong> chính xác để tiền được cộng tự động.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Lịch sử giao dịch</h2>
                <Button variant="ghost" onClick={handleRefresh} leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Làm mới
                </Button>
              </div>

              {recentDeposits.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ArrowDownLeft className="w-5 h-5 text-success" />
                    Yêu cầu nạp tiền gần đây
                  </h3>
                  <div className="space-y-3">
                    {recentDeposits.map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-4 rounded-xl bg-surface/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <ArrowDownLeft className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-semibold">Nạp tiền - {formatPrice(deposit.amount)}</p>
                            <p className="text-sm text-text-muted">{formatDate(deposit.createdAt)}</p>
                          </div>
                        </div>
                        <StatusBadge status={deposit.status as any} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Giao dịch gần đây
                  </h3>
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-surface/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.amount > 0 ? 'bg-success/10' : 'bg-error/10'
                        }`}>
                          {tx.amount > 0 ? (
                            <ArrowDownLeft className="w-5 h-5 text-success" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-error" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{tx.description}</p>
                          <p className="text-sm text-text-muted">{formatDate(tx.createdAt)}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${tx.amount > 0 ? 'text-success' : 'text-error'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatPrice(tx.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                  <p className="text-text-secondary">Chưa có giao dịch nào</p>
                  <a href="/marketplace" className="text-primary hover:underline text-sm mt-2 inline-block">
                    Khám phá marketplace
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
