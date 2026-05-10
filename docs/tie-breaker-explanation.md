# Penjelasan Teknis Mekanisme Tie-Breaker

Dokumen ini berisi penjelasan teknis mengenai mekanisme pemecahan seri (*Tie-Breaker*) dalam sistem penentuan pemenang reward.

## 1. Definisi Tie-Breaker
*Tie-breaker* adalah aturan tambahan yang diterapkan secara berurutan untuk memecah kebuntuan (skor seri) dan menentukan peringkat akhir secara objektif.

## 2. Hirarki Aturan (Logic Hierarchy)
Sistem menerapkan urutan prioritas sebagai berikut:

1.  **Kriteria Utama (Top Points/Spending/Transactions):** Berdasarkan pilihan saat membuat campaign.
2.  **Tie-Breaker 1 (Frekuensi Transaksi):** Jika poin sama, member dengan jumlah transaksi lebih banyak akan menang. Ini menghargai intensitas kunjungan member.
3.  **Tie-Breaker 2 (Senioritas):** Jika jumlah transaksi masih sama, member yang mendaftar lebih awal (`createdAt`) akan menang. Ini menghargai loyalitas jangka panjang.

## 3. Implementasi Kode (TypeScript)

```typescript
candidates.sort((a, b) => {
    let diff = 0;
    
    // Kriteria Utama
    if (campaign.criteria === "top_spending") {
        diff = b.totalSpent - a.totalSpent;
    } else if (campaign.criteria === "top_transactions") {
        diff = b.transactionCount - a.transactionCount;
    } else {
        diff = b.totalPoints - a.totalPoints;
    }

    // Mekanisme Tie-Breaker
    if (diff === 0) {
        // Step 1: Cek Transaksi (jika bukan kriteria utama)
        if (campaign.criteria !== "top_transactions") {
            diff = b.transactionCount - a.transactionCount;
        }
        
        // Step 2: Cek Tanggal Pendaftaran (Senioritas)
        if (diff === 0) {
            diff = a.createdAt.getTime() - b.createdAt.getTime();
        }
    }
    return diff;
});
```

## 4. Keunggulan Akademis
*   **Objektivitas:** Menghilangkan unsur keberuntungan atau acak.
*   **Transparansi:** Keputusan sistem didasarkan sepenuhnya pada data historis.
*   **Integritas Data:** Menjamin hasil yang konsisten (*idempotent*).
