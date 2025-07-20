import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCreatorSchema, insertSongSchema, insertVideoSubmissionSchema, insertReferralSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Creator routes
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getAllCreators();
      res.json(creators);
    } catch (error) {
      console.error('Error fetching creators:', error);
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });

  app.get("/api/creators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const creator = await storage.getCreator(id);
      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creator" });
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

  app.put("/api/creators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCreatorSchema.partial().parse(req.body);
      const creator = await storage.updateCreator(id, validatedData);
      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update creator" });
    }
  });

  // Song routes
  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getAllSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch songs" });
    }
  });

  app.get("/api/songs/active", async (req, res) => {
    try {
      const songs = await storage.getActiveSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active songs" });
    }
  });

  app.post("/api/songs", async (req, res) => {
    try {
      const validatedData = insertSongSchema.parse(req.body);
      const song = await storage.createSong(validatedData);
      res.status(201).json(song);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create song" });
    }
  });

  app.put("/api/songs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSongSchema.partial().parse(req.body);
      const song = await storage.updateSong(id, validatedData);
      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update song" });
    }
  });

  // Video submission routes
  app.get("/api/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllVideoSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/creator/:creatorId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const submissions = await storage.getVideoSubmissionsByCreator(creatorId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creator submissions" });
    }
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertVideoSubmissionSchema.parse(req.body);
      const submission = await storage.createVideoSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  app.put("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVideoSubmissionSchema.partial().parse(req.body);
      const submission = await storage.updateVideoSubmission(id, validatedData);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update submission" });
    }
  });

  // Referral routes
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

  app.get("/api/referrals/creator/:creatorId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const referrals = await storage.getReferralsByReferrer(creatorId);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // YouTube Music API routes
  app.get("/api/ytmusic/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query) {
        return res.status(400).json({ error: 'Query parameter q is required' });
      }

      // Use ytmusic-service here - for now return simulated data
      const tracks = [
        {
          id: "IR7tYHdYN2Q",
          videoId: "IR7tYHdYN2Q",
          title: "To the Bone",
          artist: "Pamungkas",
          duration: "4:02",
          streamUrl: `https://music.youtube.com/watch?v=IR7tYHdYN2Q`,
          thumbnail: `https://img.youtube.com/vi/IR7tYHdYN2Q/maxresdefault.jpg`,
          playCount: 5420193,
          useCount: 12847
        }
      ];

      res.json({ tracks, total: tracks.length });
    } catch (error) {
      console.error('YouTube Music search error:', error);
      res.status(500).json({ 
        error: 'YouTube Music API error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
