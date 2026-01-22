"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white text-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition-opacity">
          <span className="text-2xl">✍️</span>
          <span>TextToHandwriting</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          <Link
            href="/"
            className={`hover:text-indigo-600 transition-colors pb-1 ${isActive('/') ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/convert"
            className={`hover:text-indigo-600 transition-colors pb-1 ${isActive('/convert') ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
          >
            Convert
          </Link>
          <Link
            href="/features"
            className={`hover:text-indigo-600 transition-colors pb-1 ${isActive('/features') ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
          >
            Features
          </Link>
          <Link
            href="/contact"
            className={`hover:text-indigo-600 transition-colors pb-1 ${isActive('/contact') ? 'border-b-2 border-indigo-600 text-indigo-600' : ''}`}
          >
            Contact
          </Link>

          {/* Start Writing Button */}
          <Link
            href="/convert"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold transition-colors duration-300"
            style={{ backgroundColor: '#4f46e5' }} // Default indigo-600
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e355e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            Start Writing
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none hover:bg-gray-100 rounded-md transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/convert"
              className={`block px-3 py-2 rounded-md transition-colors ${isActive('/convert') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Convert
            </Link>
            <Link
              href="/features"
              className={`block px-3 py-2 rounded-md transition-colors ${isActive('/features') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/convert"
              className="block text-center bg-indigo-600 text-white px-3 py-2 rounded-md font-semibold mt-2 transition-colors duration-300"
              style={{ backgroundColor: '#4f46e5' }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e355e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Start Writing
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
