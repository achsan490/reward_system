# 🎁 Reward System - Dokumentasi Komponen

## ✅ Komponen yang Telah Ditambahkan

Sistem Reward Anda sekarang sudah lengkap dengan komponen-komponen berikut:

### 1. **WinnersTable Component** (`src/components/rewards/WinnersTable.tsx`)
**Fungsi:**
- Menampilkan daftar pemenang campaign dalam format card yang menarik
- Badge ranking (🥇 🥈 🥉) untuk 3 besar
- Menampilkan informasi lengkap member (nama, ID, email, phone)
- Statistik pemenang (Points, Total Belanja, Transaksi)
- Status klaim reward dengan indikator visual
- Tombol untuk menandai reward sudah diklaim/belum
- Informasi tanggal klaim dan catatan

**Fitur Utama:**
- ✅ Real-time update status klaim
- ✅ Visual ranking dengan warna gradient
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states untuk UX yang baik

---

### 2. **ExportWinnersButton Component** (`src/components/rewards/ExportWinnersButton.tsx`)
**Fungsi:**
- Export data pemenang campaign ke format CSV
- Download otomatis dengan nama file yang informatif
- Format: `[NamaCampaign]_Winners_[Tanggal].csv`

**Data yang Diekspor:**
- Rank
- Member ID
- Nama
- Email
- Telepon
- Points
- Total Belanja
- Jumlah Transaksi
- Status Klaim
- Tanggal Klaim

**Fitur Utama:**
- ✅ Loading indicator saat export
- ✅ Error handling
- ✅ File naming otomatis dengan timestamp
- ✅ UTF-8 encoding untuk bahasa Indonesia

---

### 3. **CampaignInsights Component** (`src/components/rewards/CampaignInsights.tsx`)
**Fungsi:**
- Menampilkan analytics dan insights campaign reward
- Memberikan overview performa campaign
- Menampilkan trend dan statistik penting

**Insights yang Ditampilkan:**
1. **Kriteria Terpopuler** - Kriteria yang paling sering digunakan
2. **Member Berpartisipasi** - Total unique members yang jadi pemenang
3. **Rata-rata Pemenang** - Average pemenang per campaign
4. **Tingkat Klaim** - Persentase reward yang sudah diklaim

**Fitur Utama:**
- ✅ Visual insights dengan icons
- ✅ Tips & rekomendasi otomatis
- ✅ Gradient background untuk visual appeal
- ✅ Responsive grid layout

---

### 4. **Campaign Detail Page** (`src/app/(admin)/reward-determination/[id]/page.tsx`)
**Fungsi:**
- Halaman detail untuk setiap campaign
- Menampilkan informasi lengkap campaign dan pemenangnya
- Akses untuk export data dan manage klaim

**Informasi yang Ditampilkan:**
1. **Campaign Header**
   - Nama campaign
   - Status badge (Aktif/Selesai/Dibatalkan)
   - Deskripsi
   - Tombol Export CSV

2. **Campaign Info Cards**
   - 📅 Periode campaign (start date - end date)
   - 🏆 Kriteria pemenang
   - 👥 Jumlah pemenang
   - ✅ Reward yang sudah diklaim

3. **Daftar Pemenang**
   - WinnersTable dengan semua pemenang
   - Sortir by ranking
   - Managing claim status

**Fitur Utama:**
- ✅ Back navigation ke daftar campaign
- ✅ Export functionality
- ✅ Real-time claim management
- ✅ Responsive layout dengan grid
- ✅ 404 handling jika campaign tidak ditemukan

---

### 5. **Enhanced Reward Actions** (`src/app/actions/rewards.ts`)
**Fungsi Baru yang Ditambahkan:**

#### `getCampaignInsights()`
Menghitung dan mengembalikan analytics campaign:
- Top criteria yang paling sering digunakan
- Total member unique yang berpartisipasi
- Average pemenang per campaign
- Claim rate (persentase reward yang diklaim)

**Logic:**
- Count criteria usage di semua campaign
- Track unique members menggunakan Set
- Calculate statistics dengan reduce functions
- Handle edge cases (no campaigns)

---

### 6. **Updated Main Page** (`src/app/(admin)/reward-determination/page.tsx`)
**Penambahan:**
- Import CampaignInsights component
- Fetch insights data dari getCampaignInsights()
- Display insights di antara stats dan recent winners
- Conditional rendering (hanya tampil jika ada campaign)

**Layout Baru:**
```
1. Header + Create Campaign Button
2. Statistics Cards (4 cards)
3. Campaign Insights (jika ada campaign)
4. Recent Top Members Preview
5. Campaign Table
```

---

## 🎨 Visual Improvements

### Color Coding
- **🥇 Rank 1:** Gold gradient (yellow-400 to yellow-600)
- **🥈 Rank 2:** Silver gradient (gray-300 to gray-500)
- **🥉 Rank 3:** Bronze gradient (orange-400 to orange-600)
- **Other Ranks:** Gray background dengan nomor

### Status Badges
- **✅ Sudah Diklaim:** Green (success)
- **❌ Belum Diklaim:** Amber (warning)
- **🟢 Campaign Aktif:** Green
- **🔵 Campaign Selesai:** Blue
- **🔴 Campaign Dibatalkan:** Red

### Iconography
- 🏆 Trophy - untuk ranking dan awards
- 📧 Mail - untuk email
- 📞 Phone - untuk telepon
- 📊 TrendingUp - untuk analytics
- 👥 Users - untuk members
- 💰 DollarSign - untuk financial
- 📅 Calendar - untuk dates
- ⬇️ Download - untuk export

---

## 🔄 User Flow

### Melihat Campaign Detail
1. User di halaman `/reward-determination`
2. Click icon 👁️ (Eye) di row campaign
3. Redirect ke `/reward-determination/[id]`
4. Lihat detail campaign + daftar pemenang

### Mengelola Klaim Reward
1. Di halaman detail campaign
2. Scroll ke daftar pemenang
3. Click tombol "Tandai Sudah Diklaim" pada pemenang
4. Status berubah jadi "Sudah Diklaim" (hijau)
5. Tanggal klaim terekam otomatis
6. Bisa dibatalkan dengan click "Batalkan Klaim"

### Export Data Pemenang
1. Di halaman detail campaign
2. Click tombol "Export ke CSV"
3. File CSV otomatis ter-download
4. Buka di Excel/Google Sheets
5. Data lengkap pemenang tersedia

---

## 📊 Database Schema (Reminder)

Komponen-komponen ini menggunakan schema:

```prisma
model RewardCampaign {
  id            String         @id @default(cuid())
  name          String
  description   String?
  criteria      String         // "top_points" | "top_spending" | "top_transactions"
  winnersCount  Int
  startDate     DateTime
  endDate       DateTime
  status        String         @default("active")
  createdAt     DateTime       @default(now())
  rewards       RewardWinner[]
}

model RewardWinner {
  id                 String          @id @default(cuid())
  campaignId         String
  memberId           String
  rank               Int
  pointsAtWin        Int
  spentAtWin         Float
  transactionsAtWin  Int
  rewardClaimed      Boolean         @default(false)
  claimedAt          DateTime?
  notes              String?
  createdAt          DateTime        @default(now())
  campaign           RewardCampaign  @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  member             Member          @relation(fields: [memberId], references: [id])
}
```

---

## 🚀 Next Steps (Opsional untuk Future Enhancement)

Jika Anda ingin mengembangkan lebih lanjut, berikut saran:

### 1. Notification System
- Email notification ke pemenang
- SMS notification
- Push notification di dashboard member

### 2. Reward Types
- Define jenis reward (voucher, cashback, merchandise)
- Nominal reward per ranking
- Reward inventory management

### 3. Campaign Templates
- Save campaign sebagai template
- Quick create dari template
- Default settings

### 4. Advanced Analytics
- Chart perbandingan criteria
- Trend analysis per bulan
- Member participation rate

### 5. Automation
- Auto-complete campaign saat end date
- Scheduled campaign creation
- Auto-notification to unclaimed winners

---

## 📝 Notes

- Semua komponen sudah support **Dark Mode**
- Semua komponen sudah **Responsive** (mobile-friendly)
- Error handling sudah di-implement di semua actions
- Loading states tersedia untuk better UX
- Real-time updates menggunakan `router.refresh()`

---

## 🎯 Achievement Unlocked!

✅ Complete Reward System
✅ Winner Management
✅ Export Functionality
✅ Analytics Dashboard
✅ Beautiful UI/UX
✅ Mobile Responsive
✅ Dark Mode Support

**Your reward system is now production-ready! 🎉**
