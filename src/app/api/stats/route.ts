export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      availableAccounts,
      soldAccounts,
      totalUsers,
      totalPurchases,
    ] = await Promise.all([
      prisma.account.count({ where: { status: 'AVAILABLE' } }),
      prisma.account.count({ where: { status: 'SOLD' } }),
      prisma.user.count(),
      prisma.purchase.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        availableAccounts,
        soldAccounts,
        totalUsers,
        totalPurchases,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
