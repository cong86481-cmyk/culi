export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại, mã OTP đã được gửi',
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete any existing OTPs for this email
    await prisma.passwordReset.deleteMany({
      where: { email: email.toLowerCase() },
    })

    // Create new OTP
    await prisma.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        otp,
        expiresAt,
      },
    })

    // In production, you would send email here
    // For now, we'll return the OTP in the response for testing
    console.log(`[OTP] Email: ${email}, OTP: ${otp}`)

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example with a hypothetical email service:
    // await sendEmail({
    //   to: email,
    //   subject: 'Mã xác thực đặt lại mật khẩu CFL Marketplace',
    //   html: `
    //     <h1>Đặt lại mật khẩu</h1>
    //     <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
    //     <p>Mã có hiệu lực trong 5 phút.</p>
    //     <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    //   `
    // })

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
      // Include OTP in response for development/testing only
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
