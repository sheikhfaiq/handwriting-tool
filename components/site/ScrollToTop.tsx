"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible] = useState(true); // Button is always visible

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-32 right-8 z-50 transition-opacity duration-300">
            <button
                onClick={scrollToTop}
                className={`p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </button>
        </div>
    );
}
