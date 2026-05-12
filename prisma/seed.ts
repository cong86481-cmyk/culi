import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cfl.vn' },
    update: {},
    create: {
      username: 'AdminCFL',
      email: 'admin@cfl.vn',
      password: adminPassword,
      role: 'ADMIN',
      balance: 10000000,
      transferNote: 'CFLADMIN001',
    },
  })
  console.log('✅ Created admin user')

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cfl.vn' },
    update: {},
    create: {
      username: 'DemoGamer',
      email: 'demo@cfl.vn',
      password: demoPassword,
      role: 'CUSTOMER',
      balance: 500000,
      transferNote: 'CFLDEMO001',
    },
  })
  console.log('✅ Created demo user')

  // Create more demo users
  const users = [
    { username: 'GamerVN2024', email: 'gamer1@cfl.vn', balance: 200000 },
    { username: 'CFProPlayer', email: 'gamer2@cfl.vn', balance: 1500000 },
    { username: 'LegendHunter', email: 'gamer3@cfl.vn', balance: 3000000 },
  ]

  for (const user of users) {
    const password = await bcrypt.hash('user123', 12)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        username: user.username,
        email: user.email,
        password,
        role: 'CUSTOMER',
        balance: user.balance,
        transferNote: `CFL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    })
  }
  console.log('✅ Created additional users')

  // Create categories
  const categories = [
    { name: 'Icloud', slug: 'icloud' },
    { name: 'Facebook', slug: 'facebook' },
    { name: 'Gmail', slug: 'gmail' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Created categories')

  // Get categories for assignment
  const categoryList = await prisma.category.findMany()

  // Create demo accounts
  const accounts = [
    {
      title: 'Account VIP 5 - Rank Chiến Thần - 15 Vũ Khí Huyền Thoại',
      price: 2500000,
      rank: 'Chiến Thần',
      vipLevel: 5,
      vipGuns: 8,
      legendaryGuns: 15,
      skins: 45,
      characters: ['Captain', 'Shadow', 'Ghost', 'Phoenix', 'Viper'],
      backpack: ['AK-47 Dragon', 'AWP Galaxy', 'Desert Eagle Gold', 'MP5 Neon'],
      description: 'Account VIP 5 cực kỳ xịn xò với 15 vũ khí huyền thoại, 8 vũ khí VVIP, rank Chiến Thần. Tài khoản đã được nạp tiền đầy đủ, có nhiều skin hiếm và characters đẹp. Phù hợp cho game thủ muốn trải nghiệm game ngay với acc mạnh.',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
      ],
      username: 'vip5champion',
      password: 'Vip2024Pass!',
      featured: true,
      categorySlug: 'icloud',
    },
    {
      title: 'Tài Khoản Rank Bạch Kim - 5 Vũ Khí VVIP',
      price: 850000,
      rank: 'Bạch Kim',
      vipLevel: 3,
      vipGuns: 5,
      legendaryGuns: 8,
      skins: 20,
      characters: ['Storm', 'Blaze'],
      backpack: ['M4A1 Thunder', 'AWP Lightning'],
      description: 'Tài khoản rank Bạch Kim với 5 vũ khí VVIP, phù hợp cho game thủ muốn leo rank nhanh. Account còn mới, chưa sử dụng nhiều, full skin đẹp.',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
      ],
      username: 'platinumhero',
      password: 'Platinum123!',
      featured: true,
      categorySlug: 'facebook',
    },
    {
      title: 'Account VIP 3 - Rank Cao Thủ - 10 Skin Hiếm',
      price: 1500000,
      rank: 'Cao Thủ',
      vipLevel: 3,
      vipGuns: 6,
      legendaryGuns: 10,
      skins: 35,
      characters: ['Dragon', 'Phoenix', 'Tiger'],
      backpack: ['AK-47 Fire', 'AWP Lava', ' Glock Neon'],
      description: 'Account VIP 3 rank Cao Thủ với bộ sưu tập skin cực kỳ đẹp. Nhiều vũ khí huyền thoại và VVIP. Tài khoản đã qua sử dụng nhưng vẫn còn rất tốt.',
      thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop',
      ],
      username: 'eliteplayer',
      password: 'Elite2024!',
      featured: true,
      categorySlug: 'gmail',
    },
    {
      title: 'Tài Khoản Mới Tạo - Rank Đồng - 2 VVIP Guns',
      price: 150000,
      rank: 'Đồng',
      vipLevel: 1,
      vipGuns: 2,
      legendaryGuns: 3,
      skins: 8,
      characters: ['Rookie'],
      backpack: ['Knife Basic'],
      description: 'Tài khoản mới tạo, rank Đồng, phù hợp cho người mới chơi muốn bắt đầu hành trình leo rank của mình. Đã có sẵn 2 vũ khí VVIP.',
      thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=800&h=600&fit=crop',
      images: [],
      username: 'newbievn',
      password: 'Newbie123!',
      featured: false,
      categorySlug: 'icloud',
    },
    {
      title: 'Account VIP 4 - Rank Kim Cương - Collection Hoàn Chỉnh',
      price: 1800000,
      rank: 'Kim Cương',
      vipLevel: 4,
      vipGuns: 7,
      legendaryGuns: 12,
      skins: 40,
      characters: ['Shadow', 'Phoenix', 'Wolf', 'Eagle'],
      backpack: ['AK-47 Carbon', 'AWP Safari', 'Desert Eagle Silver'],
      description: 'Account VIP 4 rank Kim Cương với bộ sưu tập vũ khí hoàn chỉnh. Nhiều skin đẹp, characters rare. Đây là lựa chọn tuyệt vời cho game thủ nghiêm túc.',
      thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop',
      ],
      username: 'diamondking',
      password: 'Diamond2024!',
      featured: true,
      categorySlug: 'facebook',
    },
    {
      title: 'Tài Khoản Rank Vàng - VIP 2 - 4 VVIP Guns',
      price: 450000,
      rank: 'Vàng',
      vipLevel: 2,
      vipGuns: 4,
      legendaryGuns: 6,
      skins: 15,
      characters: ['Soldier', 'Ranger'],
      backpack: ['M4A1 Sniper', 'AWP Forest'],
      description: 'Tài khoản rank Vàng với VIP 2, có 4 vũ khí VVIP và 6 vũ khí huyền thoại. Phù hợp cho game thủ trung cấp muốn nâng cấp acc.',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
      images: [],
      username: 'goldengamer',
      password: 'Golden123!',
      featured: false,
      categorySlug: 'gmail',
    },
  ]

  for (const acc of accounts) {
    const category = categoryList.find(c => c.slug === acc.categorySlug)
    await prisma.account.create({
      data: {
        title: acc.title,
        price: acc.price,
        rank: acc.rank,
        vipLevel: acc.vipLevel,
        vipGuns: acc.vipGuns,
        legendaryGuns: acc.legendaryGuns,
        skins: acc.skins,
        characters: JSON.stringify(acc.characters),
        backpack: JSON.stringify(acc.backpack),
        description: acc.description,
        thumbnail: acc.thumbnail,
        images: JSON.stringify(acc.images),
        username: acc.username,
        password: acc.password,
        featured: acc.featured,
        categoryId: category?.id,
        status: 'AVAILABLE',
      },
    })
  }
  console.log('✅ Created demo accounts')

  // Create some settings
  const settings = [
    { key: 'website_name', value: 'CFL Marketplace' },
    { key: 'website_description', value: 'Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam' },
    { key: 'bank_name', value: 'Vietcombank' },
    { key: 'bank_account', value: '1032888290' },
    { key: 'bank_holder', value: 'CFL MARKETPLACE' },
    { key: 'minimum_deposit', value: '10000' },
    { key: 'contact_email', value: 'support@cfl-market.vn' },
    { key: 'contact_phone', value: '0901 234 567' },
    { key: 'zalo_link', value: 'https://zalo.me/0812425559' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Created settings')

  // Create some sample deposits
  await prisma.deposit.create({
    data: {
      userId: demoUser.id,
      amount: 500000,
      method: 'bank_transfer',
      transferNote: demoUser.transferNote!,
      status: 'APPROVED',
    },
  })
  console.log('✅ Created sample deposits')

  // Create Mystery Box - Single 399K box
  interface MysteryBoxItem {
    name: string
    type: string
    rarity: string
    dropRate: number
    value: number
    minQuantity?: number
    maxQuantity?: number
  }

  const mysteryBoxes: Array<{
    name: string
    slug: string
    description: string
    price: number
    discount: number
    stock: number
    items: MysteryBoxItem[]
  }> = [
    {
      name: 'Túi Mù 399K',
      slug: 'tui-mu-399k',
      description: 'Nhận ngay tài khoản CrossFire với giá 399K! Thông tin tài khoản sẽ hiện khi trúng.',
      price: 399000,
      discount: 0,
      stock: -1,
      items: [],
    },
  ]

  for (const box of mysteryBoxes) {
    // Delete existing openings and box first
    await prisma.mysteryBoxOpening.deleteMany({
      where: { box: { slug: box.slug } },
    })
    await prisma.mysteryBox.deleteMany({
      where: { slug: box.slug },
    })

    await prisma.mysteryBox.create({
      data: {
        name: box.name,
        slug: box.slug,
        description: box.description,
        image: null,
        price: box.price,
        discount: box.discount,
        stock: box.stock,
        status: 'ACTIVE',
        items: {
          create: box.items.map((item) => ({
            name: item.name,
            description: item.name,
            type: item.type,
            rarity: item.rarity,
            dropRate: item.dropRate,
            value: item.value,
            minQuantity: item.minQuantity || 1,
            maxQuantity: item.maxQuantity || 1,
          })),
        },
      },
    })
    console.log(`✅ Created mystery box: ${box.name}`)
  }
  console.log('✅ Created mystery boxes')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
