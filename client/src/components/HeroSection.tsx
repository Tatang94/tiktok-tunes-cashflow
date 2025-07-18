import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Animation Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-tiktok-purple/20 via-background to-tiktok-pink/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjAwNTAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-tiktok-pink to-tiktok-purple text-white px-4 py-2 rounded-full text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            Platform Creator Monetisasi #1 Indonesia
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-tiktok-pink via-tiktok-purple to-tiktok-blue bg-clip-text text-transparent">
            💸 Dari TikTok Jadi Cuan!
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
          🎶 Dapatkan <span className="text-tiktok-pink font-bold">Rp 100</span> setiap kali kamu bikin video TikTok pakai lagu dari kami!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            onClick={() => scrollToSection('registration-section')}
          >
            🔘 Mulai Sekarang
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 border-2"
            onClick={() => scrollToSection('how-it-works')}
          >
            <Play className="w-5 h-5 mr-2" />
            🔘 Lihat Cara Kerja
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-tiktok-pink mb-2">10,000+</div>
            <div className="text-muted-foreground">Video Dibuat</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-tiktok-purple mb-2">Rp 50jt+</div>
            <div className="text-muted-foreground">Total Dibayarkan</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-tiktok-blue mb-2">5,000+</div>
            <div className="text-muted-foreground">Creator Aktif</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;