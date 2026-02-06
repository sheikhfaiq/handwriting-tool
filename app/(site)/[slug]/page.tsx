import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug: slug },
        select: { title: true, metaDescription: true }
    });

    if (!page) return { title: "Page Not Found" };

    return {
        title: page.title,
        description: page.metaDescription || `Read more about ${page.title}`,
        openGraph: {
            title: page.title,
            description: page.metaDescription || `Read more about ${page.title}`,
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.metaDescription || `Read more about ${page.title}`,
        }
    };
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
            <article className="max-w-3xl mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-slate-900 border-b border-slate-200 pb-4">
                    {page.title}
                </h1>

                {/* Use ql-snow and ql-editor to exactly match the admin editor rendering */}
                <div className="site-content-area ql-snow">
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </article>
        </div>
    );
}
