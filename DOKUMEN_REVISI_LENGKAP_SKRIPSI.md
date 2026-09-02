# 📄 DOKUMEN LENGKAP REVISI SKRIPSI & PANDUAN PENYEMPURNAAN NASKAH

**Judul Skripsi:** *Sistem Informasi Pengelolaan Program Loyalitas dan Penentuan Penerima Reward Berbasis Web pada Toko Miniposh*  
**Dokumen Asal yang Diaudit:** `SEMHAS 20-08-26.docx`  
**File Word Hasil Revisi & Siap Salin:** `DOKUMEN_REVISI_LENGKAP_SKRIPSI.docx` (Tersimpan di root folder skripsi)  
**File Diagram XML (Draw.io):** `docs/erd_revisi_v2.xml`, `docs/flowchart_revisi_v2.xml`, `docs/class_diagram_revisi_v2.xml`

---

## 📌 1. MATRIKS STATUS AUDIT & DAFTAR PERBAIKAN

Berdasarkan audit menyeluruh terhadap berkas **`SEMHAS 20-08-26.docx`**, berikut adalah ringkasan hal-hal yang **sudah benar** dan bagian-bagian yang **masih perlu disempurnakan (typo, heading terpotong, caption, penomoran sub-bab)**:

| No | Bagian / Sub-bab | Status Naskah di SEMHAS 20-08-26.docx | Tindakan Perbaikan yang Disiapkan |
|---|---|---|---|
| **1** | **Halaman Pengesahan** | Typo nama Kaprodi: `Peimadi Airlangga, M.IT` | Ubah huruf 'e' menjadi 'r' $\to$ `Primadi Airlangga, M.IT` |
| **2** | **Daftar Tabel** | Tabel perbandingan Gap & Impact di Bab II belum didaftarkan | Tambahkan `Tabel 2. 1 Analisis Gap dan Dampak Penerapan Sistem Loyalitas` |
| **3** | **BAB I: Sub-bab 1.1** | Terdapat kata nyasar `modern.` di akhir Sub-bab 1.1 | Hapus kata `modern.` dan rapikan format tanda strip pada Transaksi Atomik |
| **4** | **BAB II: Sub-bab 2.7** | Typo kata ganda `Loyalitas Loyalitas` & kalimat penutup 2.7 | Hapus kata ganda dan lengkapi kalimat penutup |
| **5** | **BAB II: Sub-bab 2.10** | Duplikasi kata testing menggantung di tengah kalimat | Hapus kata `testing.` yang dobel di tengah kalimat |
| **6** | **BAB III: Sub-bab 3.5** | Nomor sub-bab loncat dari 3.5.3 langsung ke 3.5.5 | Tata ulang hierarki menjadi 3.5.1 s.d. 3.5.6 secara runtut dan konsisten |
| **7** | **BAB III: Flowchart** | Gambar Flowchart belum memiliki teks Caption resmi | Tambahkan teks caption `Gambar 3. 6 Flowchart System` di bawah gambar |
| **8** | **BAB III: Typo Naskah** | Ada istilah *koin kuesioner*, backtick nyasar, *engelola*, *Microsoft Vis* | Ubah jadi *reward / poin loyalitas*, bersihkan backtick, ubah jadi *mengelola*, dan *Microsoft Visio* |
| **9** | **BAB IV: Heading 4.4** | Judul sub-bab 4.4.3 & 4.4.5 terpisah jadi 2 paragraf | Satukan judul heading menjadi satu baris utuh |
| **10** | **BAB V: Kesimpulan 5.1** | Terdapat 1 kalimat utuh yang terulang persis 2 kali pada Validitas Fungsional | Hapus kalimat duplikat pada butir Validitas Fungsional |
| **11** | **BAB V: Saran 5.2** | Typo di akhir kalimat: `tanpa intervensi admin-time.` | Ubah menjadi `tanpa intervensi administrator.` |

---

## 📄 2. BAGIAN 1: PERBAIKAN HALAMAN DEPAN & PENGESAHAN

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> 1. Buka Halaman Pengesahan pada file skripsi Anda.  
> 2. Gantikan baris nama Kaprodi Informatika dengan teks di bawah.  
> 3. Pada halaman **DAFTAR TABEL**, sisipkan baris judul Tabel 2.1.

### A. Teks Halaman Pengesahan (Nama Kaprodi yang Benar)
```text
Tholib Hariono, M.Kom.                Primadi Airlangga, M.IT
NIDN. 0709038301                      NIDN. 0718108602
```

### B. Tambahan Entri pada Halaman DAFTAR TABEL
```text
Tabel 2. 1 Analisis Gap dan Dampak Penerapan Sistem Loyalitas Toko Miniposh ....... [Nomor Halaman]
```

---

## 📝 3. BAGIAN 2: NASKAH LENGKAP & BERSIH BAB I (PENDAHULUAN)

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> Naskah di bawah ini telah dibersihkan secara total dari kata nyasar `modern.` di akhir sub-bab 1.1 dan menggunakan tanda baca standar. Silakan salin teks Sub-bab 1.1, 1.2, dan 1.4 berikut ke naskah skripsi Anda.

### 1.1 Latar Belakang

Dalam lanskap industri ritel modern yang dinamis dan kompetitif, mempertahankan loyalitas pelanggan merupakan pilar strategis yang menentukan keberlanjutan dan profitabilitas usaha. Toko Miniposh sebagai entitas bisnis ritel busana dan perlengkapan anak menyadari krusialnya memberikan apresiasi berkala kepada para pelanggan setia, khususnya melalui pemberian program hadiah belanja dan parsel tahunan (seperti parsel hari raya Lebaran). Strategi loyalitas ini terbukti secara empiris mampu menumbuhkan ikatan emosional yang erat, meningkatkan kepuasan pelanggan, serta mendorong frekuensi pembelian berulang (*repurchase intention*) (Ramadhan, 2020).

Kendati demikian, dalam realitas operasional di Toko Miniposh, pengelolaan program loyalitas dan penentuan penerima apresiasi reward parsel masih menghadapi kendala fundamental. Selama ini, aktivitas transaksi toko hanya dilayani oleh satu titik kasir konvensional (*single-cashier POS*). Sistem kasir tunggal tersebut hanya difungsikan untuk merekam transaksi penjualan harian secara terisolasi (*stand-alone*) tanpa terintegrasi secara langsung ke sistem manajemen loyalitas terpusat. Kondisi ini menimbulkan kesenjangan (*gap*) operasional yang nyata: ribuan baris data transaksi belanja pelanggan menumpuk dalam bentuk log kasir lokal, sementara pihak manajemen toko tidak memiliki instrumen otomatis untuk mengolah dan mengagregasi data tersebut ke dalam profil keanggotaan (*member*) pelanggan.

Keterbatasan kasir tunggal dan tidak adanya integrasi sistem ini berdampak langsung pada mekanisme penentuan penerima parsel yang selama ini dilakukan secara manual, subjektif, dan hanya mengandalkan ingatan atau estimasi pemilik toko. Praktik konvensional tersebut mengandung kelemahan fatal: membutuhkan waktu rekapitulasi data yang sangat lama saat transaksi meningkat tajam menjelang hari raya, rentan terjadi kesalahan pencatatan data akibat *human error*, serta memicu risiko ketidakadilan dan kecemburuan sosial bagi pelanggan yang memiliki kontribusi pembelanjaan riil tinggi. Dari perspektif pelanggan, ketiadaan sistem pemantauan poin mandiri menyebabkan pelanggan tidak memiliki informasi mengenai akumulasi belanja dan hak reward mereka (*asymmetric information*), sehingga program apresiasi yang diselenggarakan toko gagal menjadi stimulus retensi belanja yang efektif.

Guna mengatasi kesenjangan tersebut, dibutuhkan transformasi digital melalui perancangan dan pembangunan Sistem Informasi Pengelolaan Program Loyalitas dan Penentuan Penerima Reward Berbasis Web pada Toko Miniposh. Dalam mengintegrasikan data transaksi kasir tunggal ke dalam sistem reward berbasis web, terdapat dua fondasi komputasi utama yang harus diterapkan:

1. **Transaksi Atomik (*Atomic Transactions*):**  
   Dalam pemrosesan data loyalitas, aktivitas sinkronisasi transaksi massal maupun penukaran hadiah melibatkan manipulasi simultan pada beberapa tabel basis data (tabel transaksi, saldo poin member, dan stok katalog reward). Apabila sistem tidak menerapkan prinsip atomisitas (*Atomicity* pada ACID), kegagalan sistem atau interupsi koneksi di tengah jalan dapat menyebabkan inkonsistensi data serius, seperti data belanja tersimpan tetapi poin member tidak bertambah, atau saldo poin terpotong tetapi kode tiket penukaran hadiah gagal dibuat. Oleh sebab itu, sistem menerapkan mekanisme Transaksi Atomik menggunakan Prisma Transaction (`$transaction`) yang menjamin seluruh rangkaian operasi dieksekusi secara utuh (*all-or-nothing*). Jika satu tahap gagal, seluruh perubahan dibatalkan secara otomatis (*rollback*) sehingga integritas data basis data tetap terlindungi.

2. **Logika Reduksi Data (*Reduction Logic*):**  
   Data transaksi harian dari kasir yang berjumlah ribuan baris merupakan data mentah berdimensi tinggi yang memerlukan prosedur pengurangan dan pemadatan informasi terstruktur. Logika Reduksi diterapkan melalui algoritma bertingkat untuk: (a) melakukan deduplikasi data kasir menggunakan *hash-set lookup* $O(1)$ berbasis kunci unik `(MemberId + Timestamp + Amount)`, (b) mereduksi riwayat transaksi multi-baris menjadi statistik ringkas per pelanggan (`totalSpent`, `totalPoints`, dan `transactionCount`), serta (c) mereduksi seluruh dataset pelanggan menjadi daftar pemenang Top-N secara objektif melalui algoritma penentuan reward berbasis kriteria dinamis dan aturan pemecah seri *multi-level tie-breaker* (Total Belanja $\to$ Frekuensi Transaksi $\to$ Waktu Pendaftaran).

Melalui integrasi arsitektur transaksi atomik dan logika reduksi data pada sistem berbasis web, Toko Miniposh dapat mengotomatisasi proses evaluasi loyalitas secara instan dari data kasir tunggal, menjamin keadilan penilaian reward berbasis data riil, serta menyediakan transparansi bagi pelanggan dalam memantau perolehan poin dan hak reward mereka.

---

### 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun sistem informasi loyalitas dan reward pelanggan berbasis web yang mampu mengintegrasikan data transaksi dari kasir tunggal (*StoreTransactionSource*) secara terstruktur pada Toko Miniposh?
2. Bagaimana mengimplementasikan mekanisme transaksi atomik (*Atomic Transactions*) untuk menjamin integritas dan konsistensi data poin pada proses sinkronisasi transaksi massal dan penukaran reward?
3. Bagaimana merancang dan menerapkan logika reduksi data (*Reduction Logic*) serta algoritma *multi-level tie breaker* untuk menyaring duplikasi transaksi dan menentukan pemenang *reward campaign* secara otomatis dan objektif?
4. Bagaimana dampak implementasi sistem reward berbasis web terhadap penyelesaian *gap* loyalitas pelanggan dan efisiensi operasional evaluasi reward pada Toko Miniposh?

---

### 1.4 Tujuan Penelitian

Tujuan yang hendak dicapai dalam penelitian ini adalah:

1. Merancang dan membangun aplikasi reward pelanggan berbasis web yang mengintegrasikan data transaksi kasir tunggal pada Toko Miniposh.
2. Menerapkan mekanisme transaksi atomik (*Atomic Transactions*) guna menjamin konsistensi data poin dan mencegah kegagalan parsial saat pemrosesan batch transaksi dan klaim reward.
3. Mengembangkan algoritma logika reduksi (*Reduction Logic*) dan *multi-level tie-breaker* guna mengotomatisasi seleksi pemenang reward secara objektif, presisi, dan transparan.
4. Mengevaluasi dampak efektivitas sistem terhadap transparansi loyalitas pelanggan dan percepatan proses rekapitulasi data reward toko.

---

## 📖 4. BAGIAN 3: NASKAH PERBAIKAN BAB II (TINJAUAN PUSTAKA)

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> 1. Gantikan naskah Sub-bab 2.7 dengan teks bersih di bawah (menghapus kata ganda *Loyalitas Loyalitas* dan memberi caption resmi Tabel 2.1).  
> 2. Gantikan naskah Sub-bab 2.10 untuk membersihkan kata *testing.* yang dobel.

### 2.7 Loyalitas Pelanggan (Naskah Bersih)

Loyalitas pelanggan dalam sistem informasi dapat diukur secara kuantitatif melalui indikator berbasis data transaksi. Indikator tersebut antara lain total nilai pembelanjaan, frekuensi transaksi, dan konsistensi pembelian dalam periode tertentu. Pendekatan ini memungkinkan loyalitas pelanggan diukur secara objektif dan terhindar dari penilaian subjektif. Oleh karena itu, pemanfaatan data transaksi sebagai indikator loyalitas menjadi dasar yang relevan dalam pengembangan sistem pengelolaan loyalty Reward serta mekanisme penukaran poin hadiah (Pudjianingrum et al., 2022).

Konversi poin merupakan mekanisme yang umum digunakan dalam sistem loyalitas pelanggan untuk menyederhanakan nilai transaksi menjadi satuan evaluasi yang seragam. Dengan menggunakan sistem poin, nilai belanja pelanggan dapat diakumulasi dan dibandingkan secara lebih mudah dalam periode waktu tertentu. Mekanisme ini memungkinkan perusahaan untuk mengukur loyalitas pelanggan secara kuantitatif berdasarkan aktivitas transaksi.

Penerapan konversi poin juga memberikan fleksibilitas bagi pihak manajemen dalam menyesuaikan kebijakan loyalitas sesuai dengan strategi bisnis. Perubahan nilai konversi, seperti penyesuaian rasio belanja terhadap poin, dapat dilakukan tanpa mengubah struktur utama sistem. Dalam penelitian ini, konversi poin digunakan sebagai dasar penilaian loyalitas pelanggan yang selanjutnya dimanfaatkan dalam penyusunan peringkat pelanggan dan penentuan penerima Reward.

Selain itu, loyalitas juga dapat diartikan sebagai kemauan pelanggan untuk tetap berlangganan atau mempertahankan hubungan dengan suatu perusahaan dalam jangka waktu yang panjang dengan melakukan pembelian secara berulang dan bersifat eksklusif. Perilaku pembelian berulang ini menunjukkan adanya komitmen pelanggan yang kuat, di mana keputusan pembelian tidak lagi hanya dipengaruhi oleh faktor harga, melainkan juga oleh nilai tambah, pengalaman layanan, serta apresiasi yang diberikan oleh perusahaan kepada pelanggan. Oleh karena itu, loyalitas pelanggan menjadi salah satu indikator penting dalam menilai keberhasilan strategi pemasaran dan pengelolaan hubungan pelanggan dalam suatu bisnis yang bersifat eksklusif (Ramadhan, 2020).

Berdasarkan konsep tersebut, loyalitas pelanggan dalam penelitian ini diposisikan sebagai variabel yang dapat diukur secara objektif melalui data transaksi yang tersimpan dalam sistem. Penggunaan indikator kuantitatif berupa total nilai pembelanjaan dan akumulasi poin memungkinkan sistem untuk mengidentifikasi tingkat loyalitas pelanggan secara lebih akurat, sehingga hasil penilaian dapat dijadikan dasar pengambilan keputusan dalam penentuan penerima loyalty Reward.

Tabel 2.1 di bawah ini merangkum perbandingan komprehensif antara kondisi sebelum dan sesudah penerapan sistem reward pada Toko Miniposh:

**Tabel 2. 1 Analisis Gap dan Dampak Penerapan Sistem Loyalitas Toko Miniposh**

| Dimensi Evaluasi | Kondisi Sebelum Sistem (Gap Masalah) | Kondisi Setelah Sistem (Impact Nyata) |
|---|---|---|
| **Integrasi Transaksi** | Data belanja hanya tersimpan di log kasir tunggal (POS lokal); tidak terintegrasi ke data loyalitas. | Tersedia modul *Store Sync* & *Upload CSV* yang menghubungkan data kasir langsung ke profil member. |
| **Kecepatan Rekapitulasi** | Manual menggunakan spreadsheet atau ingatan; butuh waktu berhari-hari saat periode parsel Lebaran. | Otomatis dan instan (dalam hitungan detik) mengevaluasi ribuan transaksi menjadi peringkat pemenang. |
| **Objektivitas & Keadilan** | Rentan bias subjektif, salah catat, dan pilih kasih dalam menentukan penerima hadiah. | 100% objektif berbasis data riil transaksi, multi-kriteria transparan, dan algoritma *tie-breaker* teruji. |
| **Transparansi Pelanggan** | Pelanggan tidak mengetahui saldo poin, status transaksi, maupun katalog reward yang tersedia. | Tersedia portal member mandiri untuk cek saldo poin, riwayat transaksi, dan katalog reward. |
| **Konsistensi Data** | Risiko ketidaksinkronan saldo poin saat terjadi pembatalan transaksi belanja. | Dijamin melalui *Atomic Transactions* (`$transaction`) yang mencegah kegagalan parsial dan duplikasi data. |

---

### 2.10 Kerangka Pemikiran (Naskah Bersih)

Permasalahan yang menjadi latar belakang dari penelitian ini adalah kesulitan perusahaan dalam menentukan pelanggan yang layak menerima parsel secara objektif, karena belum adanya sistem terintegrasi yang dapat menganalisis riwayat transaksi. Saat ini, proses penentuan penerima parsel masih dilakukan secara subjektif atau berdasarkan ingatan, yang rawan kesalahan, ketidaktepatan, dan potensi ketidakadilan terhadap pelanggan yang loyal.

Untuk menjawab permasalahan tersebut, perlu dikembangkan sebuah aplikasi berbasis web yang dapat mengolah data transaksi pelanggan secara otomatis. Aplikasi ini akan menganalisis riwayat transaksi menggunakan parameter seperti frekuensi pembelian, jumlah total transaksi, dan waktu terakhir pembelian. Data yang dianalisis ini kemudian digunakan untuk menentukan pelanggan yang paling layak menerima parsel sebagai bentuk penghargaan atau loyalitas.

Sistem ini dirancang dengan menggunakan bahasa pemrograman Next.js dan database PostgreSQL, serta mengusung pendekatan web responsif agar dapat diakses dengan berbagai perangkat. Pengujian sistem difokuskan pada aspek fungsional menggunakan metode *blackbox testing* untuk memastikan seluruh fungsi dan fitur aplikasi berjalan sesuai dengan kebutuhan pengguna (Khoirudin et al., 2022).

Sistem yang diusulkan tidak hanya mengolah data transaksi, tetapi juga menerapkan mekanisme konversi nilai belanja menjadi poin loyalitas berdasarkan aturan yang dapat disesuaikan oleh admin. Selanjutnya, sistem menyusun peringkat pelanggan berdasarkan akumulasi poin serta menyediakan portal Member untuk memantau dan menukarkan poin. Penerapan kebijakan batas masa berlaku kupon atau tiket digital diterapkan sebagai pengingat proaktif agar pelanggan segera menukarkan tiket tersebut ke toko fisik sebelum hangus otomatis oleh sistem dalam kurun waktu yang ditentukan.

---

## 📐 5. BAGIAN 4: RESTRUKTURISASI & PENYEMPURNAAN BAB III (METODOLOGI)

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> 1. Ubah penomoran sub-bab di bawah Sub-bab 3.5 menjadi urut dan lengkap (3.5.1 sampai 3.5.6).  
> 2. Tambahkan caption resmi **Gambar 3. 6 Flowchart System (Alur Kerja Admin & Member)** tepat di bawah gambar flowchart.  
> 3. Bersihkan istilah *koin kuesioner*, backtick nyasar, dan perbaiki typo (*mengelola*, *Microsoft Visio*).

### 3.5 Struktur Perancangan Sistem & Basis Data

#### 3.5.1 Modul Penentuan Penerima Reward
Penentuan penerima Reward pada sistem ini tidak hanya didasarkan pada satu kriteria tunggal, tetapi menggunakan pendekatan perankingan berjenjang (*multi-level sorting*) untuk menjamin keadilan dan objektivitas. Sistem menerapkan metode *lexicographical order*, yaitu teknik pengurutan data berdasarkan beberapa kunci prioritas secara bertingkat: (1) Kriteria Utama (Total Belanja, Frekuensi, atau Total Poin), (2) Pemecah Seri Tingkat Pertama (Jumlah Transaksi), dan (3) Pemecah Seri Tingkat Kedua (Senioritas Keanggotaan).

#### 3.5.2 Modul Perancangan Alur Aktivitas (Activity Diagram)
Gambar 3.4 memetakan alur aktivitas transaksi penukaran reward loyalitas. Aktivitas dimulai dari sisi Member yang mengajukan permintaan penukaran reward pada portal web. Sistem kemudian melakukan pengecekan saldo poin secara otomatis di database. Jika saldo poin mencukupi, sistem akan mengunci poin member sementara dengan status *Pending* dan meneruskan permintaan ke sisi Admin. Admin bertugas memverifikasi fisik ketersediaan stok hadiah di toko. Setelah disetujui oleh admin, sistem akan mengubah status menjadi *Approved* dan memotong poin member secara permanen.

#### 3.5.3 Perancangan Basis Data (Entity Relationship Diagram)
Gambar 3.3 merepresentasikan struktur basis data relasional sistem reward yang terdiri dari 7 entitas utama ditambah 1 tabel staging kasir (*StoreTransactionSource*). Entitas Member berperan sebagai pusat data pelanggan dengan atribut `totalPoints` dan `totalSpent` yang berelasi *one-to-many* ke entitas Transaction. Entitas RewardCampaign menyimpan konfigurasi parameter kampanye dan berelasi ke RewardWinner untuk mencatat daftar juara. Entitas RewardRedemption mencatat riwayat pemotongan poin member saat menukarkan hadiah dari RewardCatalog.

#### 3.5.4 Perancangan Struktur Kelas (Class Diagram)
Pada Gambar 3.5 menunjukkan rancangan struktur kelas yang digunakan dalam pembangunan Sistem Informasi Reward Toko Miniposh. Class diagram memodelkan entitas data beserta operasi logika bisnis, antara lain fungsi sinkronisasi kasir (`fetchStoreTransactions`), kalkulasi poin atomik (`calculatePoints`), pemeringkatan juara (`determineWinners`, `applyMultiLevelTieBreaker`), dan pemotongan stok hadiah (`reduceStock`).

#### 3.5.5 Perancangan Alur Sistem (Flowchart System)
Flowchart sistem pada Gambar 3.6 menggambarkan alur kerja komprehensif yang dilakukan oleh admin dalam mengoperasikan sistem reward management. Alur tersebut mencakup proses autentikasi login, pengelolaan transaksi (upload CSV atau sinkronisasi database kasir), validasi & deduplikasi data $O(1)$, perhitungan poin atomik (`$transaction`), penentuan pemenang reward campaign, hingga pengelolaan katalog dan persetujuan klaim hadiah.

*(Letakkan Gambar Flowchart di sini)*  
**Gambar 3. 6 Flowchart System (Alur Kerja Admin & Member)**

#### 3.5.6 Modul Laporan
Tahap terakhir dalam pengelolaan reward adalah mengelola laporan daftar penerima hadiah beserta skor evaluasi loyalitas. Modul laporan memfasilitasi admin untuk mengekspor data pemenang ke dalam format CSV/Excel guna keperluan distribusi hadiah fisik dan dokumentasi internal toko.

---

## 💻 6. BAGIAN 5: PENYATUAN HEADING & PERBAIKAN BAB IV

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> 1. Satukan judul heading 4.4.3 dan 4.4.5 yang sebelumnya terpotong menjadi 2 baris.  
> 2. Ganti kalimat pengantar Tabel 4.1.

### 4.4.3 Implementasi Aturan Bisnis Pemotongan Poin Berdasarkan Rekaman Transaksi
Dalam proses penukaran poin, sistem menerapkan pendekatan logika pengurangan poin berbasis stempel waktu (*timestamp reduction logic*). Mekanisme ini memastikan pemotongan poin saldo dilakukan secara kronologis (*First-In, First-Out / FIFO*) mulai dari perolehan transaksi belanja yang paling awal.

Tabel 4.1 di bawah ini menunjukkan kondisi data awal perolehan poin pelanggan yang diambil dari basis data sebelum diproses oleh algoritma pemotongan:

### 4.4.5 Mekanisme Pemecahan Seri (Tie-Breaker) Penentuan Pemenang Reward
Dalam proses penentuan penerima Reward, terdapat kemungkinan terjadinya kondisi seri di mana lebih dari satu Member memiliki nilai yang identik pada kriteria utama. Penerapan mekanisme *tie-breaker* pada sistem ini dirancang secara bertingkat: Kriteria 1 (Frekuensi Transaksi) $\to$ Kriteria 2 (Masa Keanggotaan).

---

## 🎯 7. BAGIAN 6: NASKAH LENGKAP & BERSIH BAB V (PENUTUP)

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> Naskah Kesimpulan 5.1 telah dibersihkan dari kalimat ganda pada butir Validitas Fungsional, dan butir Saran 5.2 telah dibersihkan dari typo istilah *admin-time*.

### 5.1 Kesimpulan

Berdasarkan proses rancang bangun, implementasi, serta pengujian yang telah dilaksanakan terhadap aplikasi pengelolaan loyalty Reward pada Toko Miniposh, maka dapat disimpulkan beberapa poin penting sebagai berikut:

1. **Objektivitas Pengambilan Keputusan:** Sistem yang dibangun berhasil mentransformasi proses penentuan penerima Reward yang sebelumnya bersifat manual dan subjektif menjadi proses yang objektif melalui pendekatan *data-driven decision making*. Dengan mengintegrasikan data transaksi pelanggan secara langsung dari basis data kasir tunggal, sistem mampu menyajikan informasi loyalitas yang terukur dan dapat dipertanggungjawabkan.
2. **Fleksibilitas Strategi Bisnis:** Implementasi mekanisme konversi nilai belanja menjadi poin loyalitas memberikan fleksibilitas manajerial bagi pihak toko. Administrator dapat secara dinamis menyesuaikan parameter konversi, periode evaluasi kampanye, serta durasi aktif batas klaim tiket penukaran sesuai dengan dinamika strategi pemasaran tanpa perlu mengubah arsitektur sistem.
3. **Efisiensi dan Akurasi Data:** Penerapan arsitektur Transaksi Atomik (`$transaction`) dan Logika Reduksi Data (*Reduction Logic*) menjamin integritas data saldo poin dan eliminasi duplikasi transaksi kasir dengan kompleksitas $O(1)$. Evaluasi komparatif membuktikan adanya percepatan waktu rekapitulasi data reward dari hitungan hari menjadi hanya dalam hitungan detik.
4. **Transparansi dan Pengalaman Pengguna (*User Experience*):** Melalui penyediaan portal member mandiri dan fitur Kartu Digital QR Code, sistem berhasil meningkatkan transparansi program loyalitas. Pelanggan dapat memantau saldo poin dan riwayat transaksi secara *real-time*, yang terbukti menumbuhkan retensi belanja dan loyalitas jangka panjang.
5. **Validitas Fungsional:** Berdasarkan hasil pengujian menggunakan metode *Black Box Testing*, seluruh modul fungsional—termasuk sinkronisasi transaksi kasir, kalkulasi poin otomatis, perankingan *multi-level tie breaker*, hingga integrasi notifikasi WhatsApp—dinyatakan berjalan 100% valid dan sesuai dengan spesifikasi kebutuhan pengguna (*user requirements*) yang telah ditetapkan.

---

### 5.2 Saran

Demi pengembangan dan penyempurnaan sistem di masa mendatang, peneliti selanjutnya disarankan untuk mempertimbangkan beberapa poin berikut:

1. **Otomatisasi Sinkronisasi Real-Time (*Event-Driven*):** Disarankan untuk mengembangkan sistem agar penarikan data dari database transaksi toko tidak lagi berbasis *on-demand* (klik tombol fetch manual oleh admin), melainkan berjalan secara otomatis penuh menggunakan arsitektur *Event-Driven* atau Webhook. Dengan demikian, setiap kali ada transaksi baru tercatat di kasir, data langsung tersinkronisasi detik itu juga tanpa intervensi administrator.
2. **Implementasi Analitik Prediktif:** Sistem dapat dikembangkan lebih lanjut dengan menambahkan algoritma *Predictive Analytics* dan *Machine Learning* untuk memetakan pola perilaku belanja pelanggan, segmentasi RFM (*Recency, Frequency, Monetary*), serta memprediksi potensi perpindahan pelanggan ke kompetitor (*churn prediction*).
3. **Penguatan Keamanan dan Skalabilitas:** Seiring dengan bertumbuhnya volume data transaksi jangka panjang pada basis data PostgreSQL, disarankan untuk melakukan pengindeksan basis data (*database indexing*) lanjutan, partisi tabel transaksi, serta audit berkala terhadap protokol keamanan API guna menjaga performa sistem tetap optimal pada skala data perusahaan yang lebih besar.

---

## 🛠️ 8. BAGIAN 7: PANDUAN GAMBAR & DIAGRAM DRAW.IO

File XML siap import telah tersedia di folder `docs/`:
1. `docs/erd_revisi_v2.xml` $\to$ Untuk **Gambar 3.3 ERD Diagram** (Pastikan saat ekspor, header entitas `RewardRedemption` berlatar putih/terbaca jelas).
2. `docs/class_diagram_revisi_v2.xml` $\to$ Untuk **Gambar 3.5 Class Diagram**.
3. `docs/flowchart_revisi_v2.xml` $\to$ Untuk **Gambar 3.6 Flowchart System**.

**Langkah Ekspor PNG di Draw.io:**
- Buka [app.diagrams.net](https://app.diagrams.net/) $\to$ **File > Open From > Device** $\to$ Pilih file XML.
- Klik **File > Export as > PNG** (Pilih DPI: 300, Border Width: 10).
- Sisipkan (*insert picture*) ke dalam Microsoft Word.

---

## 🔄 9. BAGIAN 8: PANDUAN & TEKS INTEGRASI DATA TRANSAKSI TOKO (POS KASIR)

> **📍 PETUNJUK PENERAPAN KE NASKAH:**  
> Materi di bawah ini digunakan untuk melengkapi **BAB III (Sub-bab 3.4.5 & 3.5)** dan **BAB IV (Sub-bab 4.3.1 & 4.4.2)** terkait cara mengambil dan memasukkan data transaksi dari sistem kasir toko (*POS*) ke dalam sistem reward.

### A. Draf Teks untuk BAB III (Sub-bab 3.4.5 & 3.5 - Manajemen Data Transaksi)
Salin teks berikut ke dalam Sub-bab 3.4.5 / 3.5 pada naskah skripsi:

```text
3.4.5 Manajemen Data Transaksi & Integrasi Basis Data Kasir

Guna menjembatani transaksi belanja pelanggan dari kasir fisik Toko Miniposh ke dalam sistem reward berbasis web, sistem dirancang dengan dua skenario integrasi:

1. Mekanisme Penarikan Langsung (Store Database Bridge / POS Direct Query):
   Sistem aplikasi web reward terhubung ke basis data kasir melalui modul StoreDatabase Adapter. Administrator cukup menentukan rentang tanggal transaksi (startDate hingga endDate), dan sistem akan secara otomatis mengeksekusi kueri penarikan data dari tabel sumber transaksi kasir (StoreTransactionSource).

2. Mekanisme Unggah Berkas Transaksi (Batch CSV Upload):
   Sebagai skenario alternatif apabila komputer kasir beroperasi dalam jaringan lokal terisolasi (offline POS), sistem menyediakan fitur impor berkas terstruktur (.csv/.xlsx). Rekapitulasi transaksi kasir harian/mingguan dapat diekspor dari aplikasi kasir lokal, kemudian diunggah ke sistem reward untuk diproses secara massal.

Data mentah transaksi yang ditarik dari kasir memuat 5 atribut esensial:
a. ID Member (memberId): Nomor identitas unik pelanggan.
b. Nama Member (memberName): Nama lengkap pelanggan.
c. Tanggal Transaksi (transactionDate): Stempel waktu terjadinya transaksi di kasir.
d. Total Belanja (amount): Nominal pembelanjaan dalam satuan rupiah.
e. Nomor Telepon (phone): Nomor kontak aktif untuk verifikasi dan notifikasi reward.
```

### B. Draf Teks untuk BAB IV (Sub-bab 4.4.2 - Alur Kerja Ekstraksi & Sinkronisasi Transaksi)
Salin teks berikut ke dalam Sub-bab 4.4.2 pada naskah skripsi:

```text
4.4.2 Mekanisme Ekstraksi Data Transaksi dan Logika Reduksi Duplikasi

Proses pemasukan data transaksi dari kasir ke dalam sistem reward melalui tahapan komputasi bertingkat:

1. Tahap Ekstraksi (Fetch & Date-Range Filtering):
   Sistem mengeksekusi kueri ke basis data kasir berdasarkan parameter tanggal yang dipilih oleh admin. Sistem memastikan data yang ditarik tepat mencakup transaksi dari pukul 00:00:00 hari pertama hingga pukul 23:59:59 hari terakhir.

2. Tahap Deduplikasi Cepat (O(1) Hash-Set Lookup):
   Untuk mencegah terjadinya pencatatan ganda (double points) akibat penarikan data berulang, sistem membentuk kunci komposit unik berbasis: Key = (MemberId + Timestamp + Amount).
   Sistem memeriksa keberadaan data di basis data reward menggunakan struktur Hash-Set berkecepatan O(1). Transaksi yang sudah pernah tersimpan sebelumnya akan otomatis ditandai sebagai duplikat dan dilewati (skipped).

3. Tahap Konversi Poin Otomatis:
   Setiap transaksi baru yang valid akan dikonversikan menjadi poin loyalitas berdasarkan nilai konversi aktif (misal: Rp 5.000 = 1 Poin).
   Rumus: Poin Baru = Math.floor(Total Belanja / Nilai Konversi)

4. Tahap Penyimpanan Transaksi Atomik (Atomic Batch Insertion):
   Data transaksi baru disimpan ke tabel 'transactions', dan secara simultan sistem memperbarui statistik pada tabel 'members' (menambahkan totalPoints, totalSpent, dan transactionCount) dalam satu kesatuan transaksi database guna menjamin konsistensi data (ACID).
```

---

## 📸 10. BAGIAN 9: PANDUAN SCREENSHOT ANTARMUKA (UI) VS KODE PROGRAM (SOURCE CODE)

> **📍 STANDAR AKADEMIK PENULISAN SKRIPSI TEKNIK INFORMATIKA:**  
> Hindari memasukkan *screenshot gambar kode program yang panjang* di dalam bab pembahasan utama (BAB IV), karena membuat naskah tidak rapi dan sulit dibaca oleh penguji.

### A. Gambar yang WAJIB Discreenshot di BAB IV (Sub-bab 4.3):
Tampilkan tangkapan layar antarmuka pengguna (*User Interface*) dengan resolusi jernih:
1. **Antarmuka Admin:**
   - Halaman Dashboard Utama (Menampilkan ringkasan metrik total poin, member, dan transaksi).
   - Halaman Data Transaksi (Menampilkan fitur **Tarik Data POS** dan tombol **Upload CSV**).
   - Halaman Penentuan Reward / Active Campaigns (Menampilkan daftar peringkat pemenang Top-N).
   - Halaman Verifikasi Klaim Reward (Daftar tiket penukaran hadiah).
2. **Antarmuka Member:**
   - Halaman Cek Poin Mandiri & Kartu Digital Member (Menampilkan QR Code Member).
   - Halaman Katalog Reward & Riwayat Transaksi.
   - Halaman Tiket Digital Klaim Hadiah.

### B. Cara Menampilkan Kode Program di BAB IV:
Gunakan format **Teks / Code Block / Pseudocode Ringkas (5–15 baris)**, bukan gambar *screenshot*. Contoh potongan kode yang relevan ditampilkan di naskah:

```typescript
// Contoh Snippet: Logika Deduplikasi O(1) dan Konversi Poin
const existingSet = new Set(
    existingTransactions.map(t => `${t.member.memberId}-${t.transactionDate.getTime()}-${t.amount}`)
);

const validData = storeData.map(row => {
    const isDuplicate = existingSet.has(`${row.memberId}-${new Date(row.transactionDate).getTime()}-${row.amount}`);
    const pointsEarned = Math.floor(row.amount / conversionRate);
    return { ...row, pointsEarned, isDuplicate };
});
```

### C. Di Mana Source Code Lengkap Ditaruh?
- **Listing Source Code Lengkap:** Diletakkan pada bagian **LAMPIRAN** di akhir dokumen skripsi (setelah Daftar Pustaka), dengan judul `Lampiran 1: Listing Program Inti Sistem Reward`.

