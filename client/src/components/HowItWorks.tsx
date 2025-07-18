import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Video, Upload } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1️⃣",
      title: "Pilih Lagu",
      description: "Pilih dari daftar lagu trending yang tersedia di website ini.",
      icon: <Music className="w-8 h-8" />,
      color: "text-tiktok-pink"
    },
    {
      number: "2️⃣", 
      title: "Buat Video TikTok",
      description: "Pakai lagu tersebut sebagai soundtrack video TikTok kamu.",
      icon: <Video className="w-8 h-8" />,
      color: "text-tiktok-purple"
    },
    {
      number: "3️⃣",
      title: "Upload & Klaim",
      description: "Submit link videomu ke dashboard. Dapatkan Rp 100/video!",
      icon: <Upload className="w-8 h-8" />,
      color: "text-tiktok-blue"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cara Kerja
          </h2>
          <p className="text-xl text-muted-foreground">
            3 Langkah Sederhana untuk Mulai Menghasilkan
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className={`${step.color} mb-4 flex justify-center`}>
                  {step.icon}
                </div>
                <div className="text-4xl font-bold mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-current opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" variant="tiktok" className="text-lg px-8 py-6">
            🔘 Lihat Daftar Lagu Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;