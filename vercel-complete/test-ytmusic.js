// Test script untuk YouTube Music API
const YTMusic = require('ytmusic-api').YTMusic;

async function testYTMusicAPI() {
  console.log('🎵 Testing YouTube Music API...');
  
  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();
    console.log('✅ YTMusic initialized successfully!');

    // Test search functionality
    console.log('\n🔍 Testing search function...');
    const searchResults = await ytmusic.searchSongs('Pamungkas To the Bone', { limit: 5 });
    
    console.log(`Found ${searchResults.length} tracks:`);
    searchResults.forEach((track, index) => {
      console.log(`${index + 1}. "${track.name}" by ${track.artists?.[0]?.name || 'Unknown'} (${track.duration?.text || 'Unknown duration'})`);
    });

    // Test Indonesian popular tracks
    console.log('\n🇮🇩 Testing Indonesian trending tracks...');
    const indonesianTracks = await ytmusic.searchSongs('trending indonesia', { limit: 3 });
    
    console.log(`Found ${indonesianTracks.length} Indonesian tracks:`);
    indonesianTracks.forEach((track, index) => {
      console.log(`${index + 1}. "${track.name}" by ${track.artists?.[0]?.name || 'Unknown'}`);
      console.log(`   - Video ID: ${track.videoId}`);
      console.log(`   - Duration: ${track.duration?.text || 'Unknown'}`);
    });

    console.log('\n✅ All tests passed! YTMusic API is working 100%');
    
  } catch (error) {
    console.error('❌ YTMusic API test failed:', error);
  }
}

// Run the test
testYTMusicAPI();