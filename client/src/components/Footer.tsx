import { Button } from "@/components/ui/button";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Platforms", href: "/platforms" },
        { name: "Creator Dashboard", href: "/creator-dashboard" },
        { name: "FAQ", href: "/support" }
      ]
    },
    {
      title: "Legal", 
      links: [
        { name: "Legal & Compliance", href: "/legal" },
        { name: "Terms of Service", href: "/legal" },
        { name: "Privacy Policy", href: "/legal" },
        { name: "Creator Agreement", href: "/legal" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Support Center", href: "/support" },
        { name: "Help & FAQ", href: "/support" },
        { name: "Create Ticket", href: "/support" },
        { name: "Documentation", href: "/support" }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-muted/50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bonus Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700 rounded-2xl p-8 mb-12 text-white text-center shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-white">🎁 Bonus Spesial!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold mb-3 text-white text-lg">🏆 Leaderboard Mingguan</h4>
              <p className="text-white/90 text-sm">Kreator paling aktif dapat bonus tambahan Rp 10.000</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold mb-3 text-white text-lg">👥 Program Referral</h4>
              <p className="text-white/90 text-sm">Ajak teman → bonus Rp 500 per teman aktif</p>
            </div>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-tiktok-pink to-tiktok-purple bg-clip-text text-transparent mb-4">
              CreatorPro Platform
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
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-tiktok-pink transition-colors"
                    >
                      {link.name}
                    </Link>
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