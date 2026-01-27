"use client";

import React from 'react';
import {
    PenTool,
    Palette,
    FileText,
    Eye,
    Download,
    ShieldCheck,
    Settings2,
    Clipboard,
    Globe
} from 'lucide-react';

const WhyChooseUs = () => {
    const values = [
        {
            icon: <img src="/logo.png" className="h-7 w-auto object-contain brightness-0 invert" alt="Styles" />,
            title: "Multiple Handwriting Styles",
            description: "Choose from a variety of beautiful, authentic handwriting fonts that perfectly match your personality.",
            color: "bg-[#1e3a8a]"
        },
        {
            icon: <Palette className="w-8 h-8 text-white" />,
            title: "Customizable Colors",
            description: "Select from classic ink colors such as blue, black, sepia, green, and red to suit your style.",
            color: "bg-blue-500"
        },
        {
            icon: <FileText className="w-8 h-8 text-white" />,
            title: "Paper Backgrounds",
            description: "Choose from cream, white, aged, lined, or grid paper styles to match your needs.",
            color: "bg-[#FBC02D]"
        },
        {
            icon: <Eye className="w-8 h-8 text-white" />,
            title: "Instant Preview",
            description: "See your handwriting transform in real-time as you type.",
            color: "bg-purple-500"
        },
        {
            icon: <Download className="w-8 h-8 text-white" />,
            title: "Easy Download",
            description: "Export your handwriting as high-quality PNG images or PDF with one click.",
            color: "bg-orange-500"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-white" />,
            title: "100% Free",
            description: "No sign-up required. Your text stays private and never leaves your browser.",
            color: "bg-teal-500"
        },
        {
            icon: <Settings2 className="w-8 h-8 text-white" />,
            title: "Font Size & Spacing",
            description: "Adjust font size, line spacing, and margins to match notebook styles or assignment guidelines.",
            color: "bg-indigo-500"
        },
        {
            icon: <Clipboard className="w-8 h-8 text-white" />,
            title: "Easy Copy and Paste",
            description: "Paste text directly into the input box to fast and conveniently convert long content.",
            color: "bg-green-500"
        },
        {
            icon: <Globe className="w-8 h-8 text-white" />,
            title: "Online Access",
            description: "No installation required. Works directly in the browser, making it accessible from anywhere.",
            color: "bg-rose-500"
        }
    ];

    return (
        <section id="why-us" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1a237e] mt-2 mb-6">Why Choose Our Tool?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Our tool helps you create beautiful handwritten notes, letters, and documents in just seconds
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className="group relative p-8 rounded-3xl bg-gray-50 hover:bg-[#1a237e] transition-colors duration-500 overflow-hidden">
                            {/* Decorative Circle */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${value.color} opacity-20 group-hover:scale-150 transition-transform duration-700`} />

                            <div className={`relative w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center shadow-lg mb-8 group-hover:rotate-6 transition-transform duration-300`}>
                                {value.icon}
                            </div>

                            <h3 className="text-xl font-bold text-[#1a237e] group-hover:text-white mb-4 transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 group-hover:text-gray-300 transition-colors leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
