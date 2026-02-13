"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, ArrowUp } from 'lucide-react';

export interface LinkItem {
    id: string;
    label: string;
    url: string;
    parentId?: string | null;
    order: number;
    children?: LinkItem[];
}

export interface FooterProps {
    initialNavItems: any[];
    initialHelpItems: any[];
}

const Footer = ({ initialNavItems = [], initialHelpItems = [] }: FooterProps) => {
    const [navTree, setNavTree] = useState<LinkItem[]>([]);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Enforce specific links to match Local environment and ignore dynamic DB items which are incorrect in Live
        const defaultItems: LinkItem[] = [
            { id: 'home', label: 'Home', url: '/', order: 1 },
            { id: 'about', label: 'About Us', url: '/about-us', order: 2 },
            { id: 'privacy', label: 'Privacy Policy', url: '/privacy-policy', order: 3 },
            { id: 'terms', label: 'Terms and Conditions', url: '/terms-and-conditions', order: 4 },
        ];
        setNavTree(defaultItems);
    }, []);

    // Recursive render for footer links with Hover Dropdown behavior
    const renderFooterItem = (item: LinkItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
            <li key={item.id} className="relative group shrink-0">
                <Link
                    href={item.url || "#"}
                    className={`flex items-center justify-between gap-2 transition-colors ${depth === 0
                        ? "text-white hover:text-blue-200 py-1" // Requested Color
                        : "px-5 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 w-full"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {item.label}
                    </span>
                    {hasChildren && (
                        depth === 0
                            ? <ChevronDown size={14} className="opacity-70 group-hover:opacity-100" />
                            : <ChevronRight size={14} className="opacity-70 group-hover:opacity-100" />
                    )}
                </Link>

                {hasChildren && (
                    <div className={`absolute z-50 bg-white border border-gray-100 rounded-xl shadow-xl w-56 py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform
                        ${depth === 0 ? 'left-0 top-full mt-2' : 'left-full top-0 ml-2'}
                    `}>
                        <ul className="flex flex-col">
                            {item.children!.map(child => renderFooterItem(child, depth + 1))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <footer className="bg-[#1e355e] text-white pt-16 pb-8 relative">
            <div className="max-w-7xl mx-auto px-100 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 items-start">

                    {/* Column 1: Logo */}
                    <div className="flex flex-col gap-4 self-center items-start">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <img
                                src="/logo.png"
                                alt="Handwriting Studio Logo"
                                className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                    </div>

                    {/* Column 2: Navigation (Centered aligned in desktop) */}
                    <div className="flex flex-col lg:items-center">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Navigation</h4>
                        <ul className="space-y-3 flex flex-col items-center">
                            {/* If no items, show nothing or placeholder? User said "Menu Are Dynamically Set". */}
                            {navTree.map(item => renderFooterItem(item))}
                        </ul>
                    </div>

                    {/* Column 3: Description */}
                    <div className="flex flex-col items-center lg:items-center text-center lg:text-center">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm text-center">Text to Handwriting</h4>
                        <p
                            className="text-white/80 text-sm leading-relaxed max-w-xs text-justify"
                        >
                            Text to Handwriting is a free online tool that changes typed text into real-looking Handwriting.
                            You can make custom handwritten notes,
                            download them as images or PDFs, and use many other handwriting features easily.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar: Copyright (Centered) + ScrollUp (Right) */}
                <div className="pt-8 border-t border-white/20 relative flex items-center justify-center">
                    <p className="text-white/60 text-sm text-center">
                        © {new Date().getFullYear()} Text To Handwriting. All rights reserved.
                    </p>


                </div>
            </div>
            {showScroll && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-[#1f365f] hover:bg-blue-700 border border-white/30 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={22} />
                </button>
            )}

        </footer>
    );
};

export default Footer;
