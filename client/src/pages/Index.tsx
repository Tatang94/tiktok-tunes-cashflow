import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import TermsSection from "@/components/TermsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SongListSection from "@/components/SongListSection";
import RegistrationSection from "@/components/RegistrationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <TermsSection />
      <TestimonialsSection />
      <div id="songs-section">
        <SongListSection />
      </div>
      <div id="registration-section">
        <RegistrationSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
