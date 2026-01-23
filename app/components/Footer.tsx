"use client";

import React from 'react';
import Link from 'next/link';
import {
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    Globe,
    Github,
    PenTool
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1e355e] text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Convert Tool', href: '#convert' },
                                { name: 'Use Cases', href: '#use-cases' },
                                { name: 'Why Us', href: '#why-us' },
                                { name: 'FAQs', href: '#faqs' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-blue-100/60 hover:text-[#FBC02D] transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBC02D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Help & Support</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support Center', 'Feedback'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-blue-100/60 hover:text-[#FBC02D] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Our Mission</h4>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-blue-100/70 text-sm italic mb-4">
                                "Because in a world of pixels and defaults, a handwritten note still carries a soul."
                            </p>
                            <div className="flex items-center gap-3 text-blue-100/60 transition-colors hover:text-[#FBC02D]">
                                <Mail size={16} />
                                <span className="text-sm">hello@handwriting.studio</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-blue-100/40 text-sm">
                        © {new Date().getFullYear()} Handwriting Studio. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-blue-100/40 text-sm">
                        <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                            <Globe size={14} />
                            <span>English (US)</span>
                        </div>
                        <span className="hidden md:block">|</span>
                        <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                            <span>Status: Operational</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
