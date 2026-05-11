export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'welcome_notification_enabled',
            'welcome_notification_title',
            'welcome_notification_message',
            'welcome_notification_link',
            'welcome_notification_link_label',
            'zalo_link',
            'facebook_link',
          ],
        },
      },
    })

    const result: Record<string, string> = {
      welcome_notification_enabled: 'true',
      welcome_notification_title: 'Chào mừng đến CFL Marketplace!',
      welcome_notification_message: 'Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam',
      welcome_notification_link: '/marketplace',
      welcome_notification_link_label: 'Khám phá ngay',
    }

    settings.forEach((setting) => {
      result[setting.key] = setting.value
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Get public settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
