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
    const isMainLevel = depth === 0;

    return (
      <div key={item.id} className="flex flex-col border-b border-gray-50 last:border-0">
        <div className="flex justify-between items-center group py-0.5">
          <Link
            href={item.url || "#"}
            className={`
              flex-1 transition-colors duration-200
              ${isMainLevel ? 'text-base font-semibold text-[#1e355e]' : 'text-sm font-medium text-gray-600'}
              hover:text-blue-600
              py-2.5
            `}
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
              className={`
                p-2 rounded-lg hover:bg-gray-50 transition-all duration-200
                ${isOpen ? 'text-blue-600 bg-blue-50/50' : 'text-gray-400'}
              `}
            >
              <ChevronDown size={16} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {hasChildren && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="flex flex-col space-y-0.5">
              {item.children!.map((child) => renderMobileItem(child, depth + 1))}
            </div>
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
    <header className={`relative z-[100] transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'}`}>
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
        className={`lg:hidden fixed inset-0 z-[110] transition-all duration-300 ease-in-out ${isMenuOpen ? "visible" : "invisible pointer-events-none"
          }`}
        style={{ top: '0', position: 'fixed', height: '100vh', width: '100vw' }}
      >
        {/* Backdrop for closing */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content Drawer */}
        <div
          className={`absolute top-0 right-0 w-[80%] sm:w-[320px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ backgroundColor: '#ffffff', zIndex: 120 }}
        >
          <div className="flex flex-col h-full bg-white">
            {/* Header of Menu */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <span className="text-lg font-bold text-[#1e355e] tracking-tight">Menu</span>
              <button
                className="p-1.5 -mr-2 text-gray-400 hover:text-[#1e355e] hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
              <nav className="flex flex-col space-y-1">
                {navTree.map((item) => renderMobileItem(item))}
              </nav>
            </div>

            {/* Footer / CTA */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/80">
              <Link
                href="/#convert"
                className="w-full flex items-center justify-center gap-2 bg-[#1e355e] text-white px-5 py-3 rounded-lg font-semibold text-base shadow-md shadow-blue-900/10 hover:bg-blue-600 active:scale-[0.98] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Writing
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
