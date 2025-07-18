# TikTok Creator Platform - Replit Migration

## Overview
Platform untuk creator TikTok yang memungkinkan mereka mendaftar, memilih lagu, dan mengupload video untuk mendapatkan penghasilan. Proyek ini telah berhasil dimigrasikan dari Lovable ke environment Replit.

## Recent Changes (Juli 2025)
### Migrasi Sukses dari Lovable ke Replit
- ✅ Migrasi database dari Supabase ke backend Replit dengan storage in-memory
- ✅ Konversi routing dari React Router ke Wouter (sesuai guidelines Replit)
- ✅ Pembuatan API endpoints lengkap untuk creators, songs, dan video submissions
- ✅ Update semua komponen untuk menggunakan API backend baru
- ✅ Perbaikan masalah font loading dan error komponen
- ✅ Server berjalan lancar di port 5000

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

## User Preferences
- Bahasa komunikasi: Indonesia
- Prefer clear explanations of technical changes
- Focus on functional outcomes

## Sample Data
Platform sudah dilengkapi dengan sample songs untuk testing:
- "Trending Beat #1" - Rp 150/video
- "Viral Sound #2" - Rp 200/video  
- "Popular Track #3" - Rp 100/video