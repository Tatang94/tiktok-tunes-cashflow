import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Video, Music, Upload, ExternalLink, Users, Copy, Share2, User } from "lucide-react";

const CreatorDashboard = () => {
  const [creator, setCreator] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  
  const { toast } = useToast();

  // For demo purposes, we'll use a mock creator ID
  // In a real app, this would come from authentication
  const mockCreatorId = "demo-creator-123";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = await getSupabaseClient();
      
      // Check if we have creator data from localStorage first
      const storedCreator = localStorage.getItem('currentCreator');
      if (storedCreator) {
        const creatorData = JSON.parse(storedCreator);
        setCreator(creatorData);
      } else {
        // Redirect to homepage if no creator data
        window.location.href = '/';
      }

      // Try to fetch real referral count
      if (storedCreator) {
        try {
          const response = await fetch(`/api/referrals/count/${storedCreator.id || 'demo'}`);
          if (response.ok) {
            const data = await response.json();
            setReferralCount(data.count);
          } else {
            // No fallback demo data - start from 0
            setReferralCount(0);
          }
        } catch (error) {
          console.error('Error fetching referral count:', error);
          setReferralCount(0);
        }
      }

      // Try to fetch songs, use sample data if database not ready
      try {
        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (songsError) throw songsError;
        setSongs(songsData || []);
      } catch (songsError: any) {
        console.error('Songs error:', songsError);
        // Use sample songs data when database not ready
        setSongs([
          {
            id: 1,
            title: "Trending Beat #1",
            artist: "DJ TikTok",
            status: "Active",
            earnings_per_video: 150,
            duration: "0:30"
          },
          {
            id: 2,
            title: "Viral Sound #2",
            artist: "Viral Artist",
            status: "Active",
            earnings_per_video: 200,
            duration: "0:45"
          }
        ]);
      }

      // Try to fetch submissions, use empty array if database not ready
      try {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('video_submissions')
          .select(`
            *,
            songs(title, artist)
          `)
          .eq('creator_id', mockCreatorId)
          .order('created_at', { ascending: false });

        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData || []);
      } catch (submissionsError: any) {
        console.error('Submissions error:', submissionsError);
        setSubmissions([]);
      }

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Database belum siap. Silakan setup database terlebih dahulu.');
    } finally {
      setLoading(false);
    }
  };

  const submitVideo = async () => {
    if (!selectedSong || !tiktokUrl) {
      toast({
        title: "Error",
        description: "Pilih lagu dan masukkan URL TikTok",
        variant: "destructive"
      });
      return;
    }

    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('video_submissions')
        .insert([{
          creator_id: mockCreatorId,
          song_id: selectedSong,
          tiktok_url: tiktokUrl,
          status: 'pending',
          earnings: 0
        }]);

      if (error) throw error;

      toast({
        title: "Video berhasil disubmit!",
        description: "Video kamu sedang dalam review. Cek status dalam 24 jam."
      });

      setSelectedSong("");
      setTiktokUrl("");
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal submit video.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-pink mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat dashboard creator...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Database Belum Siap</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Database table belum dibuat. Silakan setup database terlebih dahulu.
            </p>
            <Button 
              onClick={() => window.open('/DATABASE_SETUP_INSTRUCTIONS.md', '_blank')}
              className="w-full"
            >
              Lihat Instruksi Setup Database
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <div className="pt-20 p-4 w-full">
        <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang, @{creator.tiktok_username}!</p>
          </div>
          <Button 
            onClick={() => {
              localStorage.removeItem('currentCreator');
              window.location.href = '/';
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">Rp {(creator.total_earnings || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Video className="w-8 h-8 text-tiktok-pink" />
                <div>
                  <p className="text-sm text-muted-foreground">Videos Approved</p>
                  <p className="text-2xl font-bold">{creator.video_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Music className="w-8 h-8 text-tiktok-purple" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Songs</p>
                  <p className="text-2xl font-bold">{songs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-tiktok-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                  <p className="text-2xl font-bold">{referralCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Program Referral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-tiktok-pink/10 to-tiktok-purple/10 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Kode Referral Kamu</h4>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-3 py-2 rounded border font-mono text-sm flex-1">
                      {creator.tiktok_username?.toUpperCase()}-REF-{creator.id || 'DEMO'}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}`);
                        toast({
                          title: "Copied!",
                          description: "Kode referral berhasil disalin"
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Link Referral</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/?ref=${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}`}
                      className="flex-1 px-3 py-2 border rounded text-sm bg-background"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?ref=${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}`);
                        toast({
                          title: "Copied!",
                          description: "Link referral berhasil disalin"
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const text = `🎵 Join Soundtrack Tok dan dapatkan penghasilan dari video TikTok kamu!\n\nDaftar pakai kode referral: ${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}\n\nLink: ${window.location.origin}/?ref=${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}`;
                      navigator.clipboard.writeText(text);
                      toast({
                        title: "Copied!",
                        description: "Pesan referral berhasil disalin untuk dibagikan"
                      });
                    }}
                  >
                    Copy Pesan
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const text = `🎵 Join Soundtrack Tok dan dapatkan penghasilan dari video TikTok kamu!\n\nDaftar pakai kode referral: ${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}\n\nLink: ${window.location.origin}/?ref=${creator.tiktok_username?.toUpperCase()}-REF-${creator.id || 'DEMO'}`;
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    Share WhatsApp
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Bonus Referral</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Per referral berhasil:</span>
                      <span className="font-semibold text-tiktok-pink">Rp 500</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Total earned:</span>
                      <span className="font-semibold text-green-600">Rp {(referralCount * 500).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Referral Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total referrals:</span>
                      <span className="font-semibold">{referralCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This month:</span>
                      <span className="font-semibold">{Math.floor(referralCount / 2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-tiktok-blue/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Tips:</strong> Share kode referral kamu di bio TikTok, Instagram Story, atau grup WhatsApp untuk mendapat lebih banyak referral!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit New Video */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Submit Video Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="song-select">Pilih Lagu</Label>
                <Select value={selectedSong} onValueChange={setSelectedSong}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lagu yang digunakan" />
                  </SelectTrigger>
                  <SelectContent>
                    {songs.map((song) => (
                      <SelectItem key={song.id} value={song.id}>
                        {song.title} - {song.artist} (Rp 0,00002489/view)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok-url">URL TikTok Video</Label>
                <Input
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/..."
                />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Syarat Submit:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✅ Video menggunakan lagu full min. 10 detik</li>
                  <li>✅ Akun TikTok harus publik</li>
                  <li>✅ Video original (bukan repost)</li>
                  <li>✅ Video tanpa batas per hari</li>
                </ul>
              </div>

              <Button onClick={submitVideo} className="w-full" variant="tiktok">
                Submit Video untuk Review
              </Button>
            </CardContent>
          </Card>

          {/* Available Songs */}
          <Card>
            <CardHeader>
              <CardTitle>Lagu Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {songs.map((song) => (
                  <div key={song.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{song.title}</h4>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                      </div>
                      <Badge variant="secondary">{song.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p>Durasi: {song.duration}</p>
                        <p className="font-semibold text-tiktok-pink">
                          Rp 0,00002489/view
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {song.file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={song.file_url} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        )}
                        {song.spotify_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={song.spotify_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Riwayat Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lagu</TableHead>
                  <TableHead>TikTok URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Tanggal Submit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.songs?.title}</div>
                        <div className="text-sm text-muted-foreground">{submission.songs?.artist}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={submission.tiktok_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-tiktok-blue hover:underline"
                      >
                        View Video
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        submission.status === 'approved' ? 'default' : 
                        submission.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {submission.status === 'approved' 
                        ? `Rp ${submission.earnings.toLocaleString('id-ID')}` 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(submission.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;