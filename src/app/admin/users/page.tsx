'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Wallet, Crown, Trash2, Edit, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/toast'

interface AdminUser {
  id: string
  username: string
  email: string
  role: string
  balance: number
  createdAt: string
  _count: {
    purchases: number
    deposits: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    balance: '0',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Tạo người dùng thành công')
      setShowModal(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const handleUpdateBalance = async (userId: string, newBalance: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: newBalance }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Cập nhật số dư thành công')
      fetchUsers()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Xóa người dùng thành công')
      fetchUsers()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      balance: '0',
    })
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Quản lý người dùng</h1>
            <p className="text-text-secondary">Xem và quản lý tài khoản người dùng</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <User className="w-5 h-5 mr-2" />
            Thêm người dùng
          </Button>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {users.map((user) => (
            <div key={user.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <span className="text-lg font-bold">{user.username[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-text-muted">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === 'ADMIN' ? 'warning' : 'secondary'}>
                  {user.role === 'ADMIN' ? (
                    <><Shield className="w-3 h-3 mr-1" />Admin</>
                  ) : (
                    'Khách hàng'
                  )}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                  <span className="text-sm text-text-muted">Số dư</span>
                  <span className="font-bold text-primary">{formatPrice(user.balance)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                  <span className="text-sm text-text-muted">Mua hàng</span>
                  <span>{user._count.purchases} tài khoản</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                  <span className="text-sm text-text-muted">Nạp tiền</span>
                  <span>{user._count.deposits} lần</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                <span>Tham gia: {formatDate(user.createdAt)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUpdateBalance(user.id, user.balance + 100000)}
                >
                  +100k
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUpdateBalance(user.id, user.balance - 100000)}
                >
                  -100k
                </Button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <p className="text-text-secondary">Chưa có người dùng nào</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title="Thêm người dùng mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên đăng nhập"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Select
            label="Vai trò"
            options={[
              { value: 'CUSTOMER', label: 'Khách hàng' },
              { value: 'ADMIN', label: 'Quản trị viên' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Input
            label="Số dư ban đầu"
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Tạo người dùng
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
