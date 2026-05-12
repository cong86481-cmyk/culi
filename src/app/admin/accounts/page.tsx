'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Crown,
  Star,
  Search,
  Filter,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader, GalleryUploader } from '@/components/ui/image-uploader'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import type { Account, Category } from '@/types'

export default function AdminAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showVipLevel, setShowVipLevel] = useState(false)
  const [showVipGuns, setShowVipGuns] = useState(false)
  const [showSkins, setShowSkins] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    rank: '',
    vipLevel: '0',
    vipGuns: '0',
    legendaryGuns: '0',
    skins: '0',
    characters: '',
    backpack: '',
    description: '',
    thumbnail: '',
    images: '',
    username: '',
    password: '',
    featured: false,
    categoryId: '',
  })

  useEffect(() => {
    fetchData()
  }, [search, statusFilter])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)

      const [accountsRes, categoriesRes] = await Promise.all([
        fetch(`/api/accounts?${params.toString()}&pageSize=100`),
        fetch('/api/categories'),
      ])

      const accountsData = await accountsRes.json()
      const categoriesData = await categoriesRes.json()

      if (accountsData.success) setAccounts(accountsData.data.items)
      if (categoriesData.success) setCategories(categoriesData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingAccount
      ? `/api/accounts/${editingAccount.id}`
      : '/api/accounts'

    try {
      const res = await fetch(url, {
        method: editingAccount ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          vipLevel: formData.vipLevel ? parseInt(formData.vipLevel) : 0,
          vipGuns: formData.vipGuns ? parseInt(formData.vipGuns) : 0,
          legendaryGuns: formData.legendaryGuns ? parseInt(formData.legendaryGuns) : 0,
          skins: formData.skins ? parseInt(formData.skins) : 0,
          characters: formData.characters.split('\n').filter(Boolean),
          backpack: formData.backpack.split('\n').filter(Boolean),
          images: formData.images.split('\n').filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', editingAccount ? 'Cập nhật thành công' : 'Tạo tài khoản thành công')
      setShowModal(false)
      setEditingAccount(null)
      resetForm()
      fetchData()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      title: account.title,
      price: account.price.toString(),
      rank: account.rank,
      vipLevel: account.vipLevel > 0 ? account.vipLevel.toString() : '',
      vipGuns: account.vipGuns > 0 ? account.vipGuns.toString() : '',
      legendaryGuns: account.legendaryGuns.toString(),
      skins: account.skins > 0 ? account.skins.toString() : '',
      characters: Array.isArray(account.characters) ? account.characters.join('\n') : '',
      backpack: Array.isArray(account.backpack) ? account.backpack.join('\n') : '',
      description: account.description,
      thumbnail: account.thumbnail || '',
      images: Array.isArray(account.images) ? account.images.join('\n') : '',
      username: account.username,
      password: account.password,
      featured: account.featured,
      categoryId: account.categoryId || '',
    })
    setShowVipLevel(account.vipLevel > 0)
    setShowVipGuns(account.vipGuns > 0)
    setShowSkins(account.skins > 0)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này?')) return

    try {
      const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Xóa tài khoản thành công')
      fetchData()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const handleToggleStatus = async (account: Account) => {
    const newStatus = account.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE'

    try {
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', newStatus === 'SOLD' ? 'Đã đánh dấu là đã bán' : 'Đã khôi phục')
      fetchData()
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      rank: '',
      vipLevel: '',
      vipGuns: '',
      legendaryGuns: '0',
      skins: '',
      characters: '',
      backpack: '',
      description: '',
      thumbnail: '',
      images: '',
      username: '',
      password: '',
      featured: false,
      categoryId: '',
    })
    setShowVipLevel(false)
    setShowVipGuns(false)
    setShowSkins(false)
  }

  const ranks = [
    'Đồng', 'Bạc', 'Vàng', 'Bạch kim', 'Kim cương',
    'Vua Súng', 'Thần súng', 'Huyền Thoại', 'Thần Thoại', 'Truyền kì 3k7+'
  ]

  const ranksForSelect = ranks.map(r => ({ value: r, label: r }))

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Quản lý tài khoản</h1>
            <p className="text-text-secondary">Tạo, chỉnh sửa và xóa tài khoản</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Thêm tài khoản
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm tài khoản..."
                icon={<Search className="w-5 h-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'AVAILABLE', label: 'Còn hàng' },
                { value: 'SOLD', label: 'Đã bán' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Tài khoản</th>
                  <th className="text-left p-4 font-semibold">Rank/VIP</th>
                  <th className="text-left p-4 font-semibold">Giá</th>
                  <th className="text-left p-4 font-semibold">Trạng thái</th>
                  <th className="text-right p-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center overflow-hidden">
                          {account.thumbnail ? (
                            <img src={account.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Crown className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{account.title}</p>
                          <p className="text-sm text-text-muted truncate max-w-[200px]">
                            {account.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary">{account.rank}</Badge>
                        {account.vipLevel > 0 && (
                          <Badge variant="primary" className="w-fit">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP {account.vipLevel}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary">{formatPrice(account.price)}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={account.status === 'AVAILABLE' ? 'success' : 'error'}
                      >
                        {account.status === 'AVAILABLE' ? 'Còn hàng' : 'Đã bán'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(account)}
                          className={`p-2 rounded-lg transition-colors ${
                            account.status === 'AVAILABLE'
                              ? 'hover:bg-error/10 text-error'
                              : 'hover:bg-success/10 text-success'
                          }`}
                          title={account.status === 'AVAILABLE' ? 'Đánh dấu đã bán' : 'Khôi phục'}
                        >
                          {account.status === 'AVAILABLE' ? (
                            <Trash2 className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(account)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {accounts.length === 0 && !loading && (
              <div className="text-center py-12">
                <Crown className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                <p className="text-text-secondary">Chưa có tài khoản nào</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingAccount(null); resetForm(); }}
        title={editingAccount ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Danh mục"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              placeholder="Chọn danh mục"
            />
            <Input
              label="Giá (VNĐ)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Rank"
              options={ranksForSelect}
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              required
              placeholder="Chọn rank"
            />
            {showVipLevel && (
              <Input
                label="Level"
                type="number"
                value={formData.vipLevel}
                onChange={(e) => setFormData({ ...formData, vipLevel: e.target.value })}
                placeholder="Nhập level"
              />
            )}
          </div>

          {!showVipLevel && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowVipLevel(true)}
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Level
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showVipGuns && (
              <div className="relative">
                <Input
                  label="VIP Gun"
                  type="number"
                  value={formData.vipGuns}
                  onChange={(e) => setFormData({ ...formData, vipGuns: e.target.value })}
                  placeholder="Nhập số VIP Gun"
                />
                <button
                  type="button"
                  onClick={() => { setShowVipGuns(false); setFormData({ ...formData, vipGuns: '' }); }}
                  className="absolute top-0 right-0 mt-7 mr-1 text-text-muted hover:text-error text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            {showSkins && (
              <div className="relative">
                <Input
                  label="Skins"
                  type="number"
                  value={formData.skins}
                  onChange={(e) => setFormData({ ...formData, skins: e.target.value })}
                  placeholder="Nhập số skins"
                />
                <button
                  type="button"
                  onClick={() => { setShowSkins(false); setFormData({ ...formData, skins: '' }); }}
                  className="absolute top-0 right-0 mt-7 mr-1 text-text-muted hover:text-error text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {!showVipGuns && !showSkins && (
            <div className="flex gap-2">
              {!showVipGuns && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowVipGuns(true)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm VIP Gun
                </Button>
              )}
              {!showSkins && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowSkins(true)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Skins
                </Button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tài khoản game"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <Input
              label="Mật khẩu game"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Input
            label="Ảnh đại diện (URL)"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          />
          
          <ImageUploader
            label="Hoặc tải ảnh đại diện lên"
            value={formData.thumbnail}
            onChange={(url) => setFormData({ ...formData, thumbnail: url })}
            maxSize={5}
          />

          <Textarea
            label="Ảnh gallery (mỗi dòng 1 URL)"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          
          <GalleryUploader
            label="Hoặc tải ảnh gallery lên"
            value={formData.images.split('\n').filter(Boolean)}
            onChange={(urls) => setFormData({ ...formData, images: urls.join('\n') })}
            maxImages={10}
            maxSize={5}
          />

          <Textarea
            label="Nhân vật (mỗi dòng 1 tên)"
            value={formData.characters}
            onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
            placeholder="Captain&#10;Shadow"
          />

          <Textarea
            label="Túi đồ (mỗi dòng 1 item)"
            value={formData.backpack}
            onChange={(e) => setFormData({ ...formData, backpack: e.target.value })}
          />

          <Textarea
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm">Tài khoản nổi bật</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowModal(false); setEditingAccount(null); }}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              {editingAccount ? 'Cập nhật' : 'Tạo tài khoản'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
