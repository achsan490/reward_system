import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function check() {
    console.log('🔍 Checking member and transaction data...')

    const adminCount = await prisma.admin.count()
    const memberCount = await prisma.member.count()
    const transactionCount = await prisma.transaction.count()
    const storeCount = await prisma.storeTransactionSource.count()
    const campaignCount = await prisma.rewardCampaign.count()
    const winnerCount = await prisma.rewardWinner.count()
    const catalogCount = await prisma.rewardCatalog.count()
    const redemptionCount = await prisma.rewardRedemption.count()
    const settingsCount = await prisma.systemSetting.count()

    console.log(`📊 Admins: ${adminCount}`)
    console.log(`📊 Members: ${memberCount}`)
    console.log(`📊 Transactions: ${transactionCount}`)
    console.log(`📊 Store Transactions Source: ${storeCount}`)
    console.log(`📊 Reward Campaigns: ${campaignCount}`)
    console.log(`📊 Reward Winners: ${winnerCount}`)
    console.log(`📊 Reward Catalog: ${catalogCount}`)
    console.log(`📊 Reward Redemptions: ${redemptionCount}`)
    console.log(`📊 System Settings: ${settingsCount}`)

    const txMinMax = await prisma.transaction.aggregate({
        _min: { transactionDate: true },
        _max: { transactionDate: true }
    })
    console.log(`📅 Transaction Date Range: ${txMinMax._min.transactionDate?.toISOString()} to ${txMinMax._max.transactionDate?.toISOString()}`)

    const storeMinMax = await prisma.storeTransactionSource.aggregate({
        _min: { transactionDate: true },
        _max: { transactionDate: true }
    })
    console.log(`📅 Store Transaction Source Date Range: ${storeMinMax._min.transactionDate?.toISOString()} to ${storeMinMax._max.transactionDate?.toISOString()}`)








}

check()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); })


