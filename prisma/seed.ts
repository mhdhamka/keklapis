import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Simple slugify utility for generating IDs safely
function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const filePath = path.join(process.cwd(), 'data/db.json')
  if (!fs.existsSync(filePath)) {
    console.log("No db.json found at data/db.json to migrate.")
    return
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(rawData)

  console.log("Seeding database from data/db.json into PostgreSQL...")

  // 1. Seed Brands First
  const uniqueBrands = Array.from(new Set(data.products.map((p: any) => p.brand)))

  console.log(`Found ${uniqueBrands.length} unique brands. Upserting...`)
  for (const brandName of uniqueBrands) {
    const nameStr = brandName as string
    const brandId = slugify(nameStr)
    await prisma.brand.upsert({
      where: { brand_name: nameStr },
      update: {},
      create: {
        id: brandId,
        brand_name: nameStr,
        description: `Sarawak Kek Lapis producer: ${nameStr}`
      }
    })
  }

  // 2. Seed Products
  console.log(`Seeding ${data.products.length} products...`)
  for (const item of data.products) {
    const brandRecord = await prisma.brand.findUnique({
      where: { brand_name: item.brand }
    })

    if (!brandRecord) {
      console.warn(`Brand not found for product: ${item.product_name}`)
      continue
    }

    const defaultTasteVector = [
      Math.min(Math.max((item.sweetness ?? 5) / 10, 0), 1),
      Math.min(Math.max((item.richness_dri ?? 100) / 300, 0), 1),
      0.5,
      item.culinary_profile?.toLowerCase().includes("spiced") ? 0.7 : 0.2
    ]

    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.product_name,
        brandId: brandRecord.id,
        type: item.type || "layered-cake",
        sweetness: item.sweetness ?? 5,
        richness: item.richness_dri ?? 100,
        moisture: 5,
        spice: 2,
        taste_vector: defaultTasteVector as any,
      },
      create: {
        id: item.id,
        name: item.product_name,
        brandId: brandRecord.id,
        type: item.type || "layered-cake",
        sweetness: item.sweetness ?? 5,
        richness: item.richness_dri ?? 100,
        moisture: 5,
        spice: 2,
        taste_vector: defaultTasteVector as any,
      }
    })
  }

  // 3. Seed Users
  if (data.users && data.users.length > 0) {
    console.log(`Seeding ${data.users.length} users...`)
    for (const u of data.users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          email: u.email,
          name: u.name,
          image: u.image,
        },
        create: {
          id: u.id,
          email: u.email,
          name: u.name,
          image: u.image,
          createdAt: u.created_at ? new Date(u.created_at) : undefined,
          updatedAt: u.updated_at ? new Date(u.updated_at) : undefined,
        }
      })
    }
  }

  console.log("Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })