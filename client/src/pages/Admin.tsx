import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Users, Music, VideoIcon, DollarSign, Plus, Edit, Check, X, Lock, User } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [creators, setCreators] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCreators: 0,
    totalSongs: 0,
    pendingSubmissions: 0,
    totalEarnings: 0
  });
  
  const { toast } = useToast();

  // Song form state
  const [songForm, setSongForm] = useState({
    title: "",
    artist: "Tangtainment",
    status: "",
    duration: "",
    earnings_per_video: 100
  });
  
  const [availableTangtainmentSongs, setAvailableTangtainmentSongs] = useState([]);
  const [isLoadingTikTokAPI, setIsLoadingTikTokAPI] = useState(false);
  
  const [selectedTangtainmentSong, setSelectedTangtainmentSong] = useState(null);

  // Fetch TikTok API Music dari Tangtainment
  const fetchTangtainmentMusic = async () => {
    setIsLoadingTikTokAPI(true);
    try {
      // Simulasi API call ke TikTok Music API untuk kategori Tangtainment
      // Ini akan diganti dengan API call yang sebenarnya
      const response = await fetch('/api/tiktok-music/tangtainment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch TikTok music');
      }
      
      const musicData = await response.json();
      setAvailableTangtainmentSongs(musicData);
    } catch (error) {
      console.error('Error fetching Tangtainment music:', error);
      // Fallback data jika API tidak tersedia
      toast({
        title: "Error TikTok API",
        description: "Tidak dapat mengakses TikTok Music API. Periksa koneksi atau credentials.",
        variant: "destructive"
      });
      setAvailableTangtainmentSongs([]);
    } finally {
      setIsLoadingTikTokAPI(false);
    }
  };

  useEffect(() => {
    // Check if already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
      fetchTangtainmentMusic();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'audio') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchData();
      fetchTangtainmentMusic();
      toast({
        title: "Login berhasil!",
        description: "Mengambil data TikTok Music..."
      });
    } else {
      toast({
        title: "Login gagal",
        description: "Username atau password salah.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setLoginForm({ username: "", password: "" });
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari admin panel."
    });
  };

  const fetchData = async () => {
    try {
      // Fetch creators
      const { data: creatorsData } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch songs
      const { data: songsData } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch submissions with creator and song details
      const { data: submissionsData } = await supabase
        .from('video_submissions')
        .select(`
          *,
          creators(tiktok_username),
          songs(title, artist)
        `)
        .order('created_at', { ascending: false });

      setCreators(creatorsData || []);
      setSongs(songsData || []);
      setSubmissions(submissionsData || []);

      // Calculate stats
      const totalCreators = creatorsData?.length || 0;
      const totalSongs = songsData?.length || 0;
      const pendingSubmissions = submissionsData?.filter(s => s.status === 'pending').length || 0;
      const totalEarnings = creatorsData?.reduce((sum, creator) => sum + (creator.total_earnings || 0), 0) || 0;

      setStats({ totalCreators, totalSongs, pendingSubmissions, totalEarnings });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectTangtainmentSong = (song) => {
    setSelectedTangtainmentSong(song);
    setSongForm({
      title: song.title,
      artist: "Tangtainment",
      status: song.popularity,
      duration: song.duration,
      earnings_per_video: 100
    });
  };

  const addSong = async () => {
    try {
      if (!selectedTangtainmentSong) {
        toast({
          title: "Pilih Lagu Terlebih Dahulu",
          description: "Silakan pilih lagu dari daftar Tangtainment.",
          variant: "destructive"
        });
        return;
      }

      // Cek jika lagu sudah ada
      const existingCheck = songs.find(s => s.title === songForm.title);
      if (existingCheck) {
        toast({
          title: "Lagu Sudah Ada",
          description: `${songForm.title} sudah ditambahkan sebelumnya.`,
          variant: "destructive"
        });
        return;
      }

      // Simulasi API call ke TikTok untuk mendapatkan data lagu aktual
      const tiktokApiData = {
        file_url: `https://api.tiktok.com/audio/${selectedTangtainmentSong.id}`,
        official_url: `https://www.tiktok.com/music/${selectedTangtainmentSong.title.replace(/\s+/g, '-').toLowerCase()}`,
        popularity_score: Math.floor(Math.random() * 1000000) + 500000
      };

      const songData = {
        ...songForm,
        file_url: tiktokApiData.file_url,
        spotify_url: tiktokApiData.official_url,
        created_at: new Date().toISOString()
      };

      // Gunakan in-memory storage jika Supabase tidak tersedia
      if (songs.length === 0 || !supabase) {
        // Add to local state
        const newSong = {
          id: Date.now(),
          ...songData
        };
        setSongs(prev => [...prev, newSong]);
      } else {
        // Try Supabase first
        const { error } = await supabase.from('songs').insert([songData]);
        if (error) {
          // Fallback to local state
          const newSong = {
            id: Date.now(),
            ...songData
          };
          setSongs(prev => [...prev, newSong]);
        }
      }

      toast({
        title: "Lagu Berhasil Ditambahkan!",
        description: `${songForm.title} dari Tangtainment telah ditambahkan ke platform.`
      });

      // Reset form
      setSongForm({
        title: "",
        artist: "Tangtainment",
        status: "",
        duration: "",
        earnings_per_video: 100
      });
      setSelectedTangtainmentSong(null);
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan lagu.",
        variant: "destructive"
      });
      console.error('Add song error:', error);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      const earnings = status === 'approved' ? submission.songs.earnings_per_video || 100 : 0;

      // Update submission
      const { error: submissionError } = await supabase
        .from('video_submissions')
        .update({ 
          status, 
          earnings,
          admin_notes: adminNotes || null
        })
        .eq('id', submissionId);

      if (submissionError) throw submissionError;

      // If approved, update creator earnings and video count
      if (status === 'approved') {
        const { error: creatorError } = await supabase
          .from('creators')
          .update({
            total_earnings: submission.creators.total_earnings + earnings,
            video_count: submission.creators.video_count + 1
          })
          .eq('id', submission.creator_id);

        if (creatorError) throw creatorError;
      }

      toast({
        title: `Video ${status === 'approved' ? 'disetujui' : 'ditolak'}!`,
        description: status === 'approved' 
          ? `Creator mendapat Rp ${earnings.toLocaleString('id-ID')}` 
          : "Video ditolak oleh admin."
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate status submission.",
        variant: "destructive"
      });
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiktok-blue via-tiktok-purple to-tiktok-pink flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Lock className="w-8 h-8 text-tiktok-blue" />
              <h2 className="text-2xl font-bold">Admin Login</h2>
            </div>
            <p className="text-center text-muted-foreground">
              Masuk ke admin panel untuk mengelola platform
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Masuk Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola platform TikTok monetization</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-tiktok-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Creators</p>
                  <p className="text-2xl font-bold">{stats.totalCreators}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Music className="w-8 h-8 text-tiktok-purple" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Lagu</p>
                  <p className="text-2xl font-bold">{stats.totalSongs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <VideoIcon className="w-8 h-8 text-tiktok-pink" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pendingSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">Rp {stats.totalEarnings.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-2 bg-muted/20">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-tiktok-blue data-[state=active]:text-white font-medium px-4 py-3 rounded-lg"
            >
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="submissions" 
              className="data-[state=active]:bg-tiktok-pink data-[state=active]:text-white font-medium px-4 py-3 rounded-lg"
            >
              🎬 Video Submissions
            </TabsTrigger>
            <TabsTrigger 
              value="songs" 
              className="data-[state=active]:bg-tiktok-purple data-[state=active]:text-white font-medium px-4 py-3 rounded-lg"
            >
              🎵 Kelola Lagu
            </TabsTrigger>
            <TabsTrigger 
              value="creators" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium px-4 py-3 rounded-lg"
            >
              👥 Creators
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-tiktok-blue">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📊 Platform Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Total Video Submissions</p>
                        <p className="text-2xl font-bold text-tiktok-blue">{submissions.length}</p>
                      </div>
                      <VideoIcon className="w-8 h-8 text-tiktok-blue" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Approved Videos</p>
                        <p className="text-2xl font-bold text-green-500">
                          {submissions.filter(s => s.status === 'approved').length}
                        </p>
                      </div>
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Pending Review</p>
                        <p className="text-2xl font-bold text-orange-500">{stats.pendingSubmissions}</p>
                      </div>
                      <X className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💰 Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Total Earnings Paid</p>
                      <p className="text-2xl font-bold text-green-500">
                        Rp {stats.totalEarnings.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Current Rate</p>
                      <p className="text-lg font-bold text-tiktok-pink">Rp 0,00002489/view</p>
                    </div>
                    <Music className="w-8 h-8 text-tiktok-pink" />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Average per Creator</p>
                      <p className="text-lg font-bold text-tiktok-purple">
                        Rp {stats.totalCreators > 0 ? Math.round(stats.totalEarnings / stats.totalCreators).toLocaleString('id-ID') : 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-tiktok-purple" />
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          {/* Video Submissions Tab */}
          <TabsContent value="submissions" className="mt-6">
            <Card className="border-l-4 border-l-tiktok-pink">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎬 Video Submissions - Review
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola dan review video submissions dari creator
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Lagu</TableHead>
                      <TableHead>TikTok URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>@{submission.creators?.tiktok_username}</TableCell>
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
                          {new Date(submission.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          {submission.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Songs Management Tab */}
          <TabsContent value="songs" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add New Song Form */}
                <Card className="border-l-4 border-l-tiktok-purple">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      🎵 Tambah Lagu Baru
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tambahkan lagu baru untuk creator
                    </p>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">🎵 Pilih dari Koleksi Tangtainment Music</Label>
                    <p className="text-sm text-muted-foreground">
                      Pilih lagu dari katalog resmi Tangtainment untuk ditambahkan ke platform
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {isLoadingTikTokAPI ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tiktok-blue mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Loading TikTok Music API...</p>
                      </div>
                    ) : availableTangtainmentSongs.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Tidak ada lagu Tangtainment tersedia</p>
                        <Button 
                          onClick={fetchTangtainmentMusic} 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                        >
                          Reload TikTok API
                        </Button>
                      </div>
                    ) : (
                      availableTangtainmentSongs.map((song) => (
                        <div
                          key={song.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedTangtainmentSong?.id === song.id 
                              ? 'border-tiktok-blue bg-tiktok-blue/5 shadow-sm' 
                              : 'border-gray-200 hover:border-tiktok-blue/50'
                          }`}
                          onClick={() => selectTangtainmentSong(song)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-base">{song.title}</h4>
                              <p className="text-sm text-muted-foreground">by Tangtainment</p>
                              <div className="flex gap-2 mt-2 mb-2">
                                <Badge variant="outline">{song.duration}</Badge>
                                <Badge variant="secondary">{song.popularity}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>🎵 {song.play_count?.toLocaleString()} plays</div>
                                <div>📱 {song.use_count?.toLocaleString()} video uses</div>
                                <div>🎤 TikTok ID: {song.tiktok_music_id}</div>
                              </div>
                            </div>
                            {selectedTangtainmentSong?.id === song.id && (
                              <Check className="w-5 h-5 text-tiktok-blue" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {selectedTangtainmentSong && (
                    <div className="p-4 bg-tiktok-blue/5 border border-tiktok-blue/20 rounded-lg">
                      <h5 className="font-medium mb-2">📋 Preview Lagu Terpilih:</h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Judul:</strong> {selectedTangtainmentSong.title}</p>
                        <p><strong>Artist:</strong> Tangtainment</p>
                        <p><strong>Durasi:</strong> {selectedTangtainmentSong.duration}</p>
                        <p><strong>Status:</strong> {selectedTangtainmentSong.popularity}</p>
                        <p><strong>Rate:</strong> Rp 0,00002489 per view</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={addSong} 
                    className="w-full" 
                    variant="default"
                    disabled={!selectedTangtainmentSong}
                  >
                    {selectedTangtainmentSong 
                      ? `🎵 Tambah "${selectedTangtainmentSong.title}"` 
                      : '⚠️ Pilih Lagu Terlebih Dahulu'
                    }
                  </Button>
                </CardContent>
              </Card>

              {/* Songs List */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎶 Daftar Lagu Aktif
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Kelola lagu yang tersedia untuk creator
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {songs.map((song) => (
                      <div key={song.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{song.title}</h4>
                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                          </div>
                          <Badge variant="secondary">{song.status}</Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>Durasi: {song.duration}</p>
                          <p>Earnings: Rp 0,00002489/view</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators" className="mt-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Daftar Creators
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola dan monitor creator yang terdaftar
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TikTok Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>eWallet</TableHead>
                      <TableHead>Video Count</TableHead>
                      <TableHead>Total Earnings</TableHead>
                      <TableHead>Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell>@{creator.tiktok_username}</TableCell>
                        <TableCell>{creator.email}</TableCell>
                        <TableCell>{creator.phone}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{creator.ewallet_type}</div>
                            <div className="text-sm text-muted-foreground">{creator.ewallet_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>{creator.video_count || 0}</TableCell>
                        <TableCell>Rp {(creator.total_earnings || 0).toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          {new Date(creator.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;