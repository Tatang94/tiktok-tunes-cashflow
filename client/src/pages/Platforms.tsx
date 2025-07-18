import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, TrendingUp, DollarSign, Clock, Star } from "lucide-react";

const Platforms = () => {
  const platforms = [
    {
      name: "TikTok",
      status: "Active",
      description: "Platform utama untuk monetisasi video musik",
      earnings: "Rp 50-500/video",
      audience: "1B+ users",
      features: ["Viral potential tinggi", "Target audience muda", "Algorithm terbaik"],
      color: "bg-pink-500"
    },
    {
      name: "Instagram Reels",
      status: "Coming Soon",
      description: "Video pendek dengan format mirip TikTok",
      earnings: "Rp 30-300/video",
      audience: "500M+ users",
      features: ["Cross-platform sharing", "Shopping integration", "Story integration"],
      color: "bg-purple-500"
    },
    {
      name: "YouTube Shorts",
      status: "Coming Soon",
      description: "Video vertikal pendek di platform YouTube",
      earnings: "Rp 40-400/video",
      audience: "2B+ users",
      features: ["Monetisasi langsung", "Analytics mendalam", "Global reach"],
      color: "bg-red-500"
    },
    {
      name: "Facebook Reels",
      status: "Planning",
      description: "Video pendek di ekosistem Meta",
      earnings: "Rp 25-250/video",
      audience: "300M+ users",
      features: ["Mature audience", "Business tools", "Ad integration"],
      color: "bg-blue-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 text-white">✅ Aktif</Badge>;
      case "Coming Soon":
        return <Badge className="bg-yellow-500 text-white">🚀 Segera</Badge>;
      case "Planning":
        return <Badge className="bg-gray-500 text-white">📋 Perencanaan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-4xl font-bold mb-4">Platform Creator</h1>
          <p className="text-xl text-muted-foreground">
            Jangkau audience lebih luas dengan berbagai platform social media
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Total Audience</span>
              </div>
              <p className="text-2xl font-bold">1.8B+</p>
              <p className="text-sm text-muted-foreground">Users global</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Platform Aktif</span>
              </div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">TikTok ready</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Max Earnings</span>
              </div>
              <p className="text-2xl font-bold">Rp 500</p>
              <p className="text-sm text-muted-foreground">Per video</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Platform baru</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded-full ${platform.color}`}></div>
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                    </div>
                    {getStatusBadge(platform.status)}
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{platform.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Earnings Range</p>
                    <p className="font-semibold text-green-600">{platform.earnings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Audience</p>
                    <p className="font-semibold">{platform.audience}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Key Features</p>
                  <div className="space-y-1">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {platform.status === "Active" ? (
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                    Mulai Upload Video
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    {platform.status === "Coming Soon" ? "Notify When Ready" : "Coming Later"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Roadmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Platform Roadmap 2025</CardTitle>
            <p className="text-muted-foreground">
              Rencana ekspansi platform untuk memberikan lebih banyak kesempatan monetisasi
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Q1 2025 - TikTok Full Launch</p>
                  <p className="text-sm text-muted-foreground">Platform utama dengan semua fitur lengkap</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Q2 2025 - Instagram Reels</p>
                  <p className="text-sm text-muted-foreground">Ekspansi ke platform Meta dengan cross-posting</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Q3 2025 - YouTube Shorts</p>
                  <p className="text-sm text-muted-foreground">Integrasi dengan ekosistem YouTube</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Q4 2025 - Multi-Platform Dashboard</p>
                  <p className="text-sm text-muted-foreground">Dashboard terpadu untuk semua platform</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Platforms;