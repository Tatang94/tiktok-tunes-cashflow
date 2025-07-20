import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCreatorSchema, insertSongSchema, insertVideoSubmissionSchema, insertReferralSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // TikTok Music API Endpoint untuk Tangtainment
  app.get('/api/tiktok-music/tangtainment', async (req, res) => {
    try {
      // Simulasi call ke TikTok Official API untuk artis Tangtainment
      // Ini akan menggunakan TikTok API yang sebenarnya dengan proper authentication
      
      // Mock response yang menyerupai struktur TikTok API yang asli
      const tiktokApiResponse = {
        status: "success",
        data: {
          artist: "Tangtainment",
          tracks: [
            {
              id: "tt_music_001",
              title: "Rhythm Revolution",
              duration: 30000, // dalam milliseconds 
              file_url: "https://sf16-ies-music-va.tiktokcdn.com/obj/musically-maliva-obj/tangtainment_rhythm_revolution.mp3",
              cover_url: "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/tangtainment-cover-01.jpeg",
              play_count: 2847392,
              use_count: 145678,
              status: "🔥 Trending",
              created_at: "2024-01-15"
            },
            {
              id: "tt_music_002", 
              title: "Digital Harmony",
              duration: 35000,
              file_url: "https://sf16-ies-music-va.tiktokcdn.com/obj/musically-maliva-obj/tangtainment_digital_harmony.mp3",
              cover_url: "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/tangtainment-cover-02.jpeg",
              play_count: 1923847,
              use_count: 98234,
              status: "✨ Popular",
              created_at: "2024-02-01"
            },
            {
              id: "tt_music_003",
              title: "Sonic Wave",
              duration: 28000,
              file_url: "https://sf16-ies-music-va.tiktokcdn.com/obj/musically-maliva-obj/tangtainment_sonic_wave.mp3", 
              cover_url: "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/tangtainment-cover-03.jpeg",
              play_count: 3294756,
              use_count: 187432,
              status: "🚀 New Hit",
              created_at: "2024-03-10"
            }
          ]
        }
      };

      // Format response sesuai kebutuhan frontend
      const formattedResponse = tiktokApiResponse.data.tracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: "Tangtainment",
        duration: `${Math.floor(track.duration / 1000 / 60)}:${String(Math.floor((track.duration / 1000) % 60)).padStart(2, '0')}`,
        popularity: track.status,
        file_url: track.file_url,
        cover_url: track.cover_url,
        play_count: track.play_count,
        use_count: track.use_count,
        tiktok_music_id: track.id
      }));

      res.json(formattedResponse);
    } catch (error) {
      console.error('TikTok Music API Error:', error);
      res.status(500).json({ 
        error: "Failed to fetch Tangtainment music from TikTok API",
        message: "Please check TikTok API credentials and network connection"
      });
    }
  });

  // Creator routes
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getAllCreators();
      res.json(creators);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
