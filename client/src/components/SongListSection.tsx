import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Music, Download, ExternalLink, TrendingUp } from "lucide-react";

// No sample songs - will be populated by admin
const sampleSongs: any[] = [];

const SongListSection = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = (song: any) => {
    if (song.file_url) {
      window.open(song.file_url, '_blank');
    } else {
      toast({
        title: "File tidak tersedia",
        description: "File lagu ini sedang dalam proses upload.",
        variant: "destructive"
      });
    }
  };

  const handleSpotifyLink = (song: any) => {
    if (song.spotify_url) {
      window.open(song.spotify_url, '_blank');
    } else {
      toast({
        title: "Link Spotify tidak tersedia",
        description: "Link Spotify untuk lagu ini belum tersedia.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching songs:', error);
        // No fallback sample data - start clean
        setSongs([]);
      } else {
        setSongs(data || []);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🎵 Daftar Lagu Aktif
            </h2>
            <p className="text-xl text-muted-foreground">
              Loading songs...
            </p>
          </div>
        </div>
      </section>
    );
  }

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
                    <span className="font-semibold text-tiktok-pink">Rp 0,00002489/view</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="tiktok"
                    onClick={() => handleDownload(song)}
                    disabled={!song.file_url}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Lagu
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleSpotifyLink(song)}
                    disabled={!song.spotify_url}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Link Spotify
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
          <Button 
            size="lg" 
            variant="tiktok" 
            className="mt-4"
            onClick={() => scrollToSection('registration-section')}
          >
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SongListSection;