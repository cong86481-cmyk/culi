export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: banners.map(banner => ({
        id: banner.id,
        image: banner.image,
        link: banner.link,
        title: banner.title,
        subtitle: banner.subtitle,
        isActive: banner.active,
        order: banner.order,
      })),
    })
  } catch (error) {
    console.error('Get banners error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
