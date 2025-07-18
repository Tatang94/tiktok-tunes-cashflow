import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const TermsSection = () => {
  const terms = [
    "Akun TikTok harus publik",
    "Video harus orisinal (tidak repost)",
    "Lagu harus full 10 detik minimum dipakai",
    "Maksimal 50 video per hari per akun"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-tiktok-purple/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              Syarat & Ketentuan
            </CardTitle>
            <p className="text-muted-foreground">
              Ikuti aturan simple ini untuk memastikan payment kamu lancar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {terms.map((term, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle className="w-6 h-6 text-tiktok-pink flex-shrink-0 mt-0.5" />
                <span className="text-lg">{term}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TermsSection;