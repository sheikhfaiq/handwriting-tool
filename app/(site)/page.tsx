import Hero from "@/components/site/Hero";
import PromoSection from "@/components/site/PromoSection";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import ConverterSection from "@/components/site/ConverterSection";
import UseCasesSection from "@/components/site/UseCasesSection";
import FAQSection from "@/components/site/FAQSection";
import ConclusionSection from "@/components/site/ConclusionSection";

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
    </div>
  );
}
