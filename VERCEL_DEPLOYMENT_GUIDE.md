# Panduan Deployment ke Vercel

## Masalah yang Diperbaiki
✅ **Masalah**: Deploy Vercel hanya menampilkan teks/kode sumber
✅ **Solusi**: Konfigurasi ulang untuk deployment fullstack yang tepat
✅ **Masalah**: 404 NOT_FOUND error di Vercel
✅ **Solusi**: API refactored untuk Vercel serverless functions dengan @vercel/node

## File yang Ditambahkan untuk Vercel:

### 1. `vercel.json` - Konfigurasi deployment
```json
{
  "version": 2,
  "buildCommand": "node build.js",
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/index.ts", 
      "use": "@vercel/node"
    }
  ]
}
```

### 2. `api/index.ts` - API endpoint untuk Vercel
- Berisi semua API routes (creators, songs, referrals)
- Konfigurasi khusus untuk serverless function
- Copy dari server/routes.ts dengan adaptasi untuk Vercel

### 3. `build.js` - Script build custom
- Build client dengan Vite
- Copy file yang diperlukan ke folder api
- Persiapan deployment

### 4. `client/package.json` - Konfigurasi build client

## Langkah Deployment:

### 1. Push ke Repository
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### 2. Deploy di Vercel
1. Buka Vercel Dashboard
2. Import project dari Git repository
3. Vercel akan otomatis detect `vercel.json`
4. Deploy akan berjalan dengan konfigurasi yang benar

### 3. Set Environment Variables di Vercel

**PENTING**: Ini adalah langkah wajib agar aplikasi bisa connect ke database!

#### Cara Setting Environment Variables:
1. **Buka Vercel Dashboard** → Pilih project Anda
2. **Klik tab "Settings"** 
3. **Klik "Environment Variables"** di sidebar kiri
4. **Tambahkan variables berikut:**

| Name | Value | Production/Preview/Development |
|------|-------|--------------------------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | ✓ All environments |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsIn...` | ✓ All environments |

#### Cara Mendapatkan Values:
1. **Buka Supabase Dashboard** → https://supabase.com/dashboard
2. **Pilih project Anda**
3. **Klik "Settings"** → **"API"**
4. **Copy values:**
   - **URL**: Project URL 
   - **anon/public**: anon key (bukan service_role!)

#### Screenshot Panduan:
```
Vercel Dashboard → Project → Settings → Environment Variables
[Add New] 
Name: SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
[Save]

[Add New]
Name: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✓ Production ✓ Preview ✓ Development
[Save]
```

⚠️ **Setelah menambah environment variables, Anda HARUS redeploy!**

### ⚠️ Troubleshooting Deploy Errors:

**Error: "routes cannot be present"**
✅ **Sudah diperbaiki** - Konfigurasi vercel.json sudah diupdate untuk menghindari konflik routes vs rewrites

**Error: "name contains invalid characters"**  
✅ **Solusi**: Gunakan nama `tiktok_creator_platform` (dengan underscore)

**Error: Environment Variables tidak cocok**
✅ **Solusi**: Gunakan nama variables yang tepat:
- `SUPABASE_URL` (bukan VITE_SUPABASE_URL)
- `SUPABASE_ANON_KEY` (bukan VITE_SUPABASE_ANON_KEY)

**Error: "Database not configured"**
✅ **Solusi**: Pastikan environment variables Supabase sudah di-set dengan benar di Vercel

## ⚠️ PENTING: Setup Database
Sebelum menggunakan aplikasi:
1. Buat database tables di Supabase menggunakan `database-supabase-setup.sql`
2. Set environment variables di Vercel
3. Aplikasi akan menggunakan data asli dari Supabase (bukan mock data)

## Yang Akan Bekerja Setelah Deploy:
- ✅ Frontend React akan ter-render dengan benar
- ✅ API endpoints akan accessible di `/api/*`
- ✅ Sistem referral akan berfungsi
- ✅ Form registrasi akan bekerja
- ✅ Creator dashboard akan load

## Testing Setelah Deploy:
1. Buka URL Vercel app
2. Pastikan homepage loading dengan UI yang benar
3. Test form registrasi
4. Test Creator Dashboard
5. Test sistem referral

## Troubleshooting:
- Jika masih ada masalah, check Vercel Function Logs
- Pastikan environment variables sudah di-set
- Check build logs untuk error

Deployment sekarang sudah siap untuk Vercel!