import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Vercel build (FIXED for blank page)...');

// Clean previous build
if (fs.existsSync('./vercel-dist-fixed')) {
  execSync('rm -rf ./vercel-dist-fixed', { stdio: 'inherit' });
}

// Build the client with Vite
console.log('📦 Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Create vercel-dist-fixed directory
fs.mkdirSync('./vercel-dist-fixed', { recursive: true });

// Copy static files from dist/public to root of vercel-dist-fixed
console.log('📁 Copying static files to root...');
if (fs.existsSync('./dist/public')) {
  execSync('cp -r ./dist/public/* ./vercel-dist-fixed/', { stdio: 'inherit' });
  console.log('✅ Static files copied to vercel-dist-fixed/ root');
} else {
  console.error('❌ dist/public not found');
  process.exit(1);
}

// Create api directory
fs.mkdirSync('./vercel-dist-fixed/api', { recursive: true });

// Create API file for Vercel
console.log('🔧 Creating API for Vercel...');
const apiContent = `import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method, body } = req;
  const pathParts = url.split('/').filter(Boolean);
  const endpoint = pathParts[1]; // api/[endpoint]

  try {
    // Config endpoint
    if (endpoint === 'config' && method === 'GET') {
      return res.json({
        VITE_SUPABASE_URL: process.env.SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
      });
    }

    // Creators endpoints
    if (endpoint === 'creators') {
      if (method === 'GET') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        const { data: creators, error } = await supabase
          .from('creators')
          .select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: "Failed to fetch creators" });
        }
        
        return res.json(creators);
      }

      if (method === 'POST') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        // Generate referral code
        const referralCode = \`REF\${Date.now().toString().slice(-6)}\`;
        
        const { data: creator, error } = await supabase
          .from('creators')
          .insert([{
            ...body,
            referral_code: referralCode,
            total_earnings: 0,
            video_count: 0
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: "Failed to create creator" });
        }
        
        return res.status(201).json(creator);
      }
    }

    // Songs endpoint
    if (endpoint === 'songs' && method === 'GET') {
      if (!supabase) {
        return res.status(500).json({ error: "Database not configured" });
      }
      
      const { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: "Failed to fetch songs" });
      }
      
      return res.json(songs);
    }

    // Route not found
    return res.status(404).json({ error: "Route not found" });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}`;

fs.writeFileSync('./vercel-dist-fixed/api/index.js', apiContent);

// Create minimal Vercel configuration
console.log('⚙️ Creating Vercel configuration...');
const vercelConfig = {
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ]
};

fs.writeFileSync('./vercel-dist-fixed/vercel.json', JSON.stringify(vercelConfig, null, 2));

// Create package.json for dependencies
const packageJson = {
  "name": "tiktok-creator-platform-vercel",
  "version": "1.0.0",
  "type": "module", 
  "dependencies": {
    "@supabase/supabase-js": "^2.52.0"
  }
};

fs.writeFileSync('./vercel-dist-fixed/package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Fixed Vercel build complete!');
console.log('📁 Deploy folder: ./vercel-dist-fixed');
console.log('🚀 Structure: static files di root, API di /api/');
console.log('💡 This should fix the blank page issue!');