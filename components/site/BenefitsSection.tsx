"use client";

import React from 'react';
import {
    Timer,
    Hand,
    Award,
    LayoutGrid,
    GraduationCap,
    Infinity
} from 'lucide-react';

const BenefitsSection = () => {
    const benefits = [
        {
            icon: <Timer className="w-8 h-8 text-[#1e355e]" />,
            title: "Saves Time and Effort",
            description: "Writing pages by hand can take hours. Our tool converts your digital text into natural script within seconds, freeing up your valuable time.",
            bgColor: "bg-blue-50"
        },
        {
            icon: <Hand className="w-8 h-8 text-[#1e355e]" />,
            title: "Minimizes Hand Strain",
            description: "Long handwriting tasks can cause physical discomfort. Using an automated converter helps you avoid the fatigue of manual writing.",
            bgColor: "bg-indigo-50"
        },
        {
            icon: <Award className="w-8 h-8 text-[#1e355e]" />,
            title: "Improves Presentation",
            description: "Produces text that is neat, consistent, and easy to read, making your assignments and notes look polished and professional.",
            bgColor: "bg-amber-50"
        },
        {
            icon: <LayoutGrid className="w-8 h-8 text-[#1e355e]" />,
            title: "Useful for Multiple Purposes",
            description: "From academic schoolwork to formal office notes and creative designs, our script fits almost every personal and professional use case.",
            bgColor: "bg-teal-50"
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-[#1e355e]" />,
            title: "Ideal for Students",
            description: "Specifically designed for students to tackle homework and study notes that require a handwritten presentation.",
            bgColor: "bg-rose-50"
        },
        {
            icon: <Infinity className="w-8 h-8 text-[#1e355e]" />,
            title: "Consistent Handwriting",
            description: "Ensures uniform style throughout your entire document—something that is difficult to maintain during long manual writing sessions.",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <section className="py-24 bg-[#eae3db]/30 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                    <div className="lg:w-1/2">
                        <span className="text-[#FBC02D] font-bold tracking-widest uppercase text-sm mb-4 block">Enhanced Productivity</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1a237e] mb-6">
                            Benefits of Online <br /> Text to Handwriting
                        </h2>
                    </div>
                    <div className="lg:w-1/2">
                        <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-[#FBC02D] pl-6">
                            Using an online text-to-handwriting converter offers several benefits that make writing easier, faster, and more personal than ever before.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group p-8 rounded-[2rem] bg-white hover:bg-[#1e355e] transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-gray-100 overflow-hidden relative">
                            {/* Decorative Background Blob */}
                            <div className={`absolute -right-8 -top-8 w-24 h-24 ${benefit.bgColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-8 group-hover:bg-white group-hover:rotate-12 transition-all duration-500 shadow-inner`}>
                                    {benefit.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-[#1a237e] group-hover:text-white mb-4 transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-500 group-hover:text-blue-100/70 transition-colors leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FBC02D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
