import { Button } from "@/components/ui/button";
import { Instagram, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: ["Tentang Kami", "Cara Kerja", "FAQ", "Kontak"]
    },
    {
      title: "Legal", 
      links: ["Syarat & Ketentuan", "Kebijakan Privasi", "Disclaimer", "DMCA"]
    },
    {
      title: "Support",
      links: ["Help Center", "Creator Guidelines", "Payment Info", "Technical Support"]
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-muted/50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bonus Section */}
        <div className="bg-gradient-to-r from-tiktok-pink to-tiktok-purple rounded-2xl p-8 mb-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎁 Bonus Spesial!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🏆 Leaderboard Mingguan</h4>
              <p className="text-sm opacity-90">Kreator paling aktif dapat bonus tambahan Rp 10.000</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">👥 Program Referral</h4>
              <p className="text-sm opacity-90">Ajak teman → bonus Rp 500 per teman aktif</p>
            </div>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-tiktok-pink to-tiktok-purple bg-clip-text text-transparent mb-4">
              TikTok Tunes Cashflow
            </h3>
            <p className="text-muted-foreground mb-4">
              Platform monetisasi TikTok #1 di Indonesia. Ubah kreativitas jadi cuan!
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="outline">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-muted-foreground hover:text-tiktok-pink transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 TikTok Tunes Cashflow. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Made with ❤️ for Indonesian Creators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;