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

    useEffect(() => {
        const buildTree = (items: any[]) => {
            if (!items || items.length === 0) return [];

            const map = new Map<string, LinkItem>();
            const roots: LinkItem[] = [];

            // Initialize map with safe cloning
            items.forEach(item => {
                map.set(item.id, { ...item, children: [] });
            });

            // Build hierarchy
            items.forEach(item => {
                const node = map.get(item.id);
                if (item.parentId && map.has(item.parentId)) {
                    map.get(item.parentId)!.children!.push(node!);
                } else {
                    roots.push(node!);
                }
            });

            // Sort by order
            const sortItems = (nodes: LinkItem[]) => {
                nodes.sort((a, b) => a.order - b.order);
                nodes.forEach(n => {
                    if (n.children && n.children.length > 0) {
                        sortItems(n.children);
                    }
                });
            };

            sortItems(roots);
            return roots;
        };

        // Combine both lists if needed, or just use navItems for the main navigation column
        // The user image shows one main list. We will treat initialNavItems as that list.
        // If there are help items, we append them or ignore based on "Menu Are Dynamically Set By User"
        // Let's assume all dynamic items go into the center column? 
        // Or sticky to the previous logic: Nav Items = Center Column. 
        setNavTree(buildTree(initialNavItems));
    }, [initialNavItems]);

    // Recursive render for footer links with Hover Dropdown behavior
    const renderFooterItem = (item: LinkItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
            <li key={item.id} className="relative group shrink-0">
                <Link
                    href={item.url || "#"}
                    className={`flex items-center justify-between gap-2 transition-colors ${depth === 0
                            ? "text-[#e0cdb6] hover:text-white py-1" // Requested Color
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
        <footer className="bg-[#1e355e] text-[#e0cdb6] pt-16 pb-8 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 items-start">

                    {/* Column 1: Logo */}
                    <div className="flex flex-col gap-4 mt-4 items-start">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <img
                                src="/logo.png"
                                alt="Handwriting Studio Logo"
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                    </div>

                    {/* Column 2: Navigation (Centered aligned in desktop, but text-left) */}
                    <div className="flex flex-col lg:items-center">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Navigation</h4>
                        <ul className="space-y-3 flex flex-col items-start">
                            {/* If no items, show nothing or placeholder? User said "Menu Are Dynamically Set". */}
                            {navTree.map(item => renderFooterItem(item))}
                        </ul>
                    </div>

                    {/* Column 3: Description */}
                    <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
                        <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Text to Handwriting</h4>
                        <p
                            className="text-[#e0cdb6]/80 text-sm leading-relaxed max-w-xs text-center lg:text-right"
                        >
                            Text to Handwriting is a free online tool that changes typed text into real-looking Handwriting.
                            You can make custom handwritten notes,
                            download them as images or PDFs, and use many other handwriting features easily.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar: Copyright (Centered) + ScrollUp (Right) */}
                <div className="pt-8 border-t border-white/20 relative flex items-center justify-center">
                    <p className="text-[#e0cdb6]/60 text-sm text-center">
                        © {new Date().getFullYear()} Text To Handwriting. All rights reserved.
                    </p>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="absolute right-0 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
