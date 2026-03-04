import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  FileText,
  Rss,
  Layers,
  Menu as MenuIcon,
  Plus,
  ArrowRight,
  TrendingUp,
  MousePointer2,
  Edit2,
  Trash2,
  Eye,
  Loader2
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch stats with defensive type casting
  const [pageCount, postCount, categoryCount, menuCount, categories, recentPosts] = await Promise.all([
    (prisma as any).page.count(),
    (prisma as any).post.count(),
    (prisma as any).category.count(),
    (prisma as any).menu.count(),
    (prisma as any).category.findMany({
      include: { _count: { select: { posts: true } } },
      take: 5
    }),
    (prisma as any).post.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { category: true }
    })
  ]);

  const stats = [
    { label: "Total Pages", value: pageCount, icon: FileText, color: "text-blue-600", accent: "bg-blue-600", bg: "bg-blue-50", href: "/admin/manage-pages" },
    { label: "Blog Posts", value: postCount, icon: Rss, color: "text-indigo-600", accent: "bg-indigo-600", bg: "bg-indigo-50", href: "/admin/manage-posts" },
    { label: "Categories", value: categoryCount, icon: Layers, color: "text-emerald-600", accent: "bg-emerald-600", bg: "bg-emerald-50", href: "/admin/manage-categories" },
    { label: "Full Menus", value: menuCount, icon: MenuIcon, color: "text-orange-600", accent: "bg-orange-600", bg: "bg-orange-50", href: "/admin/manage-menus" },
  ];

  const quickActions = [
    { name: "Write New Post", href: "/admin/manage-posts/new", icon: Plus, desc: "Draft a new blog story" },
    { name: "Create Page", href: "/admin/manage-pages/new", icon: FileText, desc: "Add a new static page" },
    { name: "Add Category", href: "/admin/manage-categories/new", icon: Layers, desc: "Organize your content" },
    { name: "Configure Menu", href: "/admin/manage-menus", icon: MenuIcon, desc: "Update site navigation" },
  ];

  return (
    <div className="p-6 pt-1 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Header Section */}
      <div className="flex border-b border-slate-50 pb-2">
        <h1 className="text-xl font-bold text-[#1e355e] tracking-tight flex items-center gap-2">
          <div className="w-1 h-5 bg-[#1e355e] rounded-full"></div>
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Grid - Fixed Icons & Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 fill-mode-both block"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* High-End Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 pointer-events-none"></div>

            <div className="flex flex-col justify-between h-full relative z-10">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 group-hover:text-slate-500 transition-colors">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform duration-500 origin-left">{stat.value}</div>
              </div>
            </div>

            {/* Boxed Icon - Static classes for reliability */}
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 ${stat.accent} rounded-[3px] flex items-center justify-center transform rotate-6 shadow-lg shadow-indigo-900/10 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500`}>
              <stat.icon size={26} className="text-white group-hover:animate-pulse" />
            </div>

            {/* Hover bottom border - Fixed JIT issue */}
            <div className={`absolute bottom-0 left-0 h-1 ${stat.accent} w-0 group-hover:w-full transition-all duration-500`}></div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Insights - CSS Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Content Distribution</h3>
              <p className="text-slate-400 text-sm font-medium">Posts across your top categories</p>
            </div>
            <Layers className="text-slate-200" size={32} />
          </div>
          <div className="space-y-6">
            {categories.length > 0 ? categories.map((cat: any, i: number) => {
              const percentage = postCount > 0 ? (cat._count.posts / postCount) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-2 group">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700 group-hover:text-[#1e355e] transition-colors">{cat.name}</span>
                    <span className="text-slate-400">{cat._count.posts} posts</span>
                  </div>
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1e355e] to-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(percentage, 5)}%`, transitionDelay: `${i * 100}ms` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-12 text-center text-slate-400 font-medium italic">No category data available yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[#1e355e] p-8 rounded-3xl text-white shadow-xl shadow-[#1e355e]/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <h3 className="text-xl font-black mb-6 relative z-10">Quick Launch</h3>
          <div className="grid grid-cols-1 gap-3 relative z-10">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-4 p-4 bg-white/10 rounded-[3px] hover:bg-white hover:text-[#1e355e] transition-all duration-300 group/btn"
              >
                <div className="p-2 bg-white/10 rounded-[3px] group-hover/btn:bg-[#1e355e]/10">
                  <action.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black">{action.name}</div>
                  <div className="text-[10px] opacity-60 font-medium group-hover/btn:opacity-100">{action.desc}</div>
                </div>
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Activity Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900">Recent Content Updates</h3>
          <Link href="/admin/manage-posts" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all activity <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-4 pb-2">Content Title</th>
                <th className="px-4 pb-2">Category</th>
                <th className="px-4 pb-2">Updated</th>
                <th className="px-4 pb-2">Status</th>

              </tr>
            </thead>
            <tbody>
              {recentPosts.length > 0 ? recentPosts.map((post: any) => (
                <tr key={post.id} className="group transition-all">
                  <td className="bg-slate-50/50 px-4 py-3 rounded-l-[3px] border-l-2 border-transparent group-hover:border-[#1e355e] transition-all">
                    <div className="font-bold text-slate-900 truncate max-w-[250px]">{post.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="bg-slate-50/50 px-4 py-3">
                    <span className="bg-white px-2 py-1 rounded-[3px] text-[10px] font-black text-blue-600 border border-blue-50">
                      {post.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="bg-slate-50/50 px-4 py-3 text-xs font-bold text-slate-500 font-mono">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="bg-slate-50/50 px-4 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[3px] text-[9px] font-black uppercase ${post.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                      <div className={`w-1 h-1 rounded-full ${post.published ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                      {post.published ? 'Live' : 'Draft'}
                    </div>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium italic">No recent activity detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
