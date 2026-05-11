export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
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

    const [
      totalUsers,
      totalAccounts,
      totalSoldAccounts,
      pendingDeposits,
      totalRevenue,
      recentPurchases,
      recentDeposits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count({ where: { status: 'AVAILABLE' } }),
      prisma.account.count({ where: { status: 'SOLD' } }),
      prisma.deposit.count({ where: { status: 'PENDING' } }),
      prisma.purchase.aggregate({ _sum: { price: true } }),
      prisma.purchase.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: true, account: true },
      }),
      prisma.deposit.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalAvailableAccounts: totalAccounts,
        totalSoldAccounts,
        pendingDeposits,
        totalRevenue: totalRevenue._sum.price || 0,
        recentPurchases,
        recentDeposits,
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
