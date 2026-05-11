import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.setting.upsert({
    where: { key: 'bank_account' },
    update: { value: '1032888290' },
    create: { key: 'bank_account', value: '1032888290' }
  })
  console.log('Updated bank account to 1032888290')
}

main().finally(() => (prisma as any).$disconnect())
