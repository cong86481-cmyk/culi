export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { generateTransferNote } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, method } = body

    if (!amount || amount < 10000) {
      return NextResponse.json(
        { success: false, error: 'Số tiền nạp tối thiểu là 10,000 VNĐ' },
        { status: 400 }
      )
    }

    let transferNote = user.transferNote
    if (!transferNote) {
      transferNote = generateTransferNote()
      await prisma.user.update({
        where: { id: user.id },
        data: { transferNote },
      })
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        method: method || 'bank_transfer',
        transferNote,
        status: 'PENDING',
      },
    })

    const bankName = await prisma.setting.findUnique({ where: { key: 'bank_name' } })
    const bankAccount = await prisma.setting.findUnique({ where: { key: 'bank_account' } })
    const bankHolder = await prisma.setting.findUnique({ where: { key: 'bank_holder' } })

    return NextResponse.json({
      success: true,
      message: 'Tạo yêu cầu nạp tiền thành công',
      data: {
        depositId: deposit.id,
        amount: deposit.amount,
        transferNote: deposit.transferNote,
        bankInfo: {
          bankName: bankName?.value || 'Vietcombank',
          accountNumber: bankAccount?.value || '1234567890',
          accountHolder: bankHolder?.value || 'CFL MARKETPLACE',
        },
      },
    })
  } catch (error) {
    console.error('Create deposit error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
