# Implementasi Database (Bahan Laporan Skripsi)

Berikut adalah draf penjelasan teknis mengenai implementasi database yang dapat Anda salin dan sesuaikan ke dalam Bab **Implementasi Sistem** atau **Perancangan Sistem** pada laporan skripsi Anda.

---

### **Spesifikasi Database**

Sistem manajemen basis data (DBMS) yang digunakan dalam pengembangan aplikasi ini adalah **PostgreSQL**, yang di-hosting menggunakan layanan **Supabase**. Pemilihan arsitektur database berbasis *cloud-managed service* ini didasarkan pada kebutuhan skalabilitas, reliabilitas, dan performa tinggi untuk menangani transaksi data pelanggan secara *real-time*.

#### **1. Arsitektur Infrastruktur**
Berbeda dengan database konvensional yang di-hosting secara lokal (localhost/XAMPP), database aplikasi ini menggunakan arsitektur *Serverless PostgreSQL* di cloud.
*   **Provider**: Supabase (AWS Infrastructure).
*   **Tipe Database**: Relational Database Management System (RDBMS) PostgreSQL.
*   **Interface Akses**: Database tidak diakses melalui *query* SQL manual, melainkan menggunakan **Prisma ORM** (*Object-Relational Mapping*) untuk menjamin keamanan tipe data (*type-safety*) dan mencegah kerentanan *SQL Injection*.

#### **2. Manajemen Koneksi (Connection Pooling)**
Mengingat aplikasi dibangun menggunakan framework **Next.js** yang bersifat *serverless* dan *stateless*, manajemen koneksi database menjadi krusial. Sistem ini mengimplementasikan **PgBouncer** sebagai *connection pooler*.
*   **Masalah**: Koneksi langsung (*Direct Connection*) pada lingkungan serverless dapat menyebabkan "Connection Exhaustion" (koneksi habis) karena setiap request API membuka koneksi baru.
*   **Solusi**: Sistem dikonfigurasi menggunakan **Transaction Mode** pada Port 6543 (menggunakan Supabase Transaction Pooler). Hal ini memungkinkan ribuan request dari aplikasi `Reward System` untuk "berbagi" sejumlah kecil koneksi fisik ke database secara efisien, menjaga latensi tetap rendah (<100ms) bahkan saat trafik tinggi.

#### **3. Alasan Pemilihan Teknologi (Justifikasi)**
Peralihan dan pemilihan Supabase PostgreSQL dibandingkan solusi MySQL konvensional (seperti Aiven atau Localhost) didasarkan pada analisis teknis berikut:
1.  **Stabilitas Data**: PostgreSQL dikenal dengan kepatuhan ACID (*Atomicity, Consistency, Isolation, Durability*) yang ketat, sangat kritikal untuk aplikasi finansial/poin reward.
2.  **Efisiensi Development**: Supabase menyediakan dashboard GUI (Table Editor) yang memudahkan pemantauan data transaksi secara visual tanpa memerlukan *software* pihak ketiga.
3.  **Skalabilitas Cloud-Native**: Infrastruktur ini memungkinkan database untuk menangani lonjakan data transaksi (misal: sinkronisasi ribuan data pelanggan dari toko) tanpa membebani server aplikasi utama.

#### **4. Skema Integrasi**
Integrasi antara aplikasi dan database diatur melalui variabel lingkungan (*Environment Variables*) untuk keamanan.
*   **Direct Connection (Port 5432)**: Digunakan hanya saat proses *Deployment* dan *Migration* (perubahan struktur tabel) untuk memastikan integritas skema.
*   **Pooled Connection (Port 6543)**: Digunakan oleh aplikasi utama untuk operasional transaksi sehari-hari (CRUD) guna memaksimalkan performa.

---
**Contoh Kalimat untuk Kesimpulan/Saran:**
*"Implementasi database berbasis Cloud dengan Supabase terbukti mampu meningkatkan efisiensi proses sinkronisasi data pelanggan dari toko, menghilangkan kebutuhan input manual, dan menjamin integritas data poin reward secara real-time."*
