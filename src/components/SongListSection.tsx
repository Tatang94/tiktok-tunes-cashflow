import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Download, ExternalLink, TrendingUp } from "lucide-react";

const SongListSection = () => {
  const songs = [
    {
      title: "DJ TikTok Viral",
      artist: "BeatMaster",
      status: "🔥 Trending",
      earnings: "Rp 100/video",
      duration: "0:30",
      color: "from-tiktok-pink to-red-400"
    },
    {
      title: "Chill Vibes Only", 
      artist: "LofiKing",
      status: "✨ Popular",
      earnings: "Rp 100/video",
      duration: "0:25",
      color: "from-tiktok-purple to-blue-400"
    },
    {
      title: "Beat Drop 2025",
      artist: "EDMPro",
      status: "🚀 New Hit",
      earnings: "Rp 100/video", 
      duration: "0:20",
      color: "from-tiktok-blue to-green-400"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎵 Daftar Lagu Aktif
          </h2>
          <p className="text-xl text-muted-foreground">
            Pilih lagu yang lagi trending dan mulai earning!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {songs.map((song, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className={`h-2 bg-gradient-to-r ${song.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{song.title}</h3>
                    <p className="text-muted-foreground">{song.artist}</p>
                  </div>
                  <Music className="w-6 h-6 text-tiktok-pink" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <Badge variant="secondary" className="w-full justify-center">
                    {song.status}
                  </Badge>
                  <div className="flex justify-between text-sm">
                    <span>Durasi: {song.duration}</span>
                    <span className="font-semibold text-tiktok-pink">{song.earnings}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" variant="tiktok">
                    <Download className="w-4 h-4 mr-2" />
                    Download Lagu
                  </Button>
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Copy Link Spotify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-tiktok-pink" />
            <span className="text-sm">Update lagu baru setiap minggu!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SongListSection;