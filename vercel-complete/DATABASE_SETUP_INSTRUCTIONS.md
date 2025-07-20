# Setup Database Supabase untuk TikTok Creator Platform

## ⚠️ GUNAKAN FILE SQL YANG BARU: `database-supabase-setup.sql`

Instruksi ini telah diperbarui untuk menggunakan schema database yang baru dengan sistem referral lengkap.

## Langkah-langkah Setup Database:

### 1. Buka Supabase Dashboard
- Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- Pilih project yang sudah dikonfigurasi dengan API key yang ada

### 2. Jalankan SQL Script Baru
- Buka **SQL Editor** di dashboard Supabase
- **HAPUS semua table lama jika ada**
- Copy dan paste **SELURUH ISI** file `database-supabase-setup.sql`
- Jalankan script tersebut

### 3. Verifikasi Tables Baru
Setelah menjalankan script, pastikan tables berikut telah dibuat:
- `creators` (dengan field referral: referral_code, referred_by, referral_earnings)
- `songs` 
- `video_submissions`
- `referrals` (table baru untuk tracking referral dengan bonus Rp 500)

### 4. Set Environment Variable
1. Di Supabase dashboard, klik **Connect**
2. Copy **URI** dari section "Connection string" → "Transaction pooler"
3. Replace `[YOUR-PASSWORD]` dengan password database project Anda
4. Set sebagai environment variable `DATABASE_URL` di Replit

## Fitur Baru di Database Schema:
- ✅ Sistem referral lengkap dengan tracking
- ✅ Bonus referral Rp 500 per referral berhasil
- ✅ Auto-generate referral code untuk setiap creator
- ✅ Trigger otomatis untuk bonus referral
- ✅ RLS (Row Level Security) sudah dikonfigurasi
- ✅ Indexes untuk performa optimal

## Sample Data
File `database-supabase-setup.sql` sudah include sample songs dan 1 test creator untuk testing platform.

---
**Catatan**: File ini menggantikan semua setup database sebelumnya. Gunakan hanya `database-supabase-setup.sql` untuk setup yang baru.