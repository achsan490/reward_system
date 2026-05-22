import { PrismaClient } from '@/generated/prisma'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

// Common Indonesian first names
const firstNames = [
    "Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gita", "Hadi", "Indah", "Joko",
    "Kartika", "Lestari", "Maya", "Nurul", "Putri", "Rina", "Sari", "Tono", "Umar", "Wati",
    "Yanti", "Zainal", "Agus", "Bambang", "Dian", "Erna", "Fajar", "Hendra", "Iwan", "Lina",
    "Mega", "Novi", "Oki", "Ratna", "Sinta", "Tuti", "Vina", "Wulan", "Yudi", "Ayu",
    "Bayu", "Desi", "Eka", "Feri", "Hani", "Ika", "Jaya", "Kiki", "Lili", "Mira",
    "Nana", "Oki", "Pandu", "Rini", "Siti", "Tina", "Umi", "Vera", "Winda", "Yuni",
    "Adi", "Bella", "Doni", "Elsa", "Firman", "Hana", "Irfan", "Jihan", "Krisna", "Laila",
    "Maman", "Nina", "Omar", "Putra", "Reza", "Sinta", "Tari", "Udin", "Vivi", "Wahyu"
]

const lastNames = [
    "Pratama", "Wijaya", "Kusuma", "Santoso", "Permana", "Saputra", "Utomo", "Hidayat", "Setiawan", "Rahayu",
    "Lestari", "Wibowo", "Susanto", "Hartono", "Gunawan", "Kurniawan", "Nugroho", "Suryanto", "Purnomo", "Suharto",
    "Firmansyah", "Budiman", "Hakim", "Ramadan", "Iskandar", "Maulana", "Rizki", "Fauzi", "Syahputra", "Mahendra"
]

// Product items for realistic transactions
const products = [
    { name: "Beras Premium 5kg", price: 75000 },
    { name: "Minyak Goreng 2L", price: 35000 },
    { name: "Gula Pasir 1kg", price: 15000 },
    { name: "Telur Ayam 1kg", price: 28000 },
    { name: "Susu UHT 1L", price: 18000 },
    { name: "Kopi Bubuk 200g", price: 25000 },
    { name: "Teh Celup 25s", price: 12000 },
    { name: "Mie Instan 5pcs", price: 10000 },
    { name: "Sabun Mandi", price: 8000 },
    { name: "Shampo Sachet 10pcs", price: 15000 },
    { name: "Pasta Gigi", price: 12000 },
    { name: "Detergen 1kg", price: 20000 },
    { name: "Tissue 250s", price: 18000 },
    { name: "Air Mineral 1500ml", price: 5000 },
    { name: "Snack Ringan", price: 8000 },
    { name: "Biskuit Kaleng", price: 22000 },
    { name: "Roti Tawar", price: 14000 },
    { name: "Mentega 200g", price: 16000 },
    { name: "Keju Slice", price: 24000 },
    { name: "Saus Sambal", price: 10000 }
]

const cashiers = ["Kasir 1", "Kasir 2", "Kasir 3"]

// Generate realistic members with segmentation
function generateMembers(count: number) {
    const members = []
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const hasPhone = Math.random() > 0.1 // 90% have phone numbers

        members.push({
            id: `M${String(i + 1).padStart(4, '0')}`,
            name: `${firstName} ${lastName}`,
            phone: hasPhone ? `08${Math.floor(Math.random() * 900000000 + 100000000)}` : null,
            // Segment: VIP (10%), Regular (60%), Occasional (30%)
            segment: Math.random() < 0.1 ? 'VIP' : Math.random() < 0.7 ? 'REGULAR' : 'OCCASIONAL'
        })
    }
    return members
}

// Generate realistic transaction items
function generateTransactionItems() {
    const itemCount = Math.floor(Math.random() * 5) + 1 // 1-5 items
    const items = []
    let total = 0

    for (let i = 0; i < itemCount; i++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const qty = Math.floor(Math.random() * 3) + 1 // 1-3 qty
        const subtotal = product.price * qty

        items.push({
            name: product.name,
            qty: qty,
            price: product.price,
            subtotal: subtotal
        })
        total += subtotal
    }

    // Round to nearest 1000
    total = Math.round(total / 1000) * 1000

    return { items, total }
}

async function main() {
    console.log('🌱 Starting realistic store data seeding...')

    // Clear existing data
    await prisma.storeTransactionSource.deleteMany()
    console.log('✅ Cleared existing store transactions.')

    // Generate 80 members
    const members = generateMembers(80)
    console.log(`✅ Generated ${members.length} members`)

    const startDate = new Date('2023-10-01')
    const endDate = new Date()
    const transactions: any[] = []

    for (const member of members) {
        let currentDate = new Date(startDate)
        let memberTotalAmount = 0
        const MAX_AMOUNT = 5000000 // 5 Juta Rupiah

        while (currentDate <= endDate && memberTotalAmount < MAX_AMOUNT) {
            // Determine shopping frequency based on segment
            let chance = 0
            if (member.segment === 'VIP') {
                chance = 0.15 // ~4-5 times a month
            } else if (member.segment === 'REGULAR') {
                chance = 0.04 // ~1 time a month
            } else {
                chance = 0.005 // ~once every 6 months
            }

            if (Math.random() < chance) {
                const hour = 8 + Math.floor(Math.random() * 12)
                const txDate = new Date(currentDate)
                txDate.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

                const { items, total } = generateTransactionItems()

                // Ensure we don't exceed the 5M cap with this transaction
                if (memberTotalAmount + total <= MAX_AMOUNT) {
                    transactions.push({
                        transactionId: `TRX-${randomUUID().substring(0, 8).toUpperCase()}`,
                        memberId: member.id,
                        memberName: member.name,
                        transactionDate: txDate,
                        amount: total,
                        phone: member.phone,
                        items: JSON.stringify(items),
                        cashierName: cashiers[Math.floor(Math.random() * cashiers.length)]
                    })
                    memberTotalAmount += total
                } else {
                    // If this transaction would push them over, we can either skip it 
                    // or cap it at exactly 5M (but let's just stop for realism)
                    break 
                }
            }
            currentDate.setDate(currentDate.getDate() + 1)
        }
    }

    // Batch insert
    console.log(`📦 Inserting ${transactions.length} transactions...`)

    const batchSize = 500
    for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize)
        await prisma.storeTransactionSource.createMany({
            data: batch
        })
        console.log(`   ✓ Inserted ${Math.min(i + batchSize, transactions.length)}/${transactions.length}`)
    }

    console.log('🎉 Seeding completed successfully!')
    console.log(`📊 Total: ${transactions.length} transactions from ${members.length} members`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
