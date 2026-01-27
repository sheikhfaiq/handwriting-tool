import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

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
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    });

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen overflow-x-hidden">
            <article className="max-w-4xl mx-auto py-12 px-4">
                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-[400px] object-cover rounded-2xl mb-8 shadow-lg"
                    />
                )}
                <header className="mb-8">
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
                    className="prose prose-slate lg:prose-lg max-w-none"
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
