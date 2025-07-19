import express, { type Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertCreatorSchema, insertSongSchema, insertVideoSubmissionSchema, insertReferralSchema } from "./schema";
import { z } from "zod";
import { createServer, type Server } from "http";
import path from "path";

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

// Register API routes
app.get("/api/creators", async (req, res) => {
  try {
    const creators = await storage.getAllCreators();
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

app.post("/api/creators", async (req, res) => {
  try {
    const validatedData = insertCreatorSchema.parse(req.body);
    const creator = await storage.createCreator(validatedData);
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
    const songs = await storage.getActiveSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

app.get("/api/referrals/validate/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const referrer = await storage.getReferralByCode(code);
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
    const count = await storage.getReferralCount(creatorId);
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