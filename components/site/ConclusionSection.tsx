"use client";

import React from 'react';
import { Quote } from 'lucide-react';

const ConclusionSection = () => {
    return (
        <section className="py-15 bg-gray-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4f46e5]/5 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-[#1e355e]/5 mb-10 transform -rotate-6 group hover:rotate-0 transition-transform duration-500">
                    <Quote className="text-[#4f46e5] w-8 h-8" />
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-[#1a237e] mb-8 leading-tight">
                    Conclusion
                </h2>

                <div className="relative">
                    {/* Stylized accent line */}
                    <p className="text-gray-600 text-xl md:text-2xl leading-relaxed font-medium italic">
                        "A Text to Handwriting Converter is a powerful and practical tool for anyone who needs handwritten text without manual writing. It saves time, reduces effort, and produces clean, readable handwriting. With useful features, multiple benefits, and a simple interface, it is an ideal solution for students, teachers, and professionals. If you want fast, neat, and reliable handwritten text, a Text to Handwriting Converter is the perfect choice."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ConclusionSection;
