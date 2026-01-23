"use client";

import React from 'react';
import {
    BookOpen,
    Heart,
    Briefcase,
    Pencil
} from 'lucide-react';

const UseCasesSection = () => {
    const cases = [
        {
            icon: <BookOpen className="w-6 h-6" />,

            title: "School Notes",
            description: "Students can make neat handwritten notes and assignments quickly without writing by hand. Perfect for submitting authentic-looking work."
        },
        {
            icon: <Heart className="w-6 h-6" />,

            title: "Personal Letters",
            description: "Create letters or messages for friends and family that feel personal and special. Keep the human touch in a digital world."
        },
        {
            icon: <Briefcase className="w-6 h-6" />,

            title: "Work Documents",
            description: "Make reports, letters, or memos look more personal and professional. Add a unique signature style to your office paperwork."
        },
        {
            icon: <Pencil className="w-6 h-6" />,

            title: "Teachers and Educators",
            description: "Teachers use it to create worksheets, handwritten examples, and feedback that feels more personal and engaging to students."
        }
    ];

    return (
        <section id="use-cases" className="py-24 bg-[#eae3db]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    {/* Left Column: Heading */}
                    <div className="lg:w-3/5 lg:sticky lg:top-24">
                        <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-[#1a237e] leading-tight mb-12">
                            Use Cases of Text to Handwriting Converter
                        </h2>

                        {/* Illustrative SVG */}
                        <div className="relative group hidden lg:block">
                            <div className="absolute -inset-4 bg-blue-100/30 rounded-[3rem] blur-2xl group-hover:bg-blue-200/30 transition-all duration-500"></div>
                            <svg viewBox="0 0 400 300" className="relative z-10 w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="80" y="40" width="240" height="220" rx="20" fill="white" />
                                <rect x="80" y="40" width="240" height="220" rx="20" stroke="#E2E8F0" strokeWidth="2" />

                                {/* Lines on Paper - Made solid and more visible */}
                                <line x1="110" y1="90" x2="290" y2="90" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="110" y1="130" x2="290" y2="130" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="110" y1="170" x2="290" y2="170" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="110" y1="210" x2="210" y2="210" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

                                {/* Abstract Pen */}
                                <g transform="rotate(-15, 300, 150)">
                                    <rect x="280" y="80" width="12" height="140" rx="6" fill="#1e355e" />
                                    <path d="M280 220L286 240L292 220" fill="#1e355e" />
                                    <circle cx="286" cy="90" r="3" fill="#ffffff" />
                                </g>

                                {/* Floating Elements - Matched to Navy Theme */}
                                <circle cx="60" cy="150" r="15" fill="#1e355e" fillOpacity="0.1" className="animate-pulse" />
                                <rect x="330" y="60" width="20" height="20" rx="4" transform="rotate(45, 340, 70)" fill="#1e355e" fillOpacity="0.1" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Column: Timeline-style list */}
                    <div className="lg:w-3/5 space-y-12 relative">
                        {/* Vertical Line Connector */}
                        <div className="absolute left-6 top-2 bottom-7 w-px bg-[#1e355e] hidden md:block"></div>

                        {cases.map((useCase, index) => (
                            <div key={index} className="flex gap-6 md:gap-10 relative group">
                                {/* Icon Container */}
                                <div className="z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#1e355e] group-hover:scale-110 group-hover:bg-[#1e355e] group-hover:text-white transition-all duration-300 shadow-md">
                                    {useCase.icon}
                                </div>

                                {/* Text Content */}
                                <div className="pt-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-[#1e355e] mb-2 group-hover:text-[#1e355e] transition-colors">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-gray-500 max-w-xl leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
