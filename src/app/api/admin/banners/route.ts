export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: banners.map(banner => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        link: banner.link || '/',
        order: banner.order,
        active: banner.active,
      })),
    })
  } catch (error) {
    console.error('Get admin banners error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const { banners } = await request.json()

    // Delete all existing banners and recreate
    await prisma.banner.deleteMany()

    // Create new banners
    for (const banner of banners) {
      await prisma.banner.create({
        data: {
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          image: banner.image || '',
          link: banner.link || '',
          order: banner.order || 0,
          active: banner.active ?? true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Lưu banners thành công',
    })
  } catch (error) {
    console.error('Update banners error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi lưu banners' },
      { status: 500 }
    )
  }
}
