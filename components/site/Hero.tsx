"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Hero() {
  const pathname = usePathname();

  return (
    <section className="bg-[#eae3db] min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Badge */}
      <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100 mb-8 flex items-center space-x-2">
        <span className="text-orange-400">✨</span>
        <span className="text-gray-600 text-sm font-medium">Transform your text instantly</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 font-(family-name:--font-playfair)">
        Turn Your Text Into
      </h1>
      <div className="relative mb-8">
        <h2 className="text-6xl md:text-8xl text-[#1e355e] font-(family-name:--font-pacifico) transform -rotate-2">
          Beautiful Handwriting
        </h2>
        {/* Pencil Icon Decoration */}
        <span className="hidden md:block absolute -right-12 -top-4 text-4xl transform rotate-12">✏️</span>
        <span className="hidden md:block absolute -right-8 -top-8 text-2xl text-orange-400">✨</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Create beautiful text to handwritten notes, letters, and documents in seconds.
        Choose from a variety of realistic handwriting styles and customize every detail.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
        <Link
          href="/#convert"
          className="bg-[#1e355e] text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-[#2a4a80] transition-colors shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              const element = document.getElementById("convert");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "/#convert");
              }
            }
          }}
        >
          <span>✏️</span>
          <span>Start Writing</span>
        </Link>
        <Link
          href="#why-us"
          className="bg-transparent border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          Why Choose Us
        </Link>
      </div>
    </section>
  );
}
