# TikTok Creator Platform

## Overview
Platform untuk creator TikTok yang memungkinkan mereka mendaftar, memilih lagu, dan mengupload video untuk mendapatkan penghasilan. Platform ini membantu creator memonetisasi konten mereka dengan sistem pembayaran otomatis.

## Recent Changes (Juli 2025)
### Platform Development Progress  
- ✅ Konversi routing dari React Router ke Wouter untuk optimasi performa
- ✅ Perbaikan masalah font loading dan error komponen
- ✅ Server berjalan lancar di port 5000
- ✅ Fungsionalitas tombol-tombol di landing page telah ditambahkan
- ✅ Smooth scrolling untuk navigasi antar section
- ✅ Tombol download dan Spotify link sudah berfungsi
- ✅ API key Supabase sudah dikonfigurasi melalui environment variables
- ✅ Platform development berhasil diselesaikan
- ✅ Database schema clean tersedia (database-clean-setup.sql tanpa data sample)
- ✅ Sistem login admin dengan username: admin, password: audio
- ✅ Perbaikan tombol "Daftar Creator" dan error handling
- ✅ Perbaikan styling section Bonus Spesial
- ✅ Form validation ketat untuk TikTok username, email, dan phone
- ✅ Creator Dashboard dengan fallback handling untuk database yang belum siap
- ✅ Login system untuk creator yang sudah daftar sebelumnya
- ✅ Toggle form registration/login dengan session management localStorage
- ✅ Platforms page dengan roadmap dan status platform
- ✅ Legal & Compliance page dengan FAQ dan dokumen legal
- ✅ Support Center dengan multi-channel support dan ticket system
- ✅ Navigation terintegrasi di footer untuk semua halaman baru
- ✅ Migrasi berhasil dari Replit Agent ke Replit environment
- ✅ Migration completed with all checklist items finished
- ✅ Admin Panel text removed from footer navigation per user request
- ✅ Supabase credentials dikonfigurasi sebagai environment variables
- ✅ Support Center diupdate dengan kontak WhatsApp (wa.me/89663596711) dan email (tatangtaryaedi.tte@gmail.com)
- ✅ Error handling improved untuk Supabase connection fallback
- ✅ Admin dashboard reorganized dengan 4 tab utama: Analytics, Video Submissions, Kelola Lagu, Creators
- ✅ Earnings diupdate dari "Rp 100/video" ke "Rp 0,00002489 per view"
- ✅ Video limit diubah dari "maksimal 50 video per hari" ke "tanpa batas"
- ✅ Layout website dikunci agar tidak geser dengan CSS fixes
- ✅ Program referral difungsikan di Creator Dashboard dengan kode unik per creator
- ✅ Fitur share referral via WhatsApp dan copy link/pesan
- ✅ Stats referral dengan bonus Rp 500 per referral berhasil (UPDATED)
- ✅ Database schema update untuk Supabase dengan sistem referral lengkap
- ✅ File database-supabase-setup.sql telah dibuat untuk migrasi
- ✅ Vercel deployment configuration fixed dengan perbaikan 404 error
- ✅ API endpoints menggunakan Supabase langsung (tanpa mock data)
- ✅ Fullstack app dapat di-deploy ke Vercel dengan proper API routing
- ⚠️ Database table perlu disetup manual di Supabase (lihat SUPABASE_MIGRATION_GUIDE.md)
- ✅ Migrasi berhasil dari Replit Agent ke environment Replit (Juli 2025)
- ✅ Navigation footer dibersihkan: menghapus link "Admin Panel" dan "Creator Dashboard"
- ✅ Vercel deployment diperbaiki: API diubah ke serverless functions dengan @vercel/node
- ✅ Root cause analysis 404 error Vercel: build structure mismatch dan API format diperbaiki
- ✅ Build script updated untuk kompatibilitas Vercel (move dist/public ke dist/)

## Project Architecture
### Backend (Node.js + Express)
- **Storage**: In-memory storage dengan interface IStorage
- **API Routes**: RESTful endpoints untuk CRUD operations
- **Schema**: Drizzle ORM dengan TypeScript types
- **Validation**: Zod schema validation

### Frontend (React + Vite)
- **Routing**: Wouter untuk client-side routing
- **State Management**: TanStack Query untuk data fetching
- **UI Components**: Shadcn/ui components dengan Tailwind CSS
- **Styling**: TikTok-inspired color palette

### Data Models
1. **Creators**: TikTok username, email, phone, e-wallet info
2. **Songs**: Title, artist, earnings per video, status
3. **Video Submissions**: Creator-song relationships, approval status

### Pages Architecture
1. **Homepage (/)**: Landing page dengan hero, features, registration form
2. **Creator Dashboard (/creator-dashboard)**: Dashboard untuk tracking earnings dan videos
3. **Admin Panel (/admin)**: Panel admin dengan login (admin/audio)
4. **Platforms (/platforms)**: Info multi-platform dengan roadmap
5. **Legal (/legal)**: Dokumen legal, FAQ, dan compliance info
6. **Support (/support)**: Multi-channel support dengan ticket system

## User Preferences
- Bahasa komunikasi: Indonesia
- Prefer clear explanations of technical changes
- Focus on functional outcomes

## Sample Data
Platform sudah dilengkapi dengan sample songs untuk testing:
- "Trending Beat #1" - Rp 150/video
- "Viral Sound #2" - Rp 200/video  
- "Popular Track #3" - Rp 100/video