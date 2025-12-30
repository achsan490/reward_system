# 🎯 Quick Reference - Reward System

## 📂 File Structure

```
src/
├── app/
│   ├── (admin)/
│   │   └── reward-determination/
│   │       ├── page.tsx                    # Main page - daftar campaign
│   │       └── [id]/
│   │           └── page.tsx                # Detail page - lihat pemenang
│   └── actions/
│       └── rewards.ts                       # Server actions untuk rewards
│
└── components/
    └── rewards/
        ├── CreateCampaignButton.tsx         # Button + open modal
        ├── CreateCampaignModal.tsx          # Form buat campaign baru
        ├── RewardStats.tsx                  # 4 cards statistik
        ├── RewardCampaignTable.tsx          # Table daftar campaign
        ├── RecentWinnersCard.tsx            # Preview top 5 members
        ├── WinnersTable.tsx                 # ⭐ NEW - Daftar pemenang detail
        ├── ExportWinnersButton.tsx          # ⭐ NEW - Export CSV
        └── CampaignInsights.tsx             # ⭐ NEW - Analytics insights
```

## 🔑 Key Components

### Main Page (`/reward-determination`)
```tsx
<RewardStats />              // Statistik campaign
<CampaignInsights />         // Analytics (NEW!)
<RecentWinnersCard />        // Top 5 members
<RewardCampaignTable />      // Daftar campaign
```

### Detail Page (`/reward-determination/[id]`)
```tsx
<Header + Navigation />       // Back button + Export
<Campaign Info Cards />       // 4 cards info campaign
<WinnersTable />             // Daftar pemenang (NEW!)
```

## 🛠️ Server Actions

| Function | Purpose |
|----------|---------|
| `getRewardCampaigns()` | Fetch semua campaign |
| `getRewardCampaignById(id)` | Fetch detail campaign + winners |
| `createRewardCampaign(data)` | Buat campaign baru |
| `calculateWinners(campaignId)` | Hitung & assign pemenang |
| `markRewardClaimed(winnerId, claimed)` | Toggle status klaim |
| `deleteRewardCampaign(campaignId)` | Hapus campaign |
| `exportRewardWinners(campaignId)` | Export ke CSV |
| `getCampaignInsights()` | ⭐ NEW - Get analytics |

## 💡 Use Cases

### 1. Buat Campaign Baru
```
User: Click "Buat Campaign Baru"
→ Modal terbuka
→ Isi form (nama, criteria, winners count, dates)
→ Submit
→ System calculate winners otomatis
```

### 2. Lihat Pemenang
```
User: Click icon Eye di campaign row
→ Redirect ke detail page
→ Lihat info campaign
→ Scroll ke daftar pemenang
```

### 3. Tandai Klaim
```
User: Di detail page
→ Cari pemenang yang sudah ambil reward
→ Click "Tandai Sudah Diklaim"
→ Status berubah jadi hijau
→ Tanggal klaim otomatis tersimpan
```

### 4. Export Data
```
User: Di detail page
→ Click "Export ke CSV"
→ File download otomatis
→ Buka di Excel
→ Data lengkap pemenang ada
```

## 🎨 Styling Guidelines

### Colors
- **Brand:** Primary color untuk actions
- **Green:** Success, claimed rewards, active
- **Blue:** Info, navigation
- **Orange:** Warnings, pending claims
- **Red:** Danger, delete actions, cancelled
- **Yellow:** Gold rank #1
- **Gray:** Silver rank #2, neutral elements
- **Orange:** Bronze rank #3

### Icons (lucide-react)
- Trophy, Award - Rewards & ranking
- Users - Members
- Calendar - Dates
- Download - Export
- Eye - View detail
- Trash2 - Delete
- CheckCircle - Success/claimed
- XCircle - Failed/unclaimed
- TrendingUp - Analytics

## 🔍 Testing Checklist

- [ ] Buat campaign baru dengan berbagai criteria
- [ ] Lihat detail campaign
- [ ] Toggle claim status pemenang
- [ ] Export data ke CSV
- [ ] Hapus campaign
- [ ] Cek responsive di mobile
- [ ] Test dark mode
- [ ] Verify analytics data akurat

## 🌐 Routes

| URL | Description |
|-----|-------------|
| `/reward-determination` | Main page - daftar campaign |
| `/reward-determination/[id]` | Detail campaign + winners |

## 📊 Campaign Criteria

1. **top_points** - Member dengan poin tertinggi
2. **top_spending** - Member dengan total belanja terbesar
3. **top_transactions** - Member dengan transaksi terbanyak

## ⚡ Tips & Best Practices

1. **Set tanggal yang jelas** - Start date dan end date yang spesifik
2. **Jumlah pemenang realistis** - Sesuaikan dengan jumlah member aktif
3. **Export rutin** - Backup data pemenang secara berkala
4. **Monitor claim rate** - Follow up pemenang yang belum claim
5. **Use insights** - Lihat kriteria populer untuk campaign berikutnya

## 🐛 Troubleshooting

**Q: Pemenang tidak muncul setelah buat campaign?**
A: Pastikan ada member dengan transaksi di periode campaign

**Q: Export CSV tidak bisa dibuka?**
A: Coba buka dengan encoding UTF-8 di Excel

**Q: Insights tidak muncul?**
A: Harus ada minimal 1 campaign aktif

**Q: Dark mode tidak apply?**
A: Cek Tailwind config dan `<html class="dark">` tag

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
