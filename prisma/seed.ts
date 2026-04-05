import { PrismaClient } from '../app/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const existingDog = await prisma.dogProfile.findFirst()
  if (!existingDog) {
    await prisma.dogProfile.create({ data: { name: 'הכלב שלי' } })
    console.log('Created DogProfile')
  }

  const existingSettings = await prisma.appSettings.findFirst()
  if (!existingSettings) {
    await prisma.appSettings.create({ data: { walkAlertThresholdHours: 4 } })
    console.log('Created AppSettings')
  }

  const existingAdmin = await prisma.user.findFirst({ where: { isAdmin: true } })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12)
    await prisma.user.create({
      data: { username: 'admin', passwordHash, displayName: 'מנהל', isAdmin: true },
    })
    console.log('Created admin user: username=admin, password=admin123')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
