"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    LayoutDashboard,
    Rss,
    LogOut,
    Menu as MenuIcon,
    Inbox,
    Plus
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const mainNavItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Pages", href: "/admin/manage-pages", icon: FileText },
        { name: "Categories", href: "/admin/manage-categories", icon: Inbox },
        { name: "Posts", href: "/admin/manage-posts", icon: Rss },
        { name: "Menus", href: "/admin/manage-menus", icon: MenuIcon },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-gray-100 flex flex-col shadow-sm z-50 overflow-hidden">

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
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar mt-6">
                <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <li key={item.name}>
                                <div className={`flex items-center rounded-[3px] transition-all duration-200 ${active
                                    ? "bg-[#1e355e] text-white shadow-md shadow-blue-900/10"
                                    : "text-slate-500 hover:bg-[#1e355e]/10 hover:text-[#1e355e]"
                                    }`}>
                                    <Link
                                        href={item.href}
                                        className="flex flex-1 items-center gap-3 px-3 py-1.5"
                                    >
                                        <Icon size={16} />
                                        <span className={`font-bold text-[13px] ${active ? "text-white" : "text-slate-600"}`}>
                                            {item.name}
                                        </span>
                                    </Link>

                                    {/* Quick-Add Button: Separated from main Link to avoid nested <a> tags */}
                                    {active && item.name !== "Dashboard" && (
                                        <Link
                                            href={`${item.href}/new`}
                                            className="mr-2 w-5 h-5 bg-white/10 hover:bg-white/20 rounded-[3px] flex items-center justify-center transition-all active:scale-90"
                                            title={`Add New ${item.name}`}
                                        >
                                            <Plus size={12} className="text-white" />
                                        </Link>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="px-4 py-6 mt-auto">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-[3px] hover:bg-red-100 transition-all font-bold text-[13px] border border-red-100/50 active:scale-95"
                >
                    <LogOut size={16} />
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
