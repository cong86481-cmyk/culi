import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const rank = searchParams.get('rank') || ''
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const status = searchParams.get('status') || 'AVAILABLE'

    const where: any = {
      status,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (rank) {
      where.rank = rank
    }

    const orderBy: any = {}
    switch (sortBy) {
      case 'cheapest':
        orderBy.price = 'asc'
        break
      case 'expensive':
        orderBy.price = 'desc'
        break
      case 'vip':
        orderBy.vipLevel = 'desc'
        break
      default:
        orderBy.createdAt = 'desc'
    }

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
        },
      }),
      prisma.account.count({ where }),
    ])

    // Parse JSON fields
    const parsedAccounts = accounts.map((account) => ({
      ...account,
      characters: JSON.parse(account.characters),
      backpack: JSON.parse(account.backpack),
      images: JSON.parse(account.images),
    }))

    return NextResponse.json({
      success: true,
      data: {
        items: parsedAccounts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Get accounts error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      price,
      rank,
      vipLevel,
      vipGuns,
      legendaryGuns,
      skins,
      characters,
      backpack,
      description,
      thumbnail,
      images,
      username,
      password,
      featured,
      categoryId,
    } = body

    if (!title || !price || !rank || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const account = await prisma.account.create({
      data: {
        title,
        price: parseFloat(price),
        rank,
        vipLevel: parseInt(vipLevel) || 0,
        vipGuns: parseInt(vipGuns) || 0,
        legendaryGuns: parseInt(legendaryGuns) || 0,
        skins: parseInt(skins) || 0,
        characters: JSON.stringify(characters || []),
        backpack: JSON.stringify(backpack || []),
        description,
        thumbnail,
        images: JSON.stringify(images || []),
        username,
        password,
        featured: featured || false,
        categoryId,
        status: 'AVAILABLE',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: account,
    })
  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
