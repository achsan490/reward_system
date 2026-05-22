import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function check() {
    console.log('🔍 Checking member and transaction data...')

    const memberCount = await prisma.member.count()
    const transactionCount = await prisma.transaction.count()

    console.log(`📊 Members: ${memberCount}`)
    console.log(`📊 Transactions: ${transactionCount}`)

    const memberWithTx = await prisma.member.findFirst({
        where: { transactions: { some: {} } },
        include: { 
            _count: { select: { transactions: true } },
            transactions: { take: 5 }
        }
    })

    if (memberWithTx) {
        console.log('✅ Found member with transactions:')
        console.log(`   Name: ${memberWithTx.name}`)
        console.log(`   Member ID: ${memberWithTx.memberId}`)
        console.log(`   Transaction Count: ${memberWithTx._count.transactions}`)
        console.log(`   Sample TX Amount: ${memberWithTx.transactions[0].amount}`)
    } else {
        console.log('❌ No members found with transactions!')
    }
}

check()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); })
