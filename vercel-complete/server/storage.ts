import { 
  creators, 
  songs, 
  video_submissions,
  referrals,
  type Creator, 
  type Song, 
  type VideoSubmission,
  type Referral,
  type InsertCreator, 
  type InsertSong, 
  type InsertVideoSubmission,
  type InsertReferral
} from "@shared/schema";

export interface IStorage {
  // Creator methods
  getCreator(id: number): Promise<Creator | undefined>;
  getCreatorByTiktokUsername(username: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  updateCreator(id: number, updates: Partial<InsertCreator>): Promise<Creator | undefined>;
  getAllCreators(): Promise<Creator[]>;

  // Song methods
  getSong(id: number): Promise<Song | undefined>;
  getAllSongs(): Promise<Song[]>;
  getActiveSongs(): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: number, updates: Partial<InsertSong>): Promise<Song | undefined>;

  // Video submission methods
  getVideoSubmission(id: number): Promise<VideoSubmission | undefined>;
  getVideoSubmissionsByCreator(creatorId: number): Promise<VideoSubmission[]>;
  getAllVideoSubmissions(): Promise<VideoSubmission[]>;
  createVideoSubmission(submission: InsertVideoSubmission): Promise<VideoSubmission>;
  updateVideoSubmission(id: number, updates: Partial<InsertVideoSubmission>): Promise<VideoSubmission | undefined>;

  // Referral methods
  getReferral(id: number): Promise<Referral | undefined>;
  getReferralsByReferrer(referrerId: number): Promise<Referral[]>;
  getReferralByCode(code: string): Promise<Creator | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  getReferralCount(referrerId: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private creators: Map<number, Creator>;
  private songs: Map<number, Song>;
  private videoSubmissions: Map<number, VideoSubmission>;
  private referrals: Map<number, Referral>;
  private currentCreatorId: number;
  private currentSongId: number;
  private currentSubmissionId: number;
  private currentReferralId: number;

  constructor() {
    this.creators = new Map();
    this.songs = new Map();
    this.videoSubmissions = new Map();
    this.referrals = new Map();
    this.currentCreatorId = 1;
    this.currentSongId = 1;
    this.currentSubmissionId = 1;
    this.currentReferralId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
    
    console.log('MemStorage initialized with', this.creators.size, 'creators');
  }

  private initializeSampleData() {
    // Add sample creators untuk testing admin panel
    const sampleCreators = [
      {
        id: 1,
        tiktok_username: "creator_indo1",
        email: "creator1@example.com",
        phone: "+62812345678",
        ewallet_type: "GoPay",
        ewallet_number: "081234567890",
        total_earnings: "150000",
        video_count: 12,
        referral_code: "REF001",
        referred_by: null,
        referral_earnings: "0",
        created_at: new Date('2024-01-15')
      },
      {
        id: 2,
        tiktok_username: "tiktoker_pro",
        email: "tiktoker.pro@gmail.com", 
        phone: "+62887654321",
        ewallet_type: "OVO",
        ewallet_number: "087654321098",
        total_earnings: "250000",
        video_count: 18,
        referral_code: "REF002",
        referred_by: null,
        referral_earnings: "0",
        created_at: new Date('2024-02-10')
      },
      {
        id: 3,
        tiktok_username: "content_maker",
        email: "contentmaker.id@yahoo.com",
        phone: "+62856789123",
        ewallet_type: "DANA",
        ewallet_number: "085678912345",
        total_earnings: "75000",
        video_count: 5,
        referral_code: "REF003", 
        referred_by: null,
        referral_earnings: "0",
        created_at: new Date('2024-03-05')
      }
    ];

    sampleCreators.forEach(creator => {
      this.creators.set(creator.id, creator as Creator);
      if (creator.id >= this.currentCreatorId) {
        this.currentCreatorId = creator.id + 1;
      }
    });
    
    console.log('Added', sampleCreators.length, 'sample creators to storage');

    // Add sample songs untuk testing
    const sampleSongs = [
      {
        id: 1,
        title: "To the Bone",
        artist: "Pamungkas",
        status: "🔥 Trending",
        earnings_per_video: "100",
        duration: "4:02",
        file_url: "https://music.youtube.com/watch?v=IR7tYHdYN2Q",
        spotify_url: "https://music.youtube.com/watch?v=IR7tYHdYN2Q",
        is_active: true,
        created_at: new Date()
      },
      {
        id: 2, 
        title: "Somebody's Pleasure",
        artist: "Aziz Hedra",
        status: "✨ Popular",
        earnings_per_video: "125",
        duration: "3:45",
        file_url: "https://music.youtube.com/watch?v=FfyvKLn4SGw",
        spotify_url: "https://music.youtube.com/watch?v=FfyvKLn4SGw", 
        is_active: true,
        created_at: new Date()
      }
    ];

    sampleSongs.forEach(song => {
      this.songs.set(song.id, song as Song);
      if (song.id >= this.currentSongId) {
        this.currentSongId = song.id + 1;
      }
    });
  }

  // Creator methods
  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async getCreatorByTiktokUsername(username: string): Promise<Creator | undefined> {
    return Array.from(this.creators.values()).find(
      (creator) => creator.tiktok_username === username,
    );
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const id = this.currentCreatorId++;
    const referralCode = `${insertCreator.tiktok_username?.replace('@', '').toUpperCase()}-REF-${id}`;
    
    const creator: Creator = { 
      ...insertCreator, 
      id, 
      total_earnings: "0",
      video_count: 0,
      referral_code: referralCode,
      referral_earnings: "0",
      created_at: new Date() 
    };
    this.creators.set(id, creator);
    
    // If there's a referrer, create a referral record
    if (insertCreator.referred_by) {
      const referrer = await this.getCreator(insertCreator.referred_by);
      if (referrer) {
        await this.createReferral({
          referrer_id: insertCreator.referred_by,
          referred_id: id,
          referral_code: referrer.referral_code || '',
          bonus_amount: "500",
          status: "pending"
        });
      }
    }
    
    return creator;
  }

  async updateCreator(id: number, updates: Partial<InsertCreator>): Promise<Creator | undefined> {
    const creator = this.creators.get(id);
    if (!creator) return undefined;
    
    const updatedCreator = { ...creator, ...updates };
    this.creators.set(id, updatedCreator);
    return updatedCreator;
  }

  async getAllCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }

  // Song methods
  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async getActiveSongs(): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(song => song.is_active);
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = this.currentSongId++;
    const song: Song = { 
      ...insertSong, 
      id, 
      created_at: new Date() 
    };
    this.songs.set(id, song);
    return song;
  }

  async updateSong(id: number, updates: Partial<InsertSong>): Promise<Song | undefined> {
    const song = this.songs.get(id);
    if (!song) return undefined;
    
    const updatedSong = { ...song, ...updates };
    this.songs.set(id, updatedSong);
    return updatedSong;
  }

  // Video submission methods
  async getVideoSubmission(id: number): Promise<VideoSubmission | undefined> {
    return this.videoSubmissions.get(id);
  }

  async getVideoSubmissionsByCreator(creatorId: number): Promise<VideoSubmission[]> {
    return Array.from(this.videoSubmissions.values()).filter(
      (submission) => submission.creator_id === creatorId
    );
  }

  async getAllVideoSubmissions(): Promise<VideoSubmission[]> {
    return Array.from(this.videoSubmissions.values());
  }

  async createVideoSubmission(insertSubmission: InsertVideoSubmission): Promise<VideoSubmission> {
    const id = this.currentSubmissionId++;
    const submission: VideoSubmission = { 
      ...insertSubmission, 
      id, 
      status: "pending",
      earnings: "0",
      created_at: new Date() 
    };
    this.videoSubmissions.set(id, submission);
    return submission;
  }

  async updateVideoSubmission(id: number, updates: Partial<InsertVideoSubmission>): Promise<VideoSubmission | undefined> {
    const submission = this.videoSubmissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, ...updates };
    this.videoSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  // Referral methods
  async getReferral(id: number): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      (referral) => referral.referrer_id === referrerId
    );
  }

  async getReferralByCode(code: string): Promise<Creator | undefined> {
    return Array.from(this.creators.values()).find(
      (creator) => creator.referral_code === code
    );
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = {
      ...insertReferral,
      id,
      created_at: new Date()
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async getReferralCount(referrerId: number): Promise<number> {
    return Array.from(this.referrals.values()).filter(
      (referral) => referral.referrer_id === referrerId
    ).length;
  }
}

console.log('Creating MemStorage instance...');
export const storage = new MemStorage();
console.log('MemStorage instance created');
