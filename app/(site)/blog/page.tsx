import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: {
        absolute: "Blog",
    },
    description: "Read the latest news and updates from Text To Handwriting.",
};

export default async function BlogListPage() {
    const posts = await (prisma as any).post.findMany({
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-[#f8fafc] min-h-screen py-24 px-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header Title with localized gradient */}
                <div className="text-center mb-24 space-y-4">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
                        The <span className="text-blue-600">Journal</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Insights, updates, and stories from the world of digital handwriting.
                    </p>
                </div>

                {/* Posts Grid with Perspective */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 perspective-1000">
                    {posts.map((post: any) => (
                        <div
                            key={post.id}
                            className="group relative h-full flex flex-col"
                        >
                            <Link href={`/blog/${post.slug}`} className="cursor-pointer flex flex-col h-full">
                                {/* 3D Card Container */}
                                <div className="relative flex flex-col h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(5deg)_rotateY(-5deg)] group-hover:-translate-y-4">

                                    {/* Image with 3D depth */}
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-20 transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] bg-white border border-slate-100">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Dynamic Category Badge - Floating */}
                                        <div className="absolute top-6 left-6 z-30">
                                            <span className="bg-white/90 backdrop-blur-md text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/50">
                                                {post.category?.name || "Uncategorized"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content with Depth */}
                                    <div className="flex flex-col flex-1 pt-8 px-2 transition-all duration-500 [transform:translateZ(30px)]">
                                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h2>

                                        {post.excerpt && (
                                            <p className="text-slate-500 text-base font-medium line-clamp-3 mb-6 flex-1">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Premium Rounded Button */}
                                        <div className="mt-auto">
                                            <div className="inline-flex items-center gap-2 bg-[#1e355e] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl transition-all duration-300 group-hover:bg-[#2a4a82] group-hover:scale-105 group-hover:shadow-[#1e355e]/30">
                                                Read Article
                                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="text-center py-32 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                        <div className="w-24 h-24 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-50">
                            <span className="text-5xl">🎨</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Waiting for inspiration...</h3>
                        <p className="text-slate-400 mt-3 font-medium">Stories and updates are coming soon. Stay tuned!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
