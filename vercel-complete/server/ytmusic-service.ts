import YTMusic from 'ytmusic-api';

export interface YTMusicTrack {
  videoId: string;
  title: string;
  artists: Array<{
    name: string;
    browseId: string;
  }>;
  album?: {
    name: string;
    browseId: string;
  };
  duration: {
    seconds_total: number;
    text: string;
  };
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  isExplicit: boolean;
  category: string;
}

export interface YTMusicSearchResult {
  tracks: YTMusicTrack[];
  artists: any[];
  albums: any[];
  playlists: any[];
}

class YTMusicService {
  private ytmusic: YTMusic | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.ytmusic = new YTMusic();
      await this.ytmusic.initialize();
      this.initialized = true;
      console.log('✅ YTMusic API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize YTMusic API:', error);
      throw error;
    }
  }

  async searchTracks(query: string, limit: number = 20): Promise<YTMusicTrack[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.ytmusic) {
      throw new Error('YTMusic not initialized');
    }

    try {
      const searchResults = await this.ytmusic.searchSongs(query, { limit });
      
      return searchResults.map(track => ({
        videoId: track.videoId,
        title: track.name,
        artists: track.artists || [],
        album: track.album,
        duration: track.duration || { seconds_total: 0, text: '0:00' },
        thumbnails: track.thumbnails || [],
        isExplicit: track.isExplicit || false,
        category: 'song'
      }));
    } catch (error) {
      console.error('❌ YouTube Music search error:', error);
      throw new Error(`Failed to search YouTube Music: ${error}`);
    }
  }

  async getTrackDetails(videoId: string): Promise<YTMusicTrack | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.ytmusic) {
      throw new Error('YTMusic not initialized');
    }

    try {
      const track = await this.ytmusic.getSong(videoId);
      
      if (!track) return null;

      return {
        videoId: track.videoId,
        title: track.name,
        artists: track.artists || [],
        album: track.album,
        duration: track.duration || { seconds_total: 0, text: '0:00' },
        thumbnails: track.thumbnails || [],
        isExplicit: track.isExplicit || false,
        category: 'song'
      };
    } catch (error) {
      console.error('❌ YouTube Music track details error:', error);
      return null;
    }
  }

  async searchArtistTracks(artistName: string, limit: number = 50): Promise<YTMusicTrack[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.ytmusic) {
      throw new Error('YTMusic not initialized');
    }

    try {
      // Search for artist first
      const artistResults = await this.ytmusic.searchArtists(artistName, { limit: 1 });
      
      if (artistResults.length === 0) {
        console.warn(`No artist found for: ${artistName}`);
        return [];
      }

      const artist = artistResults[0];
      
      // Get artist's top songs
      const artistTracks = await this.ytmusic.getArtistSongs(artist.browseId, { limit });
      
      return artistTracks.map(track => ({
        videoId: track.videoId,
        title: track.name,
        artists: [{ name: artistName, browseId: artist.browseId }],
        album: track.album,
        duration: track.duration || { seconds_total: 0, text: '0:00' },
        thumbnails: track.thumbnails || [],
        isExplicit: track.isExplicit || false,
        category: 'song'
      }));
    } catch (error) {
      console.error(`❌ Error fetching tracks for artist ${artistName}:`, error);
      return [];
    }
  }

  async getTrendingTracks(limit: number = 50): Promise<YTMusicTrack[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.ytmusic) {
      throw new Error('YTMusic not initialized');
    }

    try {
      // Get trending/popular tracks
      const trendingResults = await this.ytmusic.searchSongs('trending indonesia', { limit });
      
      return trendingResults.map(track => ({
        videoId: track.videoId,
        title: track.name,
        artists: track.artists || [],
        album: track.album,
        duration: track.duration || { seconds_total: 0, text: '0:00' },
        thumbnails: track.thumbnails || [],
        isExplicit: track.isExplicit || false,
        category: 'song'
      }));
    } catch (error) {
      console.error('❌ Error fetching trending tracks:', error);
      return [];
    }
  }

  getStreamUrl(videoId: string): string {
    return `https://music.youtube.com/watch?v=${videoId}`;
  }

  getThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
}

export const ytmusicService = new YTMusicService();