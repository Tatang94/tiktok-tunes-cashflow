import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Copying ALL Replit files to Vercel...');

// Clean previous build
if (fs.existsSync('./vercel-complete')) {
  execSync('rm -rf ./vercel-complete', { stdio: 'inherit' });
}

// Create vercel-complete directory
fs.mkdirSync('./vercel-complete', { recursive: true });

console.log('📦 Building frontend first...');
execSync('vite build', { stdio: 'inherit' });

// Copy built frontend files to root
if (fs.existsSync('./dist/public')) {
  execSync('cp -r ./dist/public/* ./vercel-complete/', { stdio: 'inherit' });
  console.log('✅ Frontend files copied to root');
}

// Copy ALL source files for Vercel
console.log('📁 Copying ALL project files...');

// Copy API files
execSync('mkdir -p ./vercel-complete/api', { stdio: 'inherit' });
execSync('cp -r ./api/* ./vercel-complete/api/', { stdio: 'inherit' });

// Copy server files  
execSync('mkdir -p ./vercel-complete/server', { stdio: 'inherit' });
execSync('cp -r ./server/* ./vercel-complete/server/', { stdio: 'inherit' });

// Copy client source
execSync('mkdir -p ./vercel-complete/client', { stdio: 'inherit' });
execSync('cp -r ./client/* ./vercel-complete/client/', { stdio: 'inherit' });

// Copy shared schema
execSync('mkdir -p ./vercel-complete/shared', { stdio: 'inherit' });
execSync('cp -r ./shared/* ./vercel-complete/shared/', { stdio: 'inherit' });

// Copy config files
const configFiles = [
  'package.json',
  'package-lock.json', 
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  'vite.config.ts',
  'drizzle.config.ts',
  'components.json'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    execSync(`cp ${file} ./vercel-complete/`, { stdio: 'inherit' });
  }
});

// Copy documentation files
const docFiles = [
  'replit.md',
  'DATABASE_SETUP_INSTRUCTIONS.md',
  'SUPABASE_ENV_SETUP.md', 
  'SUPABASE_MIGRATION_GUIDE.md',
  'VERCEL_DEPLOYMENT_GUIDE.md',
  'VERCEL_DEPLOY_INSTRUCTIONS.md',
  'VERCEL_TROUBLESHOOTING.md',
  'VERCEL_FINAL_INSTRUCTIONS.md',
  'database-supabase-setup.sql'
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    execSync(`cp ${file} ./vercel-complete/`, { stdio: 'inherit' });
  }
});

// Copy build scripts
const buildFiles = [
  'build.js',
  'vercel-build.js',
  'vercel-build-fixed.js'
];

buildFiles.forEach(file => {
  if (fs.existsSync(file)) {
    execSync(`cp ${file} ./vercel-complete/`, { stdio: 'inherit' });
  }
});

// Create optimized Vercel configuration
console.log('⚙️ Creating Vercel configuration...');
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@20"
    }
  }
};

fs.writeFileSync('./vercel-complete/vercel.json', JSON.stringify(vercelConfig, null, 2));

// Update package.json for Vercel deployment
console.log('📝 Updating package.json for Vercel...');
const packageJsonPath = './vercel-complete/package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add Vercel specific scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "vite build",
  "vercel-build": "npm run build"
};

// Ensure all dependencies are included
if (!packageJson.dependencies['@vercel/node']) {
  packageJson.dependencies['@vercel/node'] = '^3.0.0';
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('🎯 Creating deployment README...');
const deployReadme = `# TikTok Creator Platform - Vercel Deployment

## 📁 COMPLETE PROJECT COPY
Folder ini berisi SEMUA file dari project Replit:
- ✅ Frontend build (index.html, assets/)
- ✅ API endpoints (api/)
- ✅ Server code (server/)
- ✅ Client source (client/)
- ✅ Shared schema (shared/)
- ✅ Config files (package.json, tsconfig.json, dll)
- ✅ Documentation (*.md files)
- ✅ Database setup (database-supabase-setup.sql)

## 🚀 CARA DEPLOY

### Option 1: Vercel CLI
\`\`\`bash
cd vercel-complete
npm install
vercel
\`\`\`

### Option 2: GitHub + Dashboard
1. Copy folder ini ke repo GitHub baru
2. Push ke GitHub
3. Import di Vercel Dashboard
4. Set environment variables

## ⚙️ ENVIRONMENT VARIABLES
Di Vercel Dashboard, set:
- \`SUPABASE_URL\`: https://xxx.supabase.co  
- \`SUPABASE_ANON_KEY\`: eyJhbGciOiJIUzI1NiIs...

## 📋 FEATURES INCLUDED
- Homepage dengan registration form
- Creator Dashboard dengan referral system
- Admin Panel (login: admin/audio)  
- Multi-platform roadmap (/platforms)
- Legal & compliance (/legal)
- Support center (/support)
- Supabase integration dengan fallback mode

## ✅ STATUS
READY FOR PRODUCTION - Semua file Replit sudah disalin lengkap!
`;

fs.writeFileSync('./vercel-complete/README.md', deployReadme);

console.log('✅ ALL Replit files copied to Vercel!');
console.log('📁 Deploy folder: ./vercel-complete');
console.log('🚀 Contains: Frontend + API + Server + Client + Config + Docs');
console.log('💡 Ready for complete Vercel deployment!');