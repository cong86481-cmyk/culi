import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [accountCount, categoryCount, userCount] = await Promise.all([
      prisma.account.count(),
      prisma.category.count(),
      prisma.user.count(),
    ])

    const recentAccounts = await prisma.account.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      counts: {
        accounts: accountCount,
        categories: categoryCount,
        users: userCount,
      },
      recentAccounts,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        database: 'Connection Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
