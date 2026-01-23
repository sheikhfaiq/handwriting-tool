import Hero from "./components/Hero";
import PromoSection from "./components/PromoSection";
import WhyChooseUs from "./components/WhyChooseUs";
import ConverterSection from "./components/converter/ConverterSection";
import UseCasesSection from "./components/UseCasesSection";
import FAQSection from "./components/FAQSection";
import ConclusionSection from "./components/ConclusionSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <Hero />
      <PromoSection />
      <ConverterSection />
      <WhyChooseUs />
      <UseCasesSection />
      <FAQSection />
      <ConclusionSection />
      <Footer />
    </div>
  );
}
