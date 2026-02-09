import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { MechanismSection } from '@/components/MechanismSection';
import { TokenomicsSection } from '@/components/TokenomicsSection';
import { NFTNodeSection } from '@/components/NFTNodeSection';
import { ReferralSection } from '@/components/ReferralSection';
import { HowToBuySection } from '@/components/HowToBuySection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MechanismSection />
      <TokenomicsSection />
      <NFTNodeSection />
      <ReferralSection />
      <HowToBuySection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
