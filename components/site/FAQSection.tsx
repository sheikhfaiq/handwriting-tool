"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is a text to handwriting generator used for?",
            answer: "It converts typed text into a handwritten style."
        },
        {
            question: "Is the text to handwriting free to use?",
            answer: "Yes, our convert text to handwriting tool is free."
        },
        {
            question: "Does it work on mobile devices?",
            answer: "Yes, the tool is fully compatible with mobile phones and tablets."
        },
        {
            question: "Can I choose different handwriting styles?",
            answer: "Yes, multiple handwriting styles are available to suit different needs."
        },
        {
            question: "Can I print text to handwriting documents?",
            answer: "Absolutely. Our tools support printable formats, such as PDF."
        },
        {
            question: "Will text to handwriting replace real handwriting?",
            answer: "No, but it will continue to support and complement it."
        }
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-20 bg-[#f8fafc] relative overflow-hidden">
            {/* Artistic Background Tokens */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/5 rounded-full blur-[80px]"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] tracking-tight">
                        Frequently Asked Questions?
                    </h2>
                </div>

                <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`relative group transition-all duration-500 ease-out ${activeIndex === index
                                ? 'scale-[1.01] z-20'
                                : 'hover:scale-[1.005] z-10'
                                }`}
                        >
                            {/* Card Background with Glassmorphism */}
                            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${activeIndex === index
                                ? 'bg-white shadow-[0_15px_30px_rgba(30,53,94,0.08)] border-blue-200'
                                : 'bg-white/60 backdrop-blur-md border border-white hover:bg-white hover:border-blue-100 shadow-sm'
                                }`}></div>

                            {/* Stylized Background Number */}
                            <div className="absolute top-4 right-8 text-6xl font-black text-blue-500/[0.03] select-none pointer-events-none transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <button
                                onClick={() => toggleFAQ(index)}
                                className="relative w-full flex items-center gap-4 p-5 md:p-6 text-left focus:outline-none"
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md ${activeIndex === index
                                    ? 'bg-[#1e355e] text-white rotate-12'
                                    : 'bg-white text-blue-500 group-hover:bg-blue-50'
                                    }`}>
                                    <HelpCircle size={20} />
                                </div>

                                <span className={`flex-grow text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-[#1e355e]' : 'text-slate-700'
                                    }`}>
                                    {faq.question}
                                </span>

                                <div className={`flex-shrink-0 w-8 h-8 rounded-full border transition-all duration-500 flex items-center justify-center ${activeIndex === index
                                    ? 'bg-blue-100 border-blue-200 rotate-180'
                                    : 'bg-transparent border-slate-200'
                                    }`}>
                                    <ChevronDown className={`w-4 h-4 ${activeIndex === index ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                            </button>

                            <div
                                className={`relative overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
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
