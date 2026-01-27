"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    LayoutDashboard,
    Rss,
    LogOut,
    Search,
    Bell,
    MessageSquare,
    Inbox,
    Users,
    Menu as MenuIcon,
    Settings,
    ChevronLeft
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const mainNavItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Pages", href: "/admin/manage-pages", icon: FileText },
        { name: "Posts", href: "/admin/manage-posts", icon: Rss },
        { name: "Menus", href: "/admin/manage-menus", icon: MenuIcon },
    ];

    const teamNavItems = [
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-gray-100 flex flex-col shadow-sm z-50 overflow-hidden">
            {/* Window Controls Decor (Mac-like) */}
            <div className="flex gap-1.5 p-6 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            {/* Profile Section */}
            <div className="px-6 py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#1e355e]/10 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[#1e355e] font-bold text-lg">
                                    {session?.user?.name?.[0]?.toUpperCase() || "A"}
                                </div>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[#1e355e] text-sm truncate w-32">
                            {session?.user?.name || "Admin User"}
                        </span>
                        <span className="text-gray-400 text-xs">Manager</span>
                    </div>
                </div>
                <button className="bg-green-500/10 text-green-600 p-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                    <ChevronLeft size={16} />
                </button>
            </div>

            {/* Search Section */}
            <div className="px-6 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1e355e]/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-semibold flex-1">{item.name}</span>
                                    {active && (
                                        <div className="flex gap-2 items-center">
                                            {item.name === "Posts" && <span className="bg-white/20 text-[10px] px-1.5 rounded-md">32</span>}
                                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                                                <span className="text-sm">+</span>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-8">
                    <div className="flex items-center justify-between px-4 mb-4">
                        <span className="text-xs font-bold text-[#1e355e]/40 uppercase tracking-wider">Additional</span>
                        <div className="flex gap-2">
                            <span className="text-[10px] text-orange-500 font-bold uppercase cursor-pointer hover:underline">View All</span>
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                    </div>
                    <ul className="space-y-1">
                        {teamNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${active
                                            ? "bg-[#1e355e] text-white"
                                            : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                <Icon size={16} />
                                            </div>
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <span className="font-semibold flex-1">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <div className="p-6 mt-auto">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors font-bold"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
