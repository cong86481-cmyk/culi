import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    })

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...account,
        characters: JSON.parse(account.characters),
        backpack: JSON.parse(account.backpack),
        images: JSON.parse(account.images),
      },
    })
  } catch (error) {
    console.error('Get account error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

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
      status,
    } = body

    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(rank && { rank }),
        ...(vipLevel !== undefined && { vipLevel: parseInt(vipLevel) }),
        ...(vipGuns !== undefined && { vipGuns: parseInt(vipGuns) }),
        ...(legendaryGuns !== undefined && { legendaryGuns: parseInt(legendaryGuns) }),
        ...(skins !== undefined && { skins: parseInt(skins) }),
        ...(characters && { characters: JSON.stringify(characters) }),
        ...(backpack && { backpack: JSON.stringify(backpack) }),
        ...(description !== undefined && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(images && { images: JSON.stringify(images) }),
        ...(username && { username }),
        ...(password && { password }),
        ...(featured !== undefined && { featured }),
        ...(categoryId !== undefined && { categoryId }),
        ...(status && { status }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tài khoản thành công',
      data: account,
    })
  } catch (error) {
    console.error('Update account error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.account.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa tài khoản thành công',
    })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
