import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ranks = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Cao Thủ', 'Chiến Thần', 'Thách Đấu']
const characters = ['Captain', 'Shadow', 'Ghost', 'Phoenix', 'Viper', 'Storm', 'Blaze', 'Dragon', 'Tiger', 'Wolf', 'Eagle', 'Phantom', 'Reaper', 'Knight', 'Paladin', 'Legend', 'Champion', 'Master', 'Soldier', 'Ranger']
const weapons = ['AK-47 Dragon', 'AWP Galaxy', 'Desert Eagle Gold', 'MP5 Neon', 'M4A1 Thunder', 'AWP Lightning', 'AK-47 Fire', 'AWP Lava', 'Glock Neon', 'AK-47 Carbon', 'AWP Safari', 'Desert Eagle Silver', 'M4A1 Sniper', 'AWP Forest', 'Pistol Default', 'Knife Basic']
const thumbnails = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
]

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems(arr: string[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomPrice() {
  return Math.floor(Math.random() * 5000000) + 100000
}

async function main() {
  console.log('🎮 Adding 20 new accounts...')

  const categories = await prisma.category.findMany()
  const categoryArray = Array.isArray(categories) ? categories : []

  const newAccounts = Array.from({ length: 20 }, (_, i) => {
    const rank = randomItem(ranks)
    const vipLevel = Math.floor(Math.random() * 8)
    const vipGuns = Math.floor(Math.random() * 15)
    const legendaryGuns = Math.floor(Math.random() * 25)
    const skins = Math.floor(Math.random() * 80) + 5
    const charCount = Math.floor(Math.random() * 5) + 1
    const weaponCount = Math.floor(Math.random() * 4) + 1
    const category = categoryArray.length > 0 ? categoryArray[Math.floor(Math.random() * categoryArray.length)] : null

    return {
      title: `Account VIP ${vipLevel} - Rank ${rank} - ${legendaryGuns} Vũ Khí Huyền Thoại`,
      price: randomPrice(),
      rank,
      vipLevel,
      vipGuns,
      legendaryGuns,
      skins,
      characters: JSON.stringify(randomItems(characters, charCount)),
      backpack: JSON.stringify(randomItems(weapons, weaponCount)),
      description: `Tài khoản VIP ${vipLevel} rank ${rank} với ${legendaryGuns} vũ khí huyền thoại và ${vipGuns} vũ khí VVIP. ${skins} skins đẹp. Tài khoản chất lượng cao, đã qua kiểm tra.`,
      thumbnail: randomItem(thumbnails),
      images: JSON.stringify(randomItems(thumbnails, Math.floor(Math.random() * 3) + 1)),
      username: `acc${Date.now()}_${i}`,
      password: `Pass${Math.random().toString(36).substring(2, 8)}!`,
      featured: Math.random() > 0.8,
      categoryId: category?.id ?? null,
      status: 'AVAILABLE',
    }
  })

  for (const acc of newAccounts) {
    await prisma.account.create({ data: acc })
  }

  console.log(`✅ Added ${newAccounts.length} new accounts!`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
