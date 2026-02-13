"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X, ChevronDown, ChevronRight } from "lucide-react";

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  parentId?: string | null;
  order: number;
  children?: LinkItem[];
}

export interface HeaderProps {
  initialNavItems: any[]; // Raw items from DB
}

export default function Header({ initialNavItems = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navTree, setNavTree] = useState<LinkItem[]>([]);
  // Track open state of mobile menu items by ID
  const [mobileMenuOpenState, setMobileMenuOpenState] = useState<Record<string, boolean>>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setMobileMenuOpenState({}); // Reset mobile menu state
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (id: string) => {
    setMobileMenuOpenState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    // 1. Build Tree
    const buildTree = (items: any[]) => {
      const map = new Map<string, LinkItem>();
      const roots: LinkItem[] = [];

      // Initialize map
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

    if (initialNavItems && initialNavItems.length > 0) {
      setNavTree(buildTree(initialNavItems));
    } else {
      setNavTree([]);
    }
  }, [initialNavItems]);

  // Recursive Mobile Render
  const renderMobileItem = (item: LinkItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = mobileMenuOpenState[item.id] || false;

    return (
      <div key={item.id} className="flex flex-col">
        <div className="flex justify-between items-center group">
          <Link
            href={item.url || "#"}
            className="text-lg font-bold text-[#1e355e] hover:text-blue-600 py-2 transition-colors flex-1"
            style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : '0' }}
            onClick={() => {
              if (!hasChildren) setIsMenuOpen(false);
            }}
          >
            {item.label}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleMobileSubmenu(item.id)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-transform"
            >
              <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="flex flex-col space-y-2 border-l-2 border-gray-100 ml-4 pl-0">
            {item.children!.map((child) => renderMobileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Recursive Desktop Render (Dropdowns)
  const renderDesktopItem = (item: LinkItem) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="relative group/item z-50">
        <Link
          href={item.url || "#"}
          className="flex items-center gap-1 text-[#1e355e]/80 hover:text-[#1e355e] font-bold text-sm uppercase tracking-widest py-4 transition-colors"
        >
          {item.label}
          {hasChildren && <ChevronDown size={14} className="group-hover/item:rotate-180 transition-transform duration-200" />}
        </Link>

        {/* Underline animation */}
        <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover/item:w-full" />

        {/* Dropdown */}
        {hasChildren && (
          <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 transform translate-y-2 group-hover/item:translate-y-0 min-w-[200px]">
            <div className="py-2 flex flex-col">
              {item.children!.map((child) => (
                <Link
                  key={child.id}
                  href={child.url || "#"}
                  className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center justify-between group/sub"
                >
                  {child.label}
                  {child.children && child.children.length > 0 && <ChevronRight size={14} />}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`sticky top-0 z-[100] transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Handwriting Studio Logo"
            className="h-10 w-auto object-contain hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navTree.map((item) => renderDesktopItem(item))}

          {/* CTA Button */}
          <Link
            href="/#convert"
            className="ml-4 bg-[#1e355e] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Start Writing
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[#1e355e] bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-[90] transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        style={{ top: '73px' }} // Approx header height
      >
        <div className="container mx-auto px-6 py-8 h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="space-y-4">
            {navTree.map((item) => renderMobileItem(item))}

            <div className="pt-6 border-t border-gray-100 mt-6">
              <Link
                href="/#convert"
                className="w-full block text-center bg-[#1e355e] text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Writing Now
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
