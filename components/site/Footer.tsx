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
    const [footerNav, setFooterNav] = React.useState<any[]>([]);
    const [footerHelp, setFooterHelp] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await fetch("/api/admin/menus");
                const data = await res.json();

                const navMenu = data.find((m: any) => m.name === "FOOTER_NAV");
                if (navMenu) setFooterNav(navMenu.items);

                const helpMenu = data.find((m: any) => m.name === "FOOTER_HELP");
                if (helpMenu) setFooterHelp(helpMenu.items);
            } catch (error) {
                console.error("Failed to fetch footer menus", error);
            }
        };
        fetchMenus();
    }, []);

    const defaultNav = [
        { label: 'Home', url: '/' },
        { label: 'Convert Tool', url: '#convert' },
        { label: 'Use Cases', url: '#use-cases' },
        { label: 'Why Us', url: '#why-us' },
        { label: 'FAQs', url: '#faqs' }
    ];

    const defaultHelp = [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Cookie Policy', url: '#' },
        { label: 'Support Center', url: '#' },
        { label: 'Feedback', url: '#' }
    ];

    const navItems = footerNav.length > 0 ? footerNav : defaultNav;
    const helpItems = footerHelp.length > 0 ? footerHelp : defaultHelp;

    return (
        <footer className="bg-[#1e355e] text-[#eae3db] pt-20 pb-10 relative overflow-hidden ">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 ">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4 mt-16">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/logo.png"
                                alt="Handwriting Studio Logo"
                                className="h-14 w-auto object-contain brightness-0 invert"
                            />
                        </Link>

                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col lg:items-center">
                        <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Navigation</h4>
                        <ul className="space-y-4">
                            {navItems.map((item: any) => (
                                <li key={item.label}>
                                    <Link href={item.url} className="text-[#eae3db]-100/60  transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBC02D] opacity-0  transition-opacity"></div>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="flex flex-col items-center lg:items-center text-center">
                        <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Text to Handwriting</h4>
                        <p className="text-[#eae3db]/80 text-sm leading-relaxed max-w-xs text-justify break-words hyphens-auto">
                            Text to Handwriting is a free online tool that changes typed text into real-looking Handwriting.
                            You can make custom handwritten notes,
                            download them as images or PDFs, and use many other handwriting features easily.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/50 flex flex-col md:flex-row justify-center items-center gap-6 text-center">
                    <p className="text-white-100/40 text-md  ">
                        © {new Date().getFullYear()} Text To Handwriting. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
