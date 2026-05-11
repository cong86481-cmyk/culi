export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['zalo_link', 'facebook_link'],
        },
      },
    })

    const result: Record<string, string> = {}

    settings.forEach((setting) => {
      if (setting.value) {
        result[setting.key] = setting.value
      }
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    // Return empty data instead of error so the UI still works
    return NextResponse.json({
      success: true,
      data: {},
    })
  }
}
