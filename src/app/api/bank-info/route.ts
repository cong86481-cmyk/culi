export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['bank_name', 'bank_account', 'bank_holder'],
        },
      },
    })

    const result: Record<string, string> = {
      bank_name: 'Vietcombank',
      bank_account: '',
      bank_holder: '',
    }

    settings.forEach((setting) => {
      result[setting.key] = setting.value
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Get bank info error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
