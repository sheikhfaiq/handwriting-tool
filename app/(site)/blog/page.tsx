import prisma from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 3600;

export default async function BlogListPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-white min-h-screen py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Title */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-black text-[#1e355e] tracking-tight">Latest</h1>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col space-y-4"
                        >
                            {/* Category Label */}
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff5a5f]">
                                {post.category || "Announcements"}
                            </span>

                            {/* Image Container with Custom Rounded Corners */}
                            <div className="relative aspect-[3/2] overflow-hidden rounded-[2.5rem] bg-gray-100">
                                {post.coverImage ? (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#1e355e]/5 text-[#1e355e]/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Title with Serif feel and Brand Color */}
                            <div className="space-y-4 pt-2">
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight text-[#1e355e] group-hover:text-blue-500 transition-colors">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-gray-500 text-sm line-clamp-2 font-medium mt-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                                <div className="inline-flex items-center text-sm font-bold text-[#1e355e] border-b-2 border-[#FBC02D] pb-0.5 group-hover:text-blue-600 transition-colors">
                                    Read Article
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="text-center py-32 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">✍️</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1e355e]">No Posts Yet</h3>
                        <p className="text-gray-400 mt-2">Check back soon for new announcements!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
