# Database Setup Guide

## Prerequisites
- MySQL Server installed and running
- MySQL credentials (username/password)

## Option 1: Using Prisma Migrate (Recommended ✅)

Prisma Migrate akan otomatis membuat database dan table berdasarkan schema:

```bash
# 1. Pastikan MySQL server berjalan
# 2. Update .env dengan credentials yang benar
# 3. Jalankan migration
npx prisma migrate dev --name init
```

Ini akan:
- ✅ Membuat database `reward_app` jika belum ada
- ✅ Membuat table `admins` dengan struktur yang benar
- ✅ Generate Prisma Client
- ✅ Membuat migration history

## Option 2: Manual SQL Setup

### Step 1: Import SQL File

```bash
# Menggunakan MySQL command line
mysql -u root -p < prisma/setup.sql

# Atau menggunakan MySQL client lain seperti:
# - phpMyAdmin: Import file setup.sql
# - MySQL Workbench: File > Run SQL Script
# - HeidiSQL: File > Load SQL file
```

### Step 2: Verify Database

```bash
mysql -u root -p
```

```sql
USE reward_app;
SHOW TABLES;
DESCRIBE admins;
```

## Seeding Data (Admin User)

Setelah database siap, jalankan seed untuk membuat admin user:

```bash
npx prisma db seed
```

Atau jika belum konfigurasi seed di `package.json`:

```bash
npx tsx prisma/seed.ts
```

### Default Admin Credentials:
- **Email:** admin@reward.com
- **Password:** Admin123!

## Connection String Format

Update file `.env` dengan format:

```env
DATABASE_URL="mysql://username:password@host:port/database_name"
```

### Contoh:
```env
# Local development
DATABASE_URL="mysql://root:@localhost:3306/reward_app"

# Dengan password
DATABASE_URL="mysql://root:mypassword@localhost:3306/reward_app"

# Remote server
DATABASE_URL="mysql://user:pass@192.168.1.100:3306/reward_app"
```

## Troubleshooting

### Error: Access denied for user

```bash
# Buat user baru atau reset password root
mysql -u root -p
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
```

### Error: Database does not exist

Jika menggunakan Prisma Migrate, tambahkan di connection string:
```env
DATABASE_URL="mysql://root:@localhost:3306/reward_app?createDatabaseIfNotExists=true"
```

Atau buat manual:
```sql
CREATE DATABASE reward_app;
```

### Error: Table already exists

Drop table terlebih dahulu:
```sql
DROP TABLE admins;
```

Kemudian jalankan ulang setup SQL atau migration.

## Database Schema

```
┌─────────────────────────────────────┐
│            admins                   │
├─────────────────────────────────────┤
│ id           VARCHAR(30)     PK     │
│ email        VARCHAR(255)    UNIQUE │
│ password     VARCHAR(255)           │
│ name         VARCHAR(255)           │
│ createdAt    DATETIME(3)            │
│ updatedAt    DATETIME(3)            │
└─────────────────────────────────────┘
```

## Next Steps

1. ✅ Setup database (pilih Option 1 atau 2)
2. ✅ Jalankan seed untuk membuat admin
3. ✅ Start dev server: `npm run dev`
4. ✅ Login dengan credentials default
