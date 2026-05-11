import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action } = body // 'approve' or 'reject'

    const deposit = await prisma.deposit.findUnique({
      where: { id: params.id },
    })

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy yêu cầu nạp tiền' },
        { status: 404 }
      )
    }

    if (deposit.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu này đã được xử lý' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: params.id },
          data: { status: 'APPROVED' },
        }),
        prisma.user.update({
          where: { id: deposit.userId },
          data: { balance: { increment: deposit.amount } },
        }),
        prisma.transaction.create({
          data: {
            userId: deposit.userId,
            type: 'DEPOSIT',
            amount: deposit.amount,
            description: `Nạp tiền qua ${deposit.method}`,
          },
        }),
      ])
    } else {
      await prisma.deposit.update({
        where: { id: params.id },
        data: { status: 'REJECTED' },
      })
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Duyệt thành công' : 'Từ chối thành công',
    })
  } catch (error) {
    console.error('Update deposit error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
