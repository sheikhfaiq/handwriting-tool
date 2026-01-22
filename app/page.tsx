import Hero from "./components/Hero";
import ConverterSection from "./components/converter/ConverterSection";

export default function Home() {
  return (
    <div className="bg-[#fdfbf7] min-h-screen">
      <Hero />
      <ConverterSection />
    </div>
  );
}
