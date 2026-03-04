import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FAQSection from "@/components/site/FAQSection";

export const dynamic = 'force-dynamic';

import "react-quill-new/dist/quill.snow.css";


// Revalidate every hour
export const revalidate = 3600;


import { Quote } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await (prisma as any).post.findUnique({
        where: { slug: slug },
        select: { title: true, excerpt: true, metaDescription: true, coverImage: true }
    });

    if (!post) return { title: "Post Not Found" };

    return {
        title: {
            absolute: post.title,
        },
        description: post.metaDescription || post.excerpt || `Read more about ${post.title}`,
        openGraph: {
            title: post.title,
            description: post.metaDescription || post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.metaDescription || post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        }
    };
} // Revalidate every hour

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return posts.map((post: { slug: string }) => ({
        slug: post.slug,
    }));
}

const cleanContent = (html: string) => {
    if (!html) return "";
    // Replace non-breaking spaces with normal spaces to allow wrapping
    // Remove soft hyphens to prevent weird breaks
    return html
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00AD/g, '');
};

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const post = await (prisma as any).post.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen overflow-x-hidden">
            <article className="max-w-5xl mx-auto py-12 px-4">
                {post.coverImage && (
                    <div className="mb-8 flex justify-center">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="max-h-[520px] w-auto rounded-xl shadow-md object-contain"
                        />
                    </div>
                )}
                <header className="mb-8">
                    {post.category && (
                        <span className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2 block">
                            {post.category.name}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Published on {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </p>
                </header>

                <div className="site-content-area ql-snow">
                    <div
                        className="ql-editor"
                        style={{
                            wordBreak: 'keep-all',
                            overflowWrap: 'normal',
                            hyphens: 'none'
                        }}
                        dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
                    />
                </div>

                {post.faq && Array.isArray(post.faq) && post.faq.length > 0 && (
                    <div className="mt-16">
                        <FAQSection faqs={post.faq as any} />
                    </div>
                )}

                {post.conclusion && (
                    <div className="mt-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-blue-500/5 flex items-center justify-center mb-10 border border-slate-50">
                            <Quote size={32} className="text-blue-600 rotate-180" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#1e355e] mb-10">
                            Conclusion
                        </h2>

                        <p className="text-slate-600 text-xl md:text-2xl leading-relaxed italic font-medium font-(family-name:--font-playfair)">
                            "{post.conclusion}"
                        </p>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <a href="/blog" className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
                        ← Back to Blog
                    </a>
                </div>
            </article>
        </div>
    );
}
