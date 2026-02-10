# Struktur Tabel Database

Berikut adalah spesifikasi struktur tabel database yang digunakan dalam aplikasi Reward System.

## 1. Tabel Admin (`admins`)
Tabel ini menyimpan data administrator yang memiliki akses ke dashboard pengelolaan sistem.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik administrator |
| `email` | String | Unique | Email untuk login |
| `password` | String | - | Password terenkripsi (bcrypt) |
| `name` | String | - | Nama lengkap administrator |
| `createdAt` | DateTime | Default(now) | Waktu pembuatan akun |
| `updatedAt` | DateTime | UpdatedAt | Waktu terakhir update data |

## 2. Tabel Member (`members`)
Tabel utama yang menyimpan data anggota/pelanggan yang berpartisipasi dalam program reward.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik sistem |
| `memberId` | String | Unique | ID Member manual/dari toko |
| `name` | String | - | Nama lengkap member |
| `email` | String | Nullable | Email member |
| `phone` | String | Nullable | Nomor telepon member |
| `totalPoints` | Float | Default(0) | Total poin aktif saat ini |
| `totalSpent` | Float | Default(0) | Total pengeluaran akumulatif |
| `transactionCount` | Int | Default(0) | Total frekuensi transaksi |
| `createdAt` | DateTime | Default(now) | Waktu pendaftaran |
| `updatedAt` | DateTime | UpdatedAt | Waktu terakhir update data |

## 3. Tabel Transaction (`transactions`)
Tabel ini mencatat riwayat transaksi belanja member yang menghasilkan poin.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik transaksi |
| `memberId` | String | FK | Referensi ke tabel Member |
| `transactionDate` | DateTime | - | Tanggal transaksi terjadi |
| `amount` | Float | - | Nominal transaksi (Rupiah) |
| `pointsEarned` | Float | - | Poin yang didapatkan |
| `pointsExpiryDate` | DateTime | Nullable | Tanggal kadaluarsa poin |
| `pointsExpired` | Boolean | Default(false) | Status apakah poin sudah hangus |
| `description` | String | Nullable | Keterangan tambahan |
| `createdAt` | DateTime | Default(now) | Waktu pencatatan sistem |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

## 4. Tabel Reward Campaign (`reward_campaigns`)
Tabel untuk mengatur periode kampanye atau event pemberian reward (misal: "Top Spender Januari").

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik kampanye |
| `name` | String | - | Nama kampanye |
| `description` | String | Nullable | Deskripsi kampanye |
| `criteria` | String | - | Kriteria pemenang (top_points, dll) |
| `winnersCount` | Int | - | Jumlah pemenang yang dicari |
| `startDate` | DateTime | - | Tanggal mulai periode hitungan |
| `endDate` | DateTime | - | Tanggal selesai periode hitungan |
| `status` | String | - | Status (active, completed, cancelled) |
| `createdAt` | DateTime | Default(now) | Waktu pembuatan kampanye |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

## 5. Tabel Reward Winner (`reward_winners`)
Tabel yang menyimpan daftar pemenang dari setiap kampanye reward.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik data pemenang |
| `campaignId` | String | FK | Referensi ke tabel Campaign |
| `memberId` | String | FK | Referensi ke tabel Member |
| `rank` | Int | - | Peringkat juara |
| `pointsAtWin` | Float | - | Poin saat memenangkan reward |
| `spentAtWin` | Float | - | Total belanja saat menang |
| `transactionsAtWin`| Int | - | Jumlah transaksi saat menang |
| `rewardClaimed` | Boolean | Default(false) | Status klaim hadiah |
| `claimedAt` | DateTime | Nullable | Waktu hadiah diklaim |
| `notes` | String | Nullable | Catatan tambahan |
| `createdAt` | DateTime | Default(now) | Waktu penetapan pemenang |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

## 6. Tabel Reward Catalog (`reward_catalog`)
Tabel katalog hadiah yang tersedia untuk ditukarkan (redeem) oleh member.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik item katalog |
| `name` | String | - | Nama barang/hadiah |
| `description` | String | Nullable, Text | Deskripsi detail hadiah |
| `pointsRequired` | Float | - | Poin yang dibutuhkan untuk tukar |
| `stock` | Int | Nullable | Sisa stok (Null = Unlimited) |
| `imageUrl` | String | Nullable | URL gambar hadiah |
| `category` | String | Nullable | Kategori (voucher, produk, dll) |
| `isActive` | Boolean | Default(true) | Status ketersediaan item |
| `validUntil` | DateTime | Nullable | Batas waktu penukaran |
| `createdAt` | DateTime | Default(now) | Waktu pembuatan item |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

## 7. Tabel Reward Redemption (`reward_redemptions`)
Tabel yang mencatat riwayat penukaran poin (redeem) member dengan hadiah.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik penukaran |
| `memberId` | String | FK | Referensi ke tabel Member |
| `catalogId` | String | FK | Referensi ke tabel Catalog |
| `pointsUsed` | Float | - | Jumlah poin yang dipotong |
| `claimCode` | String | Default(cuid) | Kode unik klaim hadiah |
| `status` | String | - | Status (pending, approved, dll) |
| `notes` | String | Nullable, Text | Catatan dari member |
| `adminNotes` | String | Nullable, Text | Catatan dari admin |
| `redeemedAt` | DateTime | Default(now) | Waktu request penukaran |
| `processedAt` | DateTime | Nullable | Waktu diproses admin |
| `processedBy` | String | Nullable | Admin yang memproses |
| `completedAt` | DateTime | Nullable | Waktu hadiah diterima |
| `createdAt` | DateTime | Default(now) | Waktu pencatatan sistem |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

## 8. Tabel System Setting (`system_settings`)
Tabel konfigurasi dinamis untuk pengaturan sistem.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik pengaturan |
| `key` | String | Unique | Kunci konfigurasi (misal: 'point_ratio') |
| `value` | String | - | Nilai konfigurasi |
| `label` | String | - | Label yang mudah dibaca user |
| `type` | String | - | Tipe data nilai (number, string, boolean) |
| `createdAt` | DateTime | Default(now) | Waktu pembuatan |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan |

## 9. Tabel Store Transaction Source (`store_transaction_source`)
Tabel simulasi/staging untuk menampung data mentah transaksi dari sistem Kasir/POS eksternal sebelum diproses menjadi poin.

| Nama Kolom | Tipe Data | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | String | PK, CUID | Identifier unik record |
| `transactionId` | String | Unique | ID Transaksi asli dari toko |
| `memberId` | String | - | ID Member di sistem toko |
| `memberName` | String | - | Nama member dari struk |
| `transactionDate` | DateTime | - | Waktu transaksi di toko |
| `amount` | Float | - | Total belanja |
| `phone` | String | Nullable | Nomor HP pelanggan |
| `items` | String | Nullable | JSON detail barang belanjaan |
| `cashierName` | String | Nullable | Nama kasir |
| `createdAt` | DateTime | Default(now) | Waktu data masuk ke sistem/sync |
| `updatedAt` | DateTime | UpdatedAt | Waktu pembaruan data |

---
*Keterangan Tambahan:*
*   **PK**: Primary Key
*   **FK**: Foreign Key
*   **CUID**: Collision-resistant Unique Identifier (Format ID unik string acak)
