// Update this page (the content is just a fallback if you fail to update the page)

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import NetworkSection from "@/components/NetworkSection";
import ProductivitySection from "@/components/ProductivitySection";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeatureSection />
        <NetworkSection />
        <ProductivitySection />
        <HowItWorks />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Index;
