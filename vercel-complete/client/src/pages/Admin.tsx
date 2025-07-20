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
    artist: "",
    status: "",
    duration: "",
    earnings_per_video: 100,
    file_url: "",
    spotify_url: ""
  });

  // YouTube Music search state
  const [ytSearchQuery, setYtSearchQuery] = useState("");
  const [ytSearchResults, setYtSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showYTSearch, setShowYTSearch] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'audio') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchData();
      toast({
        title: "Login berhasil!",
        description: "Selamat datang di admin panel."
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

  // Search YouTube Music
  const searchYouTubeMusic = async () => {
    if (!ytSearchQuery.trim()) {
      toast({
        title: "Error",
        description: "Masukkan query pencarian.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/ytmusic/search?q=${encodeURIComponent(ytSearchQuery)}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to search YouTube Music');
      }
      
      const data = await response.json();
      setYtSearchResults(data.tracks || []);
      
      toast({
        title: "Pencarian berhasil",
        description: `Ditemukan ${data.tracks?.length || 0} lagu dari YouTube Music.`
      });
    } catch (error) {
      console.error('YouTube Music search error:', error);
      toast({
        title: "Error",
        description: "Gagal mencari lagu di YouTube Music. Pastikan koneksi internet stabil.",
        variant: "destructive"
      });
      setYtSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select song from YouTube Music results
  const selectYTTrack = (track: any) => {
    setSongForm({
      title: track.title,
      artist: track.artist,
      status: "🔥 Trending", // Default status
      duration: track.duration,
      earnings_per_video: 100,
      file_url: track.streamUrl,
      spotify_url: track.streamUrl // Use YT Music URL as alternative
    });
    
    toast({
      title: "Lagu dipilih",
      description: `"${track.title}" oleh ${track.artist} telah dipilih.`
    });
    
    setShowYTSearch(false);
  };

  const addSong = async () => {
    try {
      const { error } = await supabase
        .from('songs')
        .insert([songForm]);

      if (error) throw error;

      toast({
        title: "Lagu berhasil ditambahkan!",
        description: "Lagu baru telah ditambahkan ke database."
      });

      setSongForm({
        title: "",
        artist: "",
        status: "",
        duration: "",
        earnings_per_video: 100,
        file_url: "",
        spotify_url: ""
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan lagu.",
        variant: "destructive"
      });
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="submissions">Video Submissions</TabsTrigger>
            <TabsTrigger value="songs">Kelola Lagu</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
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
          </TabsContent>

          {/* Video Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Video Submissions - Review</CardTitle>
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
          <TabsContent value="songs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Song Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Tambah Lagu Baru
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* YouTube Music Search Toggle */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={showYTSearch ? "default" : "outline"}
                      onClick={() => setShowYTSearch(!showYTSearch)}
                      className="flex items-center gap-2"
                    >
                      <Music className="w-4 h-4" />
                      {showYTSearch ? "Manual Input" : "Cari di YouTube Music"}
                    </Button>
                  </div>

                  {/* YouTube Music Search */}
                  {showYTSearch && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label>Cari Lagu di YouTube Music</Label>
                        <div className="flex gap-2">
                          <Input
                            value={ytSearchQuery}
                            onChange={(e) => setYtSearchQuery(e.target.value)}
                            placeholder="Masukkan nama lagu atau artist..."
                            onKeyPress={(e) => e.key === 'Enter' && searchYouTubeMusic()}
                          />
                          <Button 
                            onClick={searchYouTubeMusic}
                            disabled={isSearching}
                          >
                            {isSearching ? "Searching..." : "Cari"}
                          </Button>
                        </div>
                      </div>

                      {/* Search Results */}
                      {ytSearchResults.length > 0 && (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          <Label className="text-sm font-medium">Hasil Pencarian:</Label>
                          {ytSearchResults.map((track, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted cursor-pointer"
                              onClick={() => selectYTTrack(track)}
                            >
                              <div className="flex-1">
                                <h4 className="font-medium">{track.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {track.artist} • {track.duration}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost">
                                Pilih
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Lagu</Label>
                    <Input
                      id="title"
                      value={songForm.title}
                      onChange={(e) => setSongForm({...songForm, title: e.target.value})}
                      placeholder="Masukkan judul lagu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist</Label>
                    <Input
                      id="artist"
                      value={songForm.artist}
                      onChange={(e) => setSongForm({...songForm, artist: e.target.value})}
                      placeholder="Nama artist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={songForm.status} onValueChange={(value) => setSongForm({...songForm, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="🔥 Trending">🔥 Trending</SelectItem>
                        <SelectItem value="✨ Popular">✨ Popular</SelectItem>
                        <SelectItem value="🚀 New Hit">🚀 New Hit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi</Label>
                    <Input
                      id="duration"
                      value={songForm.duration}
                      onChange={(e) => setSongForm({...songForm, duration: e.target.value})}
                      placeholder="0:30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="earnings">Rate per 1000 Views (Rp)</Label>
                    <Input
                      id="earnings"
                      type="number"
                      value={songForm.earnings_per_video}
                      onChange={(e) => setSongForm({...songForm, earnings_per_video: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file_url">File URL (Optional)</Label>
                    <Input
                      id="file_url"
                      value={songForm.file_url}
                      onChange={(e) => setSongForm({...songForm, file_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spotify_url">Music URL (Optional)</Label>
                    <Input
                      id="spotify_url"
                      value={songForm.spotify_url}
                      onChange={(e) => setSongForm({...songForm, spotify_url: e.target.value})}
                      placeholder="https://music.youtube.com/... atau https://open.spotify.com/..."
                    />
                  </div>

                  <Button onClick={addSong} className="w-full" variant="tiktok">
                    Tambah Lagu
                  </Button>
                </CardContent>
              </Card>

              {/* Songs List */}
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Lagu Aktif</CardTitle>
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
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Creators</CardTitle>
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