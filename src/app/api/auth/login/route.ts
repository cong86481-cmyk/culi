import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { validators } from '@/lib/utils'

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip)
  if (!record) return false

  const now = Date.now()
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip)
    return false
  }

  return record.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string): void {
  const record = loginAttempts.get(ip)
  if (record) {
    record.count++
    record.lastAttempt = Date.now()
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() })
  }
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request)

  // Check rate limit
  if (isRateLimited(clientIP)) {
    return NextResponse.json(
      { success: false, error: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { username, password } = body

    // Validate inputs
    const usernameError = validators.username(username)
    if (usernameError) {
      return NextResponse.json(
        { success: false, error: usernameError },
        { status: 400 }
      )
    }

    const passwordError = validators.password(password)
    if (passwordError) {
      return NextResponse.json(
        { success: false, error: passwordError },
        { status: 400 }
      )
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    })

    if (!user) {
      recordAttempt(clientIP)
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      recordAttempt(clientIP)
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Clear rate limit on success
    loginAttempts.delete(clientIP)

    // Generate token and set cookie
    const token = generateToken(user as any)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    )
  }
}
