import express, { type Request, Response, NextFunction } from "express";
import path from "path";
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

// Mock storage for deployment (since we can't access server files)
const mockStorage = {
  getAllCreators: async () => [],
  createCreator: async (data: any) => ({ id: 1, ...data, referral_code: `REF${Date.now()}` }),
  getActiveSongs: async () => [
    { id: 1, title: "Trending Beat #1", artist: "Artist A", earnings_per_video: 150, status: "available" },
    { id: 2, title: "Viral Sound #2", artist: "Artist B", earnings_per_video: 200, status: "available" },
    { id: 3, title: "Popular Track #3", artist: "Artist C", earnings_per_video: 100, status: "available" }
  ],
  getReferralByCode: async (code: string) => {
    if (code === 'TEST123') {
      return { id: 1, tiktok_username: '@testuser', referral_code: 'TEST123' };
    }
    return null;
  },
  getReferralCount: async (creatorId: number) => 5
};

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
    const creators = await mockStorage.getAllCreators();
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

app.post("/api/creators", async (req, res) => {
  try {
    const validatedData = insertCreatorSchema.parse(req.body);
    const creator = await mockStorage.createCreator(validatedData);
    res.status(201).json(creator);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create creator" });
  }
});

app.get("/api/songs", async (req, res) => {
  try {
    const songs = await mockStorage.getActiveSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

app.get("/api/referrals/validate/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const referrer = await mockStorage.getReferralByCode(code);
    if (!referrer) {
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
    res.status(500).json({ error: "Failed to validate referral code" });
  }
});

app.get("/api/referrals/count/:creatorId", async (req, res) => {
  try {
    const creatorId = parseInt(req.params.creatorId);
    const count = await mockStorage.getReferralCount(creatorId);
    res.json({ count });
  } catch (error) {
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