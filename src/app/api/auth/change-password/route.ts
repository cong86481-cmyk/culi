import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu mới không khớp' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Fetch user with password from Prisma directly
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, password: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu hiện tại không đúng' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
