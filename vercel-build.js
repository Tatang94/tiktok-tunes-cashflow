import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Vercel-specific build...');

// Clean previous build
if (fs.existsSync('./vercel-dist')) {
  execSync('rm -rf ./vercel-dist', { stdio: 'inherit' });
}

// Build the client with Vite
console.log('📦 Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Create vercel-dist directory
fs.mkdirSync('./vercel-dist', { recursive: true });

// Copy static files from dist/public to vercel-dist
console.log('📁 Copying static files...');
if (fs.existsSync('./dist/public')) {
  execSync('cp -r ./dist/public/* ./vercel-dist/', { stdio: 'inherit' });
  console.log('✅ Static files copied to vercel-dist/');
} else {
  console.error('❌ dist/public not found');
  process.exit(1);
}

// Create api directory in vercel-dist
fs.mkdirSync('./vercel-dist/api', { recursive: true });

// Copy and modify API file for Vercel
console.log('🔧 Setting up API for Vercel...');
const apiContent = `import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from "zod";

// CORS setup
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Validation schemas
const insertCreatorSchema = z.object({
  tiktok_username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  ewallet_type: z.string(),
  ewallet_number: z.string(),
  referral_code: z.string().optional()
});

// Helper function to parse URL paths
function parseUrl(url) {
  const urlParts = url.split('?')[0].split('/');
  return {
    path: urlParts,
    endpoint: urlParts[2], // /api/[endpoint]
    param: urlParts[3] // /api/endpoint/[param]
  };
}

// Main handler function
export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, param, path } = parseUrl(req.url || '');

  try {
    // Config endpoint
    if (endpoint === 'config' && req.method === 'GET') {
      return res.json({
        VITE_SUPABASE_URL: process.env.SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
      });
    }

    // Creators endpoints
    if (endpoint === 'creators') {
      if (req.method === 'GET') {
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

      if (req.method === 'POST') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        const validatedData = insertCreatorSchema.parse(req.body);
        
        // Generate referral code
        const referralCode = \`REF\${Date.now().toString().slice(-6)}\`;
        
        const { data: creator, error } = await supabase
          .from('creators')
          .insert([{
            ...validatedData,
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
    if (endpoint === 'songs' && req.method === 'GET') {
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

    // Referrals endpoints
    if (endpoint === 'referrals') {
      if (path[3] === 'validate' && req.method === 'GET') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        const code = path[4];
        const { data: referrer, error } = await supabase
          .from('creators')
          .select('id, tiktok_username, referral_code')
          .eq('referral_code', code)
          .single();
        
        if (error || !referrer) {
          return res.status(404).json({ error: "Invalid referral code" });
        }
        
        return res.json({ 
          valid: true, 
          referrer: {
            id: referrer.id,
            tiktok_username: referrer.tiktok_username,
            referral_code: referrer.referral_code
          }
        });
      }

      if (path[3] === 'count' && req.method === 'GET') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        const creatorId = path[4];
        const { count, error } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', creatorId);
        
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: "Failed to get referral count" });
        }
        
        return res.json({ count: count || 0 });
      }
    }

    // Route not found
    return res.status(404).json({ error: "Route not found" });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    console.error('API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}`;

fs.writeFileSync('./vercel-dist/api/index.js', apiContent);

// Create Vercel configuration
console.log('⚙️  Creating Vercel configuration...');
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/public/index.html"
    }
  ]
};

fs.writeFileSync('./vercel-dist/vercel.json', JSON.stringify(vercelConfig, null, 2));

// Create public folder and move static files
console.log('📂 Organizing for Vercel structure...');
fs.mkdirSync('./vercel-dist/public', { recursive: true });
execSync('mv ./vercel-dist/*.html ./vercel-dist/public/', { stdio: 'inherit' });
execSync('mv ./vercel-dist/assets ./vercel-dist/public/', { stdio: 'inherit' });
execSync('mv ./vercel-dist/*.ico ./vercel-dist/public/ 2>/dev/null || true', { stdio: 'inherit' });
execSync('mv ./vercel-dist/*.txt ./vercel-dist/public/ 2>/dev/null || true', { stdio: 'inherit' });
execSync('mv ./vercel-dist/*.svg ./vercel-dist/public/ 2>/dev/null || true', { stdio: 'inherit' });

// Create package.json for dependencies
const packageJson = {
  "name": "tiktok-creator-platform-vercel",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.52.0",
    "@vercel/node": "latest",
    "zod": "^3.24.2"
  }
};

fs.writeFileSync('./vercel-dist/package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Vercel build complete!');
console.log('📁 Deploy folder: ./vercel-dist');
console.log('🚀 Ready for Vercel deployment!');