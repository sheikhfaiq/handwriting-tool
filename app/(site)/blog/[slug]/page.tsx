import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await (prisma as any).post.findUnique({
        where: { slug: slug },
        select: { title: true, excerpt: true, metaDescription: true, coverImage: true }
    });

    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
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
            <article className="max-w-3xl mx-auto py-12 px-4">
                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-[400px] object-cover rounded-2xl mb-8 shadow-lg"
                    />
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

                <div
                    className="prose prose-slate lg:prose-lg max-w-none text-justify break-words hyphens-auto"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <a href="/blog" className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
                        ← Back to Blog
                    </a>
                </div>
            </article>
        </div>
    );
}
