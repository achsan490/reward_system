# Penjelasan Alur Sistem & Fitur Aplikasi Reward

Dokumen ini menjelaskan alur kerja aplikasi dari awal hingga akhir ("End-to-End"), cocok digunakan sebagai naskah saat **Demo Aplikasi** atau **Presentasi Sidang**.

---

### 1. Masuk ke Sistem (Login & Dashboard)
Sistem dimulai dari keamanan.
*   **Fitur Login**: Hanya Admin terdaftar yang bisa masuk. Ini menjaga data pelanggan agar tidak bocor.
*   **Dashboard Utama**: Begitu masuk, Admin langsung disuguhi "Mata Dewa" (Overview):
    *   Total Member aktif.
    *   Total Poin yang beredar.
    *   Grafik tren transaksi (Naik/Turun).
    *   *Tujuannya*: Agar pemilik toko tahu kondisi bisnisnya dalam sekilas pandang.

### 2. Memasukkan Data (Fitur Store Sync)
Ini adalah **Pondasi Sistem**. Tanpa langkah ini, fitur lain tidak jalan.
*   **Masalah**: Input manual itu lama dan capek.
*   **Solusi (Store Sync)**:
    1.  Admin buka menu **Transaksi**.
    2.  Pilih tanggal (misal "Minggu ini").
    3.  Klik **"Fetch"** -> Sistem menarik data dari Toko.
    4.  Klik **"Save"** -> Sistem otomatis:
        *   Mencatat transaksi belanja.
        *   Menghitung Poin (`Belanja / Rate`).
        *   Membuat akun Member baru jika pelanggan belum terdaftar.

### 3. Manajemen Pelanggan (Menu Customers)
Setelah data masuk, Admin bisa memantau profil pelanggan.
*   **Pencarian Cepat**: Bisa cari pelanggan berdasarkan Nama/No HP.
*   **Detail Profil**: Melihat riwayat belanja spesifik satu orang ("Orang ini sering beli apa?", "Total belanja dia berapa?").
*   **Export Data**: Bisa download data pelanggan ke Excel untuk arsip.

### 4. Membuat Strategi Reward (Menu Reward Determination)
Disinilah "Kecerdasan" sistem bekerja. Admin menentukan siapa yang layak dapat hadiah.
*   **Buat Campaign**: Admin membuat program, misal *"Pemenang Belanja Terbanyak Bulan Mei"*.
*   **Kriteria Otomatis**: Admin memilih syarat pemenang:
    *   `Top Points` (Poin Tertinggi).
    *   `Top Spending` (Uang yang Dihabiskan Terbanyak).
    *   `Top Frequency` (Paling Sering Datang).
*   **Hasil Instan**: Begitu disimpan, sistem langsung mengkalkulasi ribuan data transaksi dan memunculkan **Daftar Pemenang (Juara 1, 2, 3)** dalam hitungan detik.

### 5. Distribusi Hadiah (Klaim Reward)
Langkah terakhir dari siklus sistem.
*   **Pantau Status**: Di halaman detail Campaign, Admin bisa melihat siapa yang sudah mengambil hadiah dan siapa yang belum.
*   **Tandai Klaim**: Saat pelanggan datang mengambil hadiah, Admin klik tombol **"Tandai Sudah Diklaim"**.
*   **Transparansi**: Sistem mencatat *kapan* hadiah diambil, jadi tidak ada kecurangan hadiah diambil dua kali.

---

### Ringkasan Alur:
1.  **Sync** (Tarik data toko) ➡️ 2. **Calculate** (Sistem hitung poin) ➡️ 3. **Campaign** (Tentukan kriteria juara) ➡️ 4. **Winner** (Dapat pemenang) ➡️ 5. **Claim** (Hadiah diserahkan).

Sistem ini mengubah proses manual yang memakan waktu berjam-jam menjadi proses otomatis yang hanya butuh beberapa menit.
