'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Building2, User, Crown, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'

interface SettingsData {
  website_name: string
  website_description: string
  bank_name: string
  bank_account: string
  bank_holder: string
  minimum_deposit: string
  contact_email: string
  contact_phone: string
  footer_text: string
  welcome_notification_enabled: string
  welcome_notification_title: string
  welcome_notification_message: string
  welcome_notification_link: string
  welcome_notification_link_label: string
  zalo_link: string
  facebook_link: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    website_name: 'CFL Marketplace',
    website_description: 'Nền tảng mua bán tài khoản CrossFire Legends uy tín',
    bank_name: 'Vietcombank',
    bank_account: '1234567890',
    bank_holder: 'CFL MARKETPLACE',
    minimum_deposit: '10000',
    contact_email: 'support@cfl-market.vn',
    contact_phone: '0901 234 567',
    footer_text: '© 2024 CFL Marketplace. Tất cả quyền được bảo lưu.',
    welcome_notification_enabled: 'true',
    welcome_notification_title: 'Chào mừng đến CFL Marketplace!',
    welcome_notification_message: 'Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam',
    welcome_notification_link: '/marketplace',
    welcome_notification_link_label: 'Khám phá ngay',
    zalo_link: '',
    facebook_link: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success && Object.keys(data.data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data.data }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (!data.success) {
        toast('error', data.error || 'Có lỗi xảy ra')
        return
      }

      toast('success', 'Lưu cài đặt thành công')
    } catch (error) {
      toast('error', 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cài đặt website</h1>
            <p className="text-text-secondary">Quản lý cấu hình và nội dung website</p>
          </div>
          <Button onClick={handleSave} isLoading={saving}>
            <Save className="w-5 h-5 mr-2" />
            Lưu thay đổi
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Thông tin chung</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Tên website"
                value={settings.website_name}
                onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
              />
              <Textarea
                label="Mô tả website"
                value={settings.website_description}
                onChange={(e) => setSettings({ ...settings, website_description: e.target.value })}
              />
              <Textarea
                label="Nội dung footer"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              />
            </div>
          </motion.div>

          {/* Bank Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-bold">Thông tin ngân hàng</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Ngân hàng"
                value="Vietcombank"
                disabled
                className="opacity-70"
              />
              <Input
                label="Số tài khoản"
                value={settings.bank_account}
                onChange={(e) => setSettings({ ...settings, bank_account: e.target.value })}
              />
              <Input
                label="Tên tài khoản"
                value={settings.bank_holder}
                onChange={(e) => setSettings({ ...settings, bank_holder: e.target.value })}
              />
              <Input
                label="Số tiền nạp tối thiểu (VNĐ)"
                type="number"
                value={settings.minimum_deposit}
                onChange={(e) => setSettings({ ...settings, minimum_deposit: e.target.value })}
              />
            </div>
          </motion.div>

          {/* Contact Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <User className="w-5 h-5 text-warning" />
              </div>
              <h2 className="text-xl font-bold">Thông tin liên hệ</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Email liên hệ"
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              />
              <Input
                label="Số điện thoại"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              />
              <Input
                label="Link Zalo"
                placeholder="https://zalo.me/xxx"
                value={settings.zalo_link}
                onChange={(e) => setSettings({ ...settings, zalo_link: e.target.value })}
              />
              <Input
                label="Link Facebook"
                placeholder="https://facebook.com/xxx"
                value={settings.facebook_link}
                onChange={(e) => setSettings({ ...settings, facebook_link: e.target.value })}
              />
            </div>
          </motion.div>

          {/* Welcome Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Thông báo chào mừng</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="welcome_notification_enabled"
                  checked={settings.welcome_notification_enabled === 'true'}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    welcome_notification_enabled: e.target.checked ? 'true' : 'false' 
                  })}
                  className="w-5 h-5 rounded border-border bg-surface accent-primary"
                />
                <label htmlFor="welcome_notification_enabled" className="text-sm font-medium">
                  Bật thông báo chào mừng khi vào website
                </label>
              </div>
              <Input
                label="Tiêu đề thông báo"
                value={settings.welcome_notification_title}
                onChange={(e) => setSettings({ ...settings, welcome_notification_title: e.target.value })}
              />
              <Textarea
                label="Nội dung thông báo"
                value={settings.welcome_notification_message}
                onChange={(e) => setSettings({ ...settings, welcome_notification_message: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Link nút (VD: /marketplace)"
                  value={settings.welcome_notification_link}
                  onChange={(e) => setSettings({ ...settings, welcome_notification_link: e.target.value })}
                />
                <Input
                  label="Nhãn nút (VD: Khám phá ngay)"
                  value={settings.welcome_notification_link_label}
                  onChange={(e) => setSettings({ ...settings, welcome_notification_link_label: e.target.value })}
                />
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-primary/10 to-secondary/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Xem trước</h2>
            </div>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-background-card/50">
                <p className="text-text-muted mb-1">Tên website</p>
                <p className="font-semibold">{settings.website_name}</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card/50">
                <p className="text-text-muted mb-1">Mô tả</p>
                <p className="text-text-secondary">{settings.website_description}</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card/50">
                <p className="text-text-muted mb-1">Thông tin thanh toán</p>
                <p className="font-semibold">{settings.bank_name} - {settings.bank_account}</p>
                <p className="text-text-secondary">{settings.bank_holder}</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card/50">
                <p className="text-text-muted mb-1">Liên hệ</p>
                <p>{settings.contact_email}</p>
                <p>{settings.contact_phone}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
