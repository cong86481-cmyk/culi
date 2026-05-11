import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      )
    }

    // Get account
    const account = await prisma.account.findUnique({
      where: { id: params.id },
    })

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản' },
        { status: 404 }
      )
    }

    if (account.status === 'SOLD') {
      return NextResponse.json(
        { success: false, error: 'Tài khoản đã được bán' },
        { status: 400 }
      )
    }

    // Check user balance
    if (user.balance < account.price) {
      return NextResponse.json(
        { success: false, error: 'Số dư không đủ' },
        { status: 400 }
      )
    }

    // Check if user already purchased this account
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        accountId: account.id,
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { success: false, error: 'Bạn đã mua tài khoản này rồi' },
        { status: 400 }
      )
    }

    // Perform transaction
    await prisma.$transaction(async (tx) => {
      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: account.price } },
      })

      // Mark account as sold
      await tx.account.update({
        where: { id: account.id },
        data: { status: 'SOLD' },
      })

      // Create purchase record
      await tx.purchase.create({
        data: {
          userId: user.id,
          accountId: account.id,
          price: account.price,
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'PURCHASE',
          amount: -account.price,
          description: `Mua tài khoản: ${account.title}`,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Mua tài khoản thành công',
      data: {
        accountId: account.id,
        username: account.username,
        password: account.password,
      },
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi mua tài khoản' },
      { status: 500 }
    )
  }
}
