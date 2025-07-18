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
      <HeroSection />
      <HowItWorks />
      <TermsSection />
      <TestimonialsSection />
      <SongListSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
};

export default Index;
