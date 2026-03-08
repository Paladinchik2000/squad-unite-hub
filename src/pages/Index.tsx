import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RequirementsSection from "@/components/RequirementsSection";
import JoinSection from "@/components/JoinSection";
import FAQSection from "@/components/FAQSection";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <AboutSection />
        <RequirementsSection />
        <JoinSection />
        <FAQSection />
        <SocialLinks />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
