"use client";
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQItem[];
    title?: string;
}

const FAQSection = ({ faqs, title = "Frequently Asked Questions?" }: FAQSectionProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!faqs || faqs.length === 0) return null;

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-12 bg-transparent relative overflow-hidden">
            <div className="relative z-10">
                <div className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1e355e] tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="grid gap-4 max-w-4xl">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`relative transition-all duration-500 ease-out rounded-2xl ${activeIndex === index
                                ? 'z-20'
                                : 'z-10'
                                }`}
                        >
                            {/* Card Background with Glassmorphism */}
                            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${activeIndex === index
                                ? 'bg-white shadow-[0_10px_30px_rgba(30,53,94,0.06)] border border-blue-50'
                                : 'bg-white/50 border border-slate-100 shadow-sm hover:bg-white'
                                }`}></div>

                            {/* Stylized Background Number */}
                            <div className="absolute top-4 right-8 text-5xl font-black text-blue-500/[0.03] select-none pointer-events-none transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <button
                                onClick={() => toggleFAQ(index)}
                                className="relative w-full flex items-center gap-4 p-5 md:p-6 text-left focus:outline-none"
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm ${activeIndex === index
                                    ? 'bg-[#1e355e] text-white'
                                    : 'bg-[#1e355e] text-white'
                                    }`}>
                                    <HelpCircle size={18} />
                                </div>

                                <span className={`flex-grow text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-[#1e355e]' : 'text-[#1e355e]'
                                    }`}>
                                    {faq.question}
                                </span>

                                <div className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-500 flex items-center justify-center ${activeIndex === index
                                    ? 'bg-blue-100 rotate-180'
                                    : 'bg-blue-50'
                                    }`}>
                                    <ChevronDown className={`w-4 h-4 ${activeIndex === index ? 'text-blue-600' : 'text-blue-400'}`} />
                                </div>
                            </button>

                            <div
                                className={`relative overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 md:px-8 pb-6 md:pb-8 ml-14">
                                    <div className="h-px w-full bg-gradient-to-r from-blue-100 to-transparent mb-4"></div>
                                    <p className="text-slate-600 text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
