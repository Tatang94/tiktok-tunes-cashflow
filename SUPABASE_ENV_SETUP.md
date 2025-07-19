# Panduan Setting Supabase Environment Variables di Vercel

## Langkah 1: Dapatkan Credentials dari Supabase

### 1.1. Login ke Supabase
- Buka https://supabase.com/dashboard
- Login dengan akun Anda

### 1.2. Pilih Project
- Klik project yang sudah dibuat
- Jika belum ada, buat project baru

### 1.3. Ambil API Credentials
1. **Di dashboard project**, klik **"Settings"** (ikon gear di sidebar kiri)
2. **Klik "API"** di menu Settings
3. **Copy 2 values ini:**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **JANGAN ambil service_role key** - gunakan yang **anon public**!

## Langkah 2: Set di Vercel Dashboard

### 2.1. Buka Vercel Project
- Login ke https://vercel.com
- Pilih project TikTok Creator Platform Anda

### 2.2. Masuk ke Environment Variables
1. **Klik tab "Settings"** (di top navigation)
2. **Klik "Environment Variables"** (di sidebar kiri)

### 2.3. Tambah Environment Variables
**Variable 1:**
- **Name**: `SUPABASE_URL`
- **Value**: `https://xxxxx.supabase.co` (dari Supabase)
- **Environments**: ✓ Production ✓ Preview ✓ Development
- **Klik "Save"**

**Variable 2:**
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (dari Supabase)
- **Environments**: ✓ Production ✓ Preview ✓ Development
- **Klik "Save"**

## Langkah 3: Redeploy

### 3.1. Trigger Redeploy
Setelah menambah environment variables:
1. **Klik tab "Deployments"**
2. **Klik "..." pada deployment terakhir**
3. **Klik "Redeploy"**

ATAU

1. **Push commit baru ke Git repository**
2. **Vercel akan auto-deploy dengan env vars baru**

## Langkah 4: Verifikasi

### 4.1. Test Aplikasi
1. **Buka URL Vercel app Anda**
2. **Check console browser** (F12)
3. **Seharusnya tidak ada error "Supabase configuration not found"**
4. **Test form registrasi creator**

### 4.2. Debug Jika Masih Error
Jika masih ada error:
- Check spelling variable names (case-sensitive!)
- Pastikan values tidak ada spasi di awal/akhir
- Pastikan gunakan anon key, bukan service_role
- Check Vercel Function Logs untuk error details

## Troubleshooting

### Error: "Supabase configuration not found"
✅ **Solusi**: Environment variables belum di-set atau salah nama

### Error: "Failed to fetch songs"  
✅ **Solusi**: Database tables belum dibuat di Supabase (lihat SUPABASE_MIGRATION_GUIDE.md)

### Error: "Invalid API key"
✅ **Solusi**: Pastikan pakai anon key, bukan service_role key

## Template Values (Ganti dengan milik Anda):
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...
```

Setelah setup selesai, aplikasi akan connect ke Supabase dengan benar!