import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Music, Download, ExternalLink, TrendingUp } from "lucide-react";

const SongListSection = () => {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const getColorClass = (index: number) => {
    const colors = [
      "from-tiktok-pink to-red-400",
      "from-tiktok-purple to-blue-400", 
      "from-tiktok-blue to-green-400"
    ];
    return colors[index % colors.length];
  };

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
            <Card key={song.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className={`h-2 bg-gradient-to-r ${getColorClass(index)}`}></div>
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
                    <span className="font-semibold text-tiktok-pink">Rp {song.earnings_per_video?.toLocaleString('id-ID') || 100}/video</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {song.file_url ? (
                    <Button className="w-full" variant="tiktok" asChild>
                      <a href={song.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download Lagu
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="tiktok" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Download Lagu
                    </Button>
                  )}
                  {song.spotify_url ? (
                    <Button className="w-full" variant="outline" asChild>
                      <a href={song.spotify_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Link Spotify
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Link Spotify
                    </Button>
                  )}
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