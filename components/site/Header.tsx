"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PenTool, Menu as MenuIcon, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/admin/menus");
        const data = await res.json();
        const header = data.find((m: any) => m.name === "HEADER");

        const baseLinks = [
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ];

        if (header && header.items.length > 0) {
          const menuLinks = header.items.map((item: any) => ({
            name: item.label,
            href: item.url
          }));

          // Filter out duplicates if Home/Blog were already in the database menu
          const filteredMenuLinks = menuLinks.filter((ml: any) =>
            !baseLinks.some(bl => bl.href === ml.href)
          );

          setNavLinks([...baseLinks, ...filteredMenuLinks]);
        } else {
          setNavLinks(baseLinks);
        }
      } catch (error) {
        console.error("Failed to fetch menu", error);
      }
    };
    fetchMenu();
  }, []);

  return (
    <header className="relative z-50 bg-white border-b border-gray-100 py-5">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Handwriting Studio Logo"
            className="h-8 md:h-12 w-auto object-contain transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-10 font-bold group/nav">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[#1e355e]/70 hover:text-[#1e355e] transition-colors py-2 text-sm uppercase tracking-widest group/link"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover/link:w-full" />
            </Link>
          ))}

          {/* Start Writing Button */}
          <Link
            href="/#convert"
            className="bg-[#1e355e] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-xl shadow-indigo-900/10 hover:bg-blue-600 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm tracking-wide"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                const element = document.getElementById("convert");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "/#convert");
                }
              }
            }}
          >
            Start Writing
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[#1e355e] bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-500 origin-top ${isMenuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"
          }`}
      >
        <nav className="flex flex-col p-8 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xl font-black text-[#1e355e] hover:text-blue-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#convert"
            className="text-center text-white px-6 py-4 rounded-2xl font-black bg-[#1e355e] transition-all shadow-xl hover:scale-[1.02]"
            onClick={(e) => {
              setIsMenuOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                const element = document.getElementById("convert");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "/#convert");
                }
              }
            }}
          >
            Start Writing
          </Link>
        </nav>
      </div>
    </header>
  );
}
