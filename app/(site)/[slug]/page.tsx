import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
    const pages = await prisma.page.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return pages.map((page: { slug: string }) => ({
        slug: page.slug,
    }));
}

export default async function StaticPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const page = await prisma.page.findUnique({
        where: { slug: params.slug },
    });

    if (!page || !page.published) {
        notFound();
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen overflow-x-hidden">
            <article className="max-w-3xl mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold mb-8 text-slate-900 border-b border-slate-200 pb-4">
                    {page.title}
                </h1>
                <div
                    className="prose prose-slate lg:prose-lg max-w-none text-justify break-words hyphens-auto
                           prose-img:rounded-xl prose-img:my-8 
                           prose-h2:font-bold prose-h2:text-slate-800 prose-h2:mt-10"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </article>
        </div>
    );
}
