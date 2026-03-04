import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FAQSection from "@/components/site/FAQSection";
import { Quote } from "lucide-react";
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
        title: {
            absolute: page.title,
        },
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

const cleanContent = (html: string) => {
    if (!html) return "";
    // Replace non-breaking spaces with normal spaces to allow wrapping
    // Remove soft hyphens to prevent weird breaks
    return html
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00AD/g, '');
};

export default async function StaticPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const page = await prisma.page.findUnique({
        where: { slug: params.slug },
    });

    if (!page || !page.published) {
        notFound();
    }

    const pageAny = page as any;

    return (
        <div className="bg-[#fdfbf7] min-h-screen overflow-x-hidden">
            <article className="max-w-5xl mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-slate-900 border-b border-slate-200 pb-4">
                    {page.title}
                </h1>

                {/* Use ql-snow and ql-editor to exactly match the admin editor rendering */}
                <div className="site-content-area ql-snow">
                    <div
                        className="ql-editor"
                        style={{
                            wordBreak: 'keep-all',
                            overflowWrap: 'normal',
                            hyphens: 'none'
                        }}
                        dangerouslySetInnerHTML={{ __html: cleanContent(page.content) }}
                    />
                </div>

                {pageAny.faq && Array.isArray(pageAny.faq) && pageAny.faq.length > 0 && (
                    <div className="mt-16">
                        <FAQSection faqs={pageAny.faq as any} />
                    </div>
                )}

                {pageAny.conclusion && (
                    <div className="mt-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-blue-500/5 flex items-center justify-center mb-10 border border-slate-50">
                            <Quote size={32} className="text-blue-600 rotate-180" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#1e355e] mb-10">
                            Conclusion
                        </h2>

                        <p className="text-slate-600 text-xl md:text-2xl leading-relaxed italic font-medium font-(family-name:--font-playfair)">
                            "{pageAny.conclusion}"
                        </p>
                    </div>
                )}
            </article>
        </div>
    );
}
