import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * API Endpoint untuk menghapus data Reward System
 * 
 * CATATAN PENTING:
 * - Endpoint ini HANYA menghapus data internal reward system
 * - Data StoreTransactionSource (POS/Toko) TIDAK DIHAPUS
 * - Ini memastikan data eksternal tetap aman dan bisa di-sync ulang
 * 
 * PERINGATAN: Data yang dihapus tidak bisa dikembalikan!
 */
export async function POST() {
    try {
        console.log('🗑️  Mulai menghapus data reward system...')

        // Hapus dalam urutan yang benar (relasi child dulu, parent terakhir)
        await prisma.rewardRedemption.deleteMany()
        console.log('✅ Reward redemptions dihapus')

        await prisma.rewardWinner.deleteMany()
        console.log('✅ Reward winners dihapus')

        await prisma.rewardCampaign.deleteMany()
        console.log('✅ Reward campaigns dihapus')

        await prisma.rewardCatalog.deleteMany()
        console.log('✅ Reward catalog dihapus')

        await prisma.transaction.deleteMany()
        console.log('✅ Transactions dihapus')

        // IMPORTANT: StoreTransactionSource is NOT deleted
        // This represents external POS data that should remain intact
        console.log('ℹ️  Store transaction source TIDAK dihapus (data eksternal)')

        await prisma.member.deleteMany()
        console.log('✅ Members dihapus')

        // Force revalidation of all paths
        revalidatePath('/', 'layout')
        console.log('🔄 Cache revalidated')

        return NextResponse.json({
            success: true,
            message: 'Data reward system berhasil dihapus. Data toko (POS) tetap aman.',
            deleted: {
                members: 'All',
                transactions: 'All',
                rewards: 'All',
                campaigns: 'All'
            },
            protected: {
                storeTransactionSource: 'Tetap tersimpan (data eksternal)'
            }
        })

    } catch (error) {
        console.error('❌ Error menghapus data:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
