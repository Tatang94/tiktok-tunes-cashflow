import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  tiktok_username: text("tiktok_username").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  ewallet_type: text("ewallet_type").notNull(),
  ewallet_number: text("ewallet_number").notNull(),
  total_earnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0"),
  video_count: integer("video_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  status: text("status").notNull(),
  earnings_per_video: numeric("earnings_per_video", { precision: 10, scale: 2 }).default("100"),
  duration: text("duration").notNull(),
  file_url: text("file_url"),
  spotify_url: text("spotify_url"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const video_submissions = pgTable("video_submissions", {
  id: serial("id").primaryKey(),
  creator_id: integer("creator_id").references(() => creators.id),
  song_id: integer("song_id").references(() => songs.id),
  tiktok_url: text("tiktok_url").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  earnings: numeric("earnings", { precision: 10, scale: 2 }).default("0"),
  admin_notes: text("admin_notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
  created_at: true,
});

export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
  created_at: true,
});

export const insertVideoSubmissionSchema = createInsertSchema(video_submissions).omit({
  id: true,
  created_at: true,
});

// Types
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;

export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;

export type InsertVideoSubmission = z.infer<typeof insertVideoSubmissionSchema>;
export type VideoSubmission = typeof video_submissions.$inferSelect;
