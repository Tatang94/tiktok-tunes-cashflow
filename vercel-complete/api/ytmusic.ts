import { type VercelRequest, type VercelResponse } from '@vercel/node';
import YTMusic from 'ytmusic-api';

// CORS setup
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize YTMusic
let ytmusic: YTMusic | null = null;
let isInitialized = false;

async function initializeYTMusic() {
  if (isInitialized && ytmusic) return ytmusic;
  
  try {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
    isInitialized = true;
    console.log('✅ YTMusic API initialized for Vercel');
    return ytmusic;
  } catch (error) {
    console.error('❌ Failed to initialize YTMusic API:', error);
    throw error;
  }
}

// Helper function to parse URL paths
function parseUrl(url: string) {
  const urlParts = url.split('?')[0].split('/');
  return {
    path: urlParts,
    action: urlParts[3], // /api/ytmusic/[action]
    param: urlParts[4]   // /api/ytmusic/action/[param]
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, param } = parseUrl(req.url || '');

  try {
    // Initialize YTMusic if not already done
    const yt = await initializeYTMusic();
    if (!yt) {
      return res.status(500).json({ error: 'Failed to initialize YouTube Music API' });
    }

    // Search tracks endpoint
    if (action === 'search' && req.method === 'GET') {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query) {
        return res.status(400).json({ error: 'Query parameter q is required' });
      }

      const searchResults = await yt.searchSongs(query, { limit });
      
      const tracks = searchResults.map(track => ({
        id: track.videoId,
        videoId: track.videoId,
        title: track.name,
        artist: track.artists?.[0]?.name || 'Unknown Artist',
        artists: track.artists || [],
        album: track.album?.name || 'Unknown Album',
        duration: track.duration?.text || '0:00',
        durationSeconds: track.duration?.seconds_total || 0,
        thumbnails: track.thumbnails || [],
        thumbnail: track.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`,
        streamUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
        isExplicit: track.isExplicit || false,
        playCount: Math.floor(Math.random() * 10000000) + 1000000, // Simulated play count
        useCount: Math.floor(Math.random() * 100000) + 10000 // Simulated use count
      }));

      return res.json({ tracks, total: tracks.length });
    }

    // Get artist tracks endpoint
    if (action === 'artist' && req.method === 'GET') {
      const artistName = param;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!artistName) {
        return res.status(400).json({ error: 'Artist name is required' });
      }

      // Search for artist first
      const artistResults = await yt.searchArtists(decodeURIComponent(artistName), { limit: 1 });
      
      if (artistResults.length === 0) {
        return res.json({ tracks: [], total: 0, message: `No artist found: ${artistName}` });
      }

      const artist = artistResults[0];
      
      // Get artist's songs
      const artistTracks = await yt.getArtistSongs(artist.browseId, { limit });
      
      const tracks = artistTracks.map(track => ({
        id: track.videoId,
        videoId: track.videoId,
        title: track.name,
        artist: artistName,
        artists: [{ name: artistName, browseId: artist.browseId }],
        album: track.album?.name || 'Unknown Album',
        duration: track.duration?.text || '0:00',
        durationSeconds: track.duration?.seconds_total || 0,
        thumbnails: track.thumbnails || [],
        thumbnail: track.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`,
        streamUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
        isExplicit: track.isExplicit || false,
        playCount: Math.floor(Math.random() * 10000000) + 1000000,
        useCount: Math.floor(Math.random() * 100000) + 10000
      }));

      return res.json({ 
        tracks, 
        total: tracks.length,
        artist: {
          name: artistName,
          browseId: artist.browseId,
          thumbnails: artist.thumbnails || []
        }
      });
    }

    // Get track details endpoint
    if (action === 'track' && req.method === 'GET') {
      const videoId = param;

      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const track = await yt.getSong(videoId);
      
      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      const trackData = {
        id: track.videoId,
        videoId: track.videoId,
        title: track.name,
        artist: track.artists?.[0]?.name || 'Unknown Artist',
        artists: track.artists || [],
        album: track.album?.name || 'Unknown Album',
        duration: track.duration?.text || '0:00',
        durationSeconds: track.duration?.seconds_total || 0,
        thumbnails: track.thumbnails || [],
        thumbnail: track.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`,
        streamUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
        isExplicit: track.isExplicit || false,
        playCount: Math.floor(Math.random() * 10000000) + 1000000,
        useCount: Math.floor(Math.random() * 100000) + 10000
      };

      return res.json(trackData);
    }

    // Get trending tracks endpoint
    if (action === 'trending' && req.method === 'GET') {
      const limit = parseInt(req.query.limit as string) || 50;
      const country = req.query.country as string || 'indonesia';

      const trendingResults = await yt.searchSongs(`trending ${country}`, { limit });
      
      const tracks = trendingResults.map(track => ({
        id: track.videoId,
        videoId: track.videoId,
        title: track.name,
        artist: track.artists?.[0]?.name || 'Unknown Artist',
        artists: track.artists || [],
        album: track.album?.name || 'Unknown Album',
        duration: track.duration?.text || '0:00',
        durationSeconds: track.duration?.seconds_total || 0,
        thumbnails: track.thumbnails || [],
        thumbnail: track.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${track.videoId}/maxresdefault.jpg`,
        streamUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
        isExplicit: track.isExplicit || false,
        playCount: Math.floor(Math.random() * 10000000) + 1000000,
        useCount: Math.floor(Math.random() * 100000) + 10000
      }));

      return res.json({ tracks, total: tracks.length });
    }

    // Indonesian popular artists endpoint
    if (action === 'indonesian-artists' && req.method === 'GET') {
      const indonesianArtists = [
        'Pamungkas', 'Hindia', 'Stephanie Poetri', 'Mahalini', 
        'Raisa', 'Isyana Sarasvati', 'Tulus', 'Rizky Febian',
        'Ardhito Pramono', 'Rendy Pandugo', 'Brisia Jodie',
        'Marion Jola', 'Lyodra', 'Tiara Andini'
      ];

      const artistsData = [];

      for (const artistName of indonesianArtists.slice(0, 10)) {
        try {
          const artistResults = await yt.searchArtists(artistName, { limit: 1 });
          
          if (artistResults.length > 0) {
            const artist = artistResults[0];
            artistsData.push({
              name: artistName,
              browseId: artist.browseId,
              thumbnails: artist.thumbnails || [],
              verified: true
            });
          }
        } catch (error) {
          console.warn(`Could not fetch data for artist: ${artistName}`);
        }
      }

      return res.json({ artists: artistsData, total: artistsData.length });
    }

    // Route not found
    return res.status(404).json({ error: 'YouTube Music API route not found' });

  } catch (error) {
    console.error('YouTube Music API error:', error);
    return res.status(500).json({ 
      error: 'YouTube Music API error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}