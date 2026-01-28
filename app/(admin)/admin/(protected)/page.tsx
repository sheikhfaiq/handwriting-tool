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
  Calendar,
  MousePointer2
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
    { label: "Total Pages", value: pageCount, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Blog Posts", value: postCount, icon: Rss, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Categories", value: categoryCount, icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Full Menus", value: menuCount, icon: MenuIcon, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const quickActions = [
    { name: "Write New Post", href: "/admin/manage-posts/new", icon: Plus, desc: "Draft a new blog story" },
    { name: "Create Page", href: "/admin/manage-pages/new", icon: FileText, desc: "Add a new static page" },
    { name: "Add Category", href: "/admin/manage-categories/new", icon: Layers, desc: "Organize your content" },
    { name: "Configure Menu", href: "/admin/manage-menus", icon: MenuIcon, desc: "Update site navigation" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome Back, <span className="text-[#1e355e]">Admin</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here's what's happening with your studio today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black italic">
                <TrendingUp size={12} />
                +12%
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Insights - CSS Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
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
        <div className="bg-[#1e355e] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-[#1e355e]/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <h3 className="text-xl font-black mb-6 relative z-10">Quick Launch</h3>
          <div className="grid grid-cols-1 gap-3 relative z-10">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white hover:text-[#1e355e] transition-all duration-300 group/btn"
              >
                <div className="p-2 bg-white/10 rounded-xl group-hover/btn:bg-[#1e355e]/10">
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
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900">Recent Content Updates</h3>
          <Link href="/admin/manage-posts" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all activity <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-4 pb-2">Content Title</th>
                <th className="px-4 pb-2">Category</th>
                <th className="px-4 pb-2">Updated</th>
                <th className="px-4 pb-2">Status</th>
                <th className="px-4 pb-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.length > 0 ? recentPosts.map((post: any) => (
                <tr key={post.id} className="group hover:scale-[1.01] transition-transform">
                  <td className="bg-slate-50/50 px-4 py-4 rounded-l-2xl border-l-4 border-transparent group-hover:border-[#1e355e] transition-all">
                    <div className="font-bold text-slate-900 truncate max-w-[200px]">{post.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="bg-slate-50/50 px-4 py-4">
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-blue-600 border border-blue-50">
                      {post.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="bg-slate-50/50 px-4 py-4 text-xs font-bold text-slate-500">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="bg-slate-50/50 px-4 py-4">
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${post.published ? 'text-emerald-500' : 'text-orange-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`}></div>
                      {post.published ? 'Live' : 'Draft'}
                    </div>
                  </td>
                  <td className="bg-slate-50/50 px-4 py-4 rounded-r-2xl text-right">
                    <Link href={`/admin/manage-posts/${post.id}`} className="text-slate-400 hover:text-[#1e355e] transition-colors">
                      <MousePointer2 size={18} />
                    </Link>
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
