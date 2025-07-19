# Panduan Migrasi Database ke Supabase

## File SQL yang Digunakan: `database-supabase-setup.sql`

### Langkah-langkah Setup:

1. **Buka Supabase Dashboard**
   - Login ke [Supabase Dashboard](https://supabase.com/dashboard)
   - Pilih project Anda

2. **Jalankan SQL Script**
   - Buka **SQL Editor** di dashboard Supabase
   - Copy seluruh isi file `database-supabase-setup.sql`
   - Paste dan jalankan script tersebut

3. **Verifikasi Tables**
   Setelah script dijalankan, pastikan tables berikut telah dibuat:
   - `creators` (dengan field referral: referral_code, referred_by, referral_earnings)
   - `songs` 
   - `video_submissions`
   - `referrals` (table baru untuk tracking referral dengan bonus Rp 500)

4. **Set Environment Variable**
   Ambil DATABASE_URL dari Supabase:
   - Connection string → Transaction pooler
   - Ganti `[YOUR-PASSWORD]` dengan password database Anda
   - Set sebagai environment variable DATABASE_URL

## Fitur Baru di Database:
- ✅ Sistem referral lengkap dengan tracking
- ✅ Bonus referral Rp 500 per referral berhasil
- ✅ Auto-generate referral code untuk setiap creator
- ✅ Trigger otomatis untuk bonus referral
- ✅ RLS (Row Level Security) sudah dikonfigurasi
- ✅ Indexes untuk performa optimal

## Sample Data:
File sudah include sample songs dan 1 test creator untuk testing.