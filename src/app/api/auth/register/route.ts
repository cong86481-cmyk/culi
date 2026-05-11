import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { generateTransferNote, validators } from '@/lib/utils'

// Simple in-memory rate limiting for registration
const registerAttempts = new Map<string, { count: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_ATTEMPTS = 10

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function isRateLimited(ip: string): boolean {
  const record = registerAttempts.get(ip)
  if (!record) return false

  const now = Date.now()
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    registerAttempts.delete(ip)
    return false
  }

  return record.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string): void {
  const record = registerAttempts.get(ip)
  if (record) {
    record.count++
    record.lastAttempt = Date.now()
  } else {
    registerAttempts.set(ip, { count: 1, lastAttempt: Date.now() })
  }
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request)

  // Check rate limit
  if (isRateLimited(clientIP)) {
    return NextResponse.json(
      { success: false, error: 'Quá nhiều lần thử đăng ký. Vui lòng thử lại sau.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { username, email, password } = body

    // Validate inputs
    const errors: Record<string, string> = {}

    const usernameError = validators.username(username)
    if (usernameError) errors.username = usernameError

    const emailError = validators.email(email)
    if (emailError) errors.email = emailError

    const passwordError = validators.password(password)
    if (passwordError) errors.password = passwordError

    if (Object.keys(errors).length > 0) {
      recordAttempt(clientIP)
      return NextResponse.json(
        { success: false, error: Object.values(errors)[0], field: Object.keys(errors)[0] },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { username: username.trim() },
        ],
      },
    })

    if (existingUser) {
      recordAttempt(clientIP)
      const field = existingUser.email === email.toLowerCase().trim() ? 'email' : 'username'
      return NextResponse.json(
        { success: false, error: `${field === 'email' ? 'Email' : 'Tên đăng nhập'} đã được sử dụng`, field },
        { status: 400 }
      )
    }

    // Hash password with stronger salt rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with unique transfer note
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'CUSTOMER',
        balance: 0,
        transferNote: generateTransferNote(),
      },
    })

    // Clear rate limit on success
    registerAttempts.delete(clientIP)

    // Generate token and set cookie
    const token = generateToken(user as any)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    )
  }
}
