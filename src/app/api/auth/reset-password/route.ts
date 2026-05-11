export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Find valid OTP
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        email: email.toLowerCase(),
        otp,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: 'Mã OTP không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Update password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    })

    // Mark OTP as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
