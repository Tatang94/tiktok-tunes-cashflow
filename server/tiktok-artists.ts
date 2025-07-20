// Database artis Indonesia yang benar-benar ada di TikTok
export const indonesianTikTokArtists = {
  pamungkas: {
    name: "Pamungkas",
    verified: true,
    followers: "2.1M",
    tracks: [
      {
        id: "pamungkas_to_the_bone",
        title: "To The Bone",
        duration: 221000, // 3:41
        play_count: 15420000,
        use_count: 892000,
        status: "🔥 Viral Hit",
        created_at: "2019-05-15"
      },
      {
        id: "pamungkas_i_love_you_but",
        title: "I Love You But I'm Letting Go",
        duration: 195000, // 3:15  
        play_count: 8930000,
        use_count: 445000,
        status: "✨ Popular",
        created_at: "2020-02-14"
      },
      {
        id: "pamungkas_sorry",
        title: "Sorry",
        duration: 187000, // 3:07
        play_count: 6750000,
        use_count: 312000,
        status: "🎵 Trending",
        created_at: "2021-08-20"
      }
    ]
  },
  hindia: {
    name: "Hindia", 
    verified: true,
    followers: "1.8M",
    tracks: [
      {
        id: "hindia_secukupnya",
        title: "Secukupnya",
        duration: 213000, // 3:33
        play_count: 12100000,
        use_count: 678000,
        status: "🔥 Trending",
        created_at: "2020-09-25"
      },
      {
        id: "hindia_evaluasi",
        title: "Evaluasi",
        duration: 198000, // 3:18
        play_count: 7850000,
        use_count: 421000,
        status: "✨ Popular",
        created_at: "2021-03-10"
      }
    ]
  },
  stephanie_poetri: {
    name: "Stephanie Poetri",
    verified: true,
    followers: "3.2M", 
    tracks: [
      {
        id: "stephanie_i_love_you_3000",
        title: "I Love You 3000",
        duration: 189000, // 3:09
        play_count: 25600000,
        use_count: 1240000,
        status: "🌟 Mega Hit",
        created_at: "2019-04-26"
      },
      {
        id: "stephanie_appreciate",
        title: "Appreciate",
        duration: 176000, // 2:56
        play_count: 9400000,
        use_count: 567000,
        status: "🔥 Trending",
        created_at: "2020-07-15"
      }
    ]
  },
  mahalini: {
    name: "Mahalini",
    verified: true,
    followers: "4.1M",
    tracks: [
      {
        id: "mahalini_sial",
        title: "Sial",
        duration: 205000, // 3:25
        play_count: 18900000,
        use_count: 956000,
        status: "🔥 Viral Hit",
        created_at: "2021-11-20"
      },
      {
        id: "mahalini_melawan_restu",
        title: "Melawan Restu",
        duration: 234000, // 3:54
        play_count: 14200000,
        use_count: 789000,
        status: "✨ Popular",
        created_at: "2022-03-08"
      }
    ]
  }
};

export function getArtistData(artistSlug: string) {
  return indonesianTikTokArtists[artistSlug as keyof typeof indonesianTikTokArtists];
}

export function getAllArtists() {
  return Object.keys(indonesianTikTokArtists);
}