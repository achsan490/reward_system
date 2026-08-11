import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

// Common Indonesian names
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

// Product catalog for realistic transactions
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

function generateTransactionItems() {
    const itemCount = Math.floor(Math.random() * 5) + 1
    const items = []
    let total = 0

    for (let i = 0; i < itemCount; i++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const qty = Math.floor(Math.random() * 3) + 1
        const subtotal = product.price * qty

        items.push({
            name: product.name,
            qty: qty,
            price: product.price,
            subtotal: subtotal
        })
        total += subtotal
    }

    total = Math.round(total / 1000) * 1000
    return { items, total }
}

async function updateTransactionsToToday() {
    console.log('🚀 Updating member transactions continuously up to today (August 11, 2026)...')

    // 1. Fetch system point conversion rate
    const conversionRateSetting = await prisma.systemSetting.findUnique({ where: { key: 'point_conversion_rate' } })
    const conversionRate = conversionRateSetting ? parseFloat(conversionRateSetting.value) : 5000

    // 2. Fetch existing members or generate 400 members if table is empty
    let dbMembers = await prisma.member.findMany({ orderBy: { memberId: 'asc' } })

    if (dbMembers.length === 0) {
        console.log('👤 Creating initial 400 members...')
        const membersToCreate = []
        for (let i = 1; i <= 400; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
            const hasPhone = Math.random() > 0.1
            membersToCreate.push({
                memberId: `M${String(i).padStart(4, '0')}`,
                name: `${firstName} ${lastName}`,
                phone: hasPhone ? `08${Math.floor(Math.random() * 900000000 + 100000000)}` : null,
                totalPoints: 0,
                totalSpent: 0,
                transactionCount: 0
            })
        }
        await prisma.member.createMany({ data: membersToCreate })
        dbMembers = await prisma.member.findMany({ orderBy: { memberId: 'asc' } })
    }

    console.log(`👤 Found ${dbMembers.length} members in system.`)

    // Assign customer segments for realistic shopping frequencies
    const membersWithSegment = dbMembers.map((m, idx) => ({
        ...m,
        segment: idx % 10 === 0 ? 'VIP' : idx % 3 === 0 ? 'REGULAR' : 'OCCASIONAL'
    }))

    // 3. Clear existing store transaction source & main transactions
    console.log('🧹 Clearing transaction tables...')
    await prisma.transaction.deleteMany()
    await prisma.storeTransactionSource.deleteMany()

    // 4. Generate transactions from 2023-10-01 to Today (August 11, 2026)
    const startDate = new Date('2023-10-01T00:00:00.000Z')
    const endDate = new Date() // Current date: 2026-08-11

    console.log(`📅 Generating transactions from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`)

    const storeTransactionsToInsert: any[] = []
    const mainTransactionsToInsert: any[] = []
    const memberStatsMap = new Map<string, { points: number; spent: number; count: number }>()

    // Initialize stats map for all members
    for (const m of dbMembers) {
        memberStatsMap.set(m.id, { points: 0, spent: 0, count: 0 })
    }

    for (const member of membersWithSegment) {
        let currentDate = new Date(startDate)
        let memberTotalAmount = 0
        const MAX_AMOUNT = 7500000 // Rp 7.5 Juta cap for heavy shoppers

        while (currentDate <= endDate && memberTotalAmount < MAX_AMOUNT) {
            let chance = 0
            if (member.segment === 'VIP') {
                chance = 0.15 // ~4-5 transactions per month
            } else if (member.segment === 'REGULAR') {
                chance = 0.04 // ~1-2 transactions per month
            } else {
                chance = 0.006 // ~1 transaction per 5-6 months
            }

            if (Math.random() < chance) {
                const hour = 8 + Math.floor(Math.random() * 13) // 08:00 - 21:00
                const txDate = new Date(currentDate)
                txDate.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

                const { items, total } = generateTransactionItems()
                const pointsEarned = Math.floor(total / conversionRate)
                const txId = `TRX-${randomUUID().substring(0, 8).toUpperCase()}`

                if (memberTotalAmount + total <= MAX_AMOUNT) {
                    storeTransactionsToInsert.push({
                        transactionId: txId,
                        memberId: member.memberId,
                        memberName: member.name,
                        transactionDate: txDate,
                        amount: total,
                        phone: member.phone,
                        items: JSON.stringify(items),
                        cashierName: cashiers[Math.floor(Math.random() * cashiers.length)]
                    })

                    mainTransactionsToInsert.push({
                        memberId: member.id,
                        transactionDate: txDate,
                        amount: total,
                        pointsEarned: pointsEarned,
                        pointsExpiryDate: null,
                        description: `Belanja di Toko - ${txId}`
                    })

                    const stats = memberStatsMap.get(member.id)!
                    stats.points += pointsEarned
                    stats.spent += total
                    stats.count += 1

                    memberTotalAmount += total
                } else {
                    break
                }
            }

            currentDate.setDate(currentDate.getDate() + 1)
        }
    }

    console.log(`📦 Inserting ${storeTransactionsToInsert.length} store transactions into StoreTransactionSource...`)
    const batchSize = 1000
    for (let i = 0; i < storeTransactionsToInsert.length; i += batchSize) {
        const batch = storeTransactionsToInsert.slice(i, i + batchSize)
        await prisma.storeTransactionSource.createMany({ data: batch })
        console.log(`   ✓ Store batch ${Math.min(i + batchSize, storeTransactionsToInsert.length)}/${storeTransactionsToInsert.length}`)
    }

    console.log(`📦 Inserting ${mainTransactionsToInsert.length} main transactions into Transaction table...`)
    for (let i = 0; i < mainTransactionsToInsert.length; i += batchSize) {
        const batch = mainTransactionsToInsert.slice(i, i + batchSize)
        await prisma.transaction.createMany({ data: batch })
        console.log(`   ✓ Main tx batch ${Math.min(i + batchSize, mainTransactionsToInsert.length)}/${mainTransactionsToInsert.length}`)
    }

    console.log('📈 Updating member total points, total spent, and transaction counts...')
    const updatePromises = Array.from(memberStatsMap.entries()).map(([cuid, stats]) => {
        return prisma.member.update({
            where: { id: cuid },
            data: {
                totalPoints: stats.points,
                totalSpent: stats.spent,
                transactionCount: stats.count
            }
        })
    })

    const updateBatchSize = 25
    for (let i = 0; i < updatePromises.length; i += updateBatchSize) {
        const batch = updatePromises.slice(i, i + updateBatchSize)
        await Promise.all(batch)
    }

    console.log('🎉 Successfully updated transaction database up to today!')
    const minMaxTx = await prisma.transaction.aggregate({
        _min: { transactionDate: true },
        _max: { transactionDate: true },
        _sum: { amount: true, pointsEarned: true }
    })

    console.log(`📊 Summary:`)
    console.log(`   - Members: ${dbMembers.length}`)
    console.log(`   - Total Transactions: ${mainTransactionsToInsert.length}`)
    console.log(`   - Date Range: ${minMaxTx._min.transactionDate?.toISOString()} to ${minMaxTx._max.transactionDate?.toISOString()}`)
    console.log(`   - Total Revenue: Rp ${minMaxTx._sum.amount?.toLocaleString('id-ID')}`)
    console.log(`   - Total Points Issued: ${minMaxTx._sum.pointsEarned?.toLocaleString('id-ID')} pts`)
}

updateTransactionsToToday()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error updating transaction database:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
