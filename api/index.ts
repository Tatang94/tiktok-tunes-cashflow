import express, { type Request, Response, NextFunction } from "express";
import { createClient } from '@supabase/supabase-js';
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Expose environment variables to frontend
app.get('/api/config', (req, res) => {
  res.json({
    VITE_SUPABASE_URL: process.env.SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// API routes with validation schemas
const insertCreatorSchema = z.object({
  tiktok_username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  ewallet_type: z.string(),
  ewallet_number: z.string(),
  referral_code: z.string().optional()
});

// Register API routes
app.get("/api/creators", async (req, res) => {
  try {
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
    
    res.json(creators);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

app.post("/api/creators", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not configured" });
    }
    
    const validatedData = insertCreatorSchema.parse(req.body);
    
    // Generate referral code
    const referralCode = `REF${Date.now().toString().slice(-6)}`;
    
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
    
    res.status(201).json(creator);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    console.error('API error:', error);
    res.status(500).json({ error: "Failed to create creator" });
  }
});

app.get("/api/songs", async (req, res) => {
  try {
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
    
    res.json(songs);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

app.get("/api/referrals/validate/:code", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not configured" });
    }
    
    const code = req.params.code;
    const { data: referrer, error } = await supabase
      .from('creators')
      .select('id, tiktok_username, referral_code')
      .eq('referral_code', code)
      .single();
    
    if (error || !referrer) {
      return res.status(404).json({ error: "Invalid referral code" });
    }
    
    res.json({ 
      valid: true, 
      referrer: {
        id: referrer.id,
        tiktok_username: referrer.tiktok_username,
        referral_code: referrer.referral_code
      }
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: "Failed to validate referral code" });
  }
});

app.get("/api/referrals/count/:creatorId", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not configured" });
    }
    
    const creatorId = req.params.creatorId;
    const { count, error } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', creatorId);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: "Failed to get referral count" });
    }
    
    res.json({ count: count || 0 });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: "Failed to get referral count" });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

export default app;