import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Configure Prisma Client with proper connection pool settings for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

// Ensure proper connection lifecycle management
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (typeof window === 'undefined') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect()
    })
}
