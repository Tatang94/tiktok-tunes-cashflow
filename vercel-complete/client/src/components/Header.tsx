import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "Home", href: "/", action: () => scrollToSection('hero-section') },
    { name: "Cara Kerja", href: "/", action: () => scrollToSection('how-it-works') },
    { name: "Lagu", href: "/", action: () => scrollToSection('songs-section') },
    { name: "Daftar", href: "/", action: () => scrollToSection('registration-section') },
    { name: "Platform", href: "/platforms" },
    { name: "Support", href: "/support" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-tiktok-pink to-tiktok-purple rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-tiktok-pink to-tiktok-purple bg-clip-text text-transparent">
              SOUNDTRACK TOK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.href === "/" ? (
                  <button
                    onClick={item.action}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      location === item.href
                        ? "text-tiktok-pink"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              className="bg-gradient-to-r from-tiktok-pink to-tiktok-purple hover:from-tiktok-pink/90 hover:to-tiktok-purple/90 text-white"
              onClick={() => scrollToSection('registration-section')}
            >
              Daftar Creator
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.href === "/" ? (
                  <button
                    onClick={() => {
                      item.action?.();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 text-base font-medium transition-colors ${
                      location === item.href
                        ? "text-tiktok-pink"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <Button 
                className="w-full bg-gradient-to-r from-tiktok-pink to-tiktok-purple hover:from-tiktok-pink/90 hover:to-tiktok-purple/90 text-white"
                onClick={() => {
                  scrollToSection('registration-section');
                  setIsMenuOpen(false);
                }}
              >
                Daftar Creator
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;