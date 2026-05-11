'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, GripVertical, Image, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { toast } from '@/components/ui/toast'

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  order: number
  active: boolean
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      if (data.success) {
        setBanners(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners }),
      })
      const data = await res.json()

      if (data.success) {
        toast('success', 'Lưu thành công!')
      } else {
        toast('error', data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const handleAddBanner = () => {
    setEditingBanner({
      id: `new-${Date.now()}`,
      title: '',
      subtitle: '',
      image: '',
      link: '/marketplace',
      order: banners.length + 1,
      active: true,
    })
    setIsModalOpen(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner({ ...banner })
    setIsModalOpen(true)
  }

  const handleDeleteBanner = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const handleSaveBanner = () => {
    if (!editingBanner) return

    const existingIndex = banners.findIndex(b => b.id === editingBanner.id)
    if (existingIndex >= 0) {
      const updated = [...banners]
      updated[existingIndex] = editingBanner
      setBanners(updated)
    } else {
      setBanners([...banners, editingBanner])
    }
    setIsModalOpen(false)
    setEditingBanner(null)
  }

  const toggleActive = (id: string) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Quản lý Banner</h1>
            <p className="text-[#A1A1AA]">Quản lý các banner hiển thị trên trang chủ</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAddBanner}>
              <Plus className="w-5 h-5 mr-2" />
              Thêm Banner
            </Button>
            <Button onClick={handleSave} isLoading={saving} variant="primary">
              <Save className="w-5 h-5 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </motion.div>

        {/* Banner List */}
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1A1A24', border: '1px solid #2D2D3A' }}>
              <Image className="w-16 h-16 mx-auto mb-4 text-[#71717A]" />
              <p className="text-[#A1A1AA] mb-4">Chưa có banner nào</p>
              <Button onClick={handleAddBanner}>
                <Plus className="w-5 h-5 mr-2" />
                Thêm Banner đầu tiên
              </Button>
            </div>
          ) : (
            banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: '#1A1A24', border: '1px solid #2D2D3A' }}
              >
                <div className="text-[#71717A] cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ backgroundColor: '#252532' }}>
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-[#71717A]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{banner.title || 'Chưa có tiêu đề'}</h3>
                  <p className="text-sm text-[#71717A] truncate">{banner.subtitle || 'Chưa có mô tả'}</p>
                  <p className="text-xs text-[#71717A] mt-1">Link: {banner.link || '/'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      banner.active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-[#252532] text-[#71717A]'
                    }`}
                  >
                    {banner.active ? 'Hiển thị' : 'Ẩn'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="p-2 rounded-lg hover:bg-[#252532] transition-colors text-[#A1A1AA] hover:text-[#FF6B00]"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 rounded-lg hover:bg-[#252532] transition-colors text-[#A1A1AA] hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg p-6 rounded-2xl"
            style={{ backgroundColor: '#1A1A24', border: '1px solid #2D2D3A' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Chỉnh sửa Banner</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-[#252532]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Tiêu đề"
                value={editingBanner.title}
                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                placeholder="VD: Khuyến mãi mùa hè"
              />
              
              <Textarea
                label="Mô tả"
                value={editingBanner.subtitle}
                onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                placeholder="VD: Giảm giá 20% cho tài khoản VIP"
              />

              <Input
                label="Link Banner"
                value={editingBanner.link}
                onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                placeholder="/marketplace"
              />

              <Input
                label="URL Hình ảnh"
                value={editingBanner.image}
                onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                placeholder="https://example.com/banner.jpg"
              />

              <ImageUploader
                label="Hoặc tải ảnh lên"
                value={editingBanner.image}
                onChange={(url) => setEditingBanner({ ...editingBanner, image: url })}
                maxSize={10}
              />

              {editingBanner.image && (
                <div className="rounded-lg overflow-hidden h-32 relative">
                  <img src={editingBanner.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingBanner.active}
                  onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="active" className="text-sm">Hiển thị banner này</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
                Hủy
              </Button>
              <Button onClick={handleSaveBanner} variant="primary" className="flex-1">
                Lưu Banner
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
