import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function syncAll() {
    console.log('🔄 Starting manual synchronization of all transactions...')

    // 1. Get all store transactions that are not yet in the main transaction table
    const storeTransactions = await prisma.storeTransactionSource.findMany({
        orderBy: { transactionDate: 'asc' }
    })

    console.log(`📊 Found ${storeTransactions.length} transactions in store source.`)

    // 2. Get settings
    const conversionRateSetting = await prisma.systemSetting.findUnique({ where: { key: 'point_conversion_rate' } })
    const conversionRate = conversionRateSetting ? parseFloat(conversionRateSetting.value) : 5000

    const expirationEnabledSetting = await prisma.systemSetting.findUnique({ where: { key: 'point_expiration_enabled' } })
    const expirationEnabled = expirationEnabledSetting?.value === 'true'
    
    const expirationDaysSetting = await prisma.systemSetting.findUnique({ where: { key: 'point_expiration_days' } })
    const expirationDays = expirationDaysSetting ? parseInt(expirationDaysSetting.value) : 90

    console.log(`⚙️ Settings: Rate=1pt/${conversionRate}, Expiry=${expirationEnabled ? expirationDays + ' days' : 'Disabled'}`)

    // 3. Clear existing members and transactions in main system to avoid duplicates and ensure fresh sync
    // WARNING: Only do this because it's a test/skripsi environment and we want a clean sync
    await prisma.transaction.deleteMany()
    await prisma.member.deleteMany()
    console.log('🧹 Cleared existing members and transactions for a clean sync.')

    // 4. Resolve unique members first
    const memberDataMap = new Map()
    for (const txn of storeTransactions) {
        if (!memberDataMap.has(txn.memberId)) {
            memberDataMap.set(txn.memberId, {
                memberId: txn.memberId,
                name: txn.memberName,
                phone: txn.phone,
                totalPoints: 0,
                totalSpent: 0,
                transactionCount: 0
            })
        }
    }

    console.log(`👤 Found ${memberDataMap.size} unique members. Creating...`)
    const membersArray = Array.from(memberDataMap.values())
    await prisma.member.createMany({
        data: membersArray.map(m => ({
            memberId: m.memberId,
            name: m.name,
            phone: m.phone
        }))
    })

    // Fetch members to get CUIDs
    const dbMembers = await prisma.member.findMany()
    const memberIdToCuid = new Map(dbMembers.map(m => [m.memberId, m.id]))

    // 5. Prepare transactions
    console.log('📝 Preparing transaction records...')
    const transactionsToInsert = []
    const memberStats = new Map()

    for (const txn of storeTransactions) {
        const memberCuid = memberIdToCuid.get(txn.memberId)
        if (!memberCuid) continue

        const points = Math.floor(txn.amount / conversionRate)
        
        let expiryDate = null
        if (expirationEnabled) {
            expiryDate = new Date(txn.transactionDate)
            expiryDate.setDate(expiryDate.getDate() + expirationDays)
        }

        transactionsToInsert.push({
            memberId: memberCuid,
            transactionDate: txn.transactionDate,
            amount: txn.amount,
            pointsEarned: points,
            pointsExpiryDate: expiryDate,
            description: `Belanja di Toko - ${txn.transactionId}`
        })

        // Track stats for member update
        const stats = memberStats.get(memberCuid) || { points: 0, spent: 0, count: 0 }
        stats.points += points
        stats.spent += txn.amount
        stats.count += 1
        memberStats.set(memberCuid, stats)
    }

    // 6. Insert Transactions in batches
    console.log(`📦 Inserting ${transactionsToInsert.length} transactions...`)
    const batchSize = 1000
    for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
        const batch = transactionsToInsert.slice(i, i + batchSize)
        await prisma.transaction.createMany({ data: batch })
        console.log(`   ✓ Inserted ${Math.min(i + batchSize, transactionsToInsert.length)}/${transactionsToInsert.length}`)
    }

    // 7. Update Member Totals
    console.log('📈 Updating member totals...')
    const updatePromises = Array.from(memberStats.entries()).map(([cuid, stats]) => {
        return prisma.member.update({
            where: { id: cuid },
            data: {
                totalPoints: stats.points,
                totalSpent: stats.spent,
                transactionCount: stats.count
            }
        })
    })

    // Run updates in chunks to not overload connection
    const updateBatchSize = 20
    for (let i = 0; i < updatePromises.length; i += updateBatchSize) {
        const batch = updatePromises.slice(i, i + updateBatchSize)
        await Promise.all(batch)
    }

    console.log('✅ Synchronization completed successfully!')
    console.log(`🏆 Final Result: ${transactionsToInsert.length} transactions synced for ${memberDataMap.size} members.`)
}

syncAll()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
