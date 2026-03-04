"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/admin/Editor";
import { ArrowLeft, Save, Eye, Plus, Trash2, HelpCircle, FileText, Quote } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import FAQSection from "@/components/site/FAQSection";
import { toast } from "react-hot-toast";

export default function PageForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isSystemAdmin, setIsSystemAdmin] = useState(false);

    useEffect(() => {
        checkSession();
        if (!isNew) {
            fetchPage();
        }
    }, [id]);

    const checkSession = async () => {
        const session = await getSession();
        if (session?.user?.email === "admin@gmail.com") {
            setIsSystemAdmin(true);
        }
    };

    const fetchPage = async () => {
        try {
            const res = await fetch(`/api/admin/pages/${id}`);
            const data = await res.json();
            setTitle(data.title);
            setContent(data.content);
            setMetaDescription(data.metaDescription || "");
            setConclusion(data.conclusion || "");
            setFaqs(Array.isArray(data.faq) ? data.faq : []);
            setPublished(data.published);
        } catch (error) {
            console.error("Error fetching page:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (targetPublishedState: boolean) => {
        setSaving(true);

        try {
            const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${id}`;
            const method = isNew ? "POST" : "PUT";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    metaDescription,
                    conclusion,
                    faq: faqs,
                    published: targetPublishedState
                }),
            });

            // Update local state to reflect the action taken
            setPublished(targetPublishedState);

            toast.success(isNew ? "Page created successfully!" : "Page updated successfully!");

            router.push("/admin/manage-pages");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving page:", error);
            toast.error(error.message || "Failed to save page.");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Default action for Enter key in form... usually save as draft unless published?
        // Better to disable standard submit and rely on buttons.
        handleSave(false); // Default to draft if forced
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/manage-pages"
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">
                    {isNew ? "Create New Page" : "Edit Page"}
                </h2>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Page Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g., About Us"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Meta Description (SEO)</label>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                        placeholder="SEO meta description (150-160 characters recommended)..."
                        maxLength={160}
                    />
                    <p className="text-xs text-slate-400">{metaDescription.length}/160 characters</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Content</label>
                        <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`text-sm px-3 py-1 rounded-full transition-colors ${previewMode
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {previewMode ? "👁️ Live Preview Mode: ON" : "👁️ Enable Live Preview"}
                        </button>
                    </div>

                    {previewMode ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4 sm:p-8">
                            <div className="text-xs text-center text-slate-400 mb-4 uppercase tracking-widest font-semibold">
                                Live Site Preview (Max Width: 5XL)
                            </div>
                            {/* Wrapper to mimic live site structure perfectly */}
                            <div className="bg-[#fdfbf7] p-8 md:p-12 shadow-sm border border-slate-200 rounded-xl mx-auto max-w-5xl site-content-area">
                                <Editor
                                    value={content}
                                    onChange={setContent}
                                    key={`preview-${id}`}
                                    placeholder="Write your content here..."
                                    className="!bg-transparent !border-none !shadow-none"
                                />

                                {faqs.length > 0 && (
                                    <div className="mt-16">
                                        <FAQSection faqs={faqs} />
                                    </div>
                                )}

                                {conclusion && (
                                    <div className="mt-10 flex flex-col items-center text-center max-w-4xl mx-auto pb-12">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-blue-500/5 flex items-center justify-center mb-10 border border-slate-50">
                                            <Quote size={32} className="text-blue-600 rotate-180" />
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-bold text-[#1e355e] mb-10">
                                            Conclusion
                                        </h2>

                                        <p className="text-slate-600 text-xl md:text-2xl leading-relaxed italic font-medium font-(family-name:--font-playfair)">
                                            "{conclusion}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Editor value={content} onChange={setContent} key={id} />
                    )}
                </div>

                {/* FAQ Section */}
                <div className="space-y-4 pt-16 border-t border-slate-100 mt-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <HelpCircle size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h3>
                                <p className="text-xs text-slate-400 font-medium">Add questions and answers for your readers</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                            className="bg-[#1e355e] text-white px-4 py-1.5 rounded-[3px] hover:bg-blue-700 transition-all flex items-center gap-2 text-xs font-bold shadow-md shadow-blue-900/10 active:scale-95"
                        >
                            <Plus size={14} />
                            Add New FAQ
                        </button>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50 relative group">
                                <button
                                    type="button"
                                    onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="space-y-2 pr-8">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question {index + 1}</label>
                                    <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => {
                                            const newFaqs = [...faqs];
                                            newFaqs[index].question = e.target.value;
                                            setFaqs(newFaqs);
                                        }}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                                        placeholder="Enter the question..."
                                    />
                                </div>
                                <div className="space-y-2 pr-8">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Answer {index + 1}</label>
                                    <textarea
                                        value={faq.answer}
                                        onChange={(e) => {
                                            const newFaqs = [...faqs];
                                            newFaqs[index].answer = e.target.value;
                                            setFaqs(newFaqs);
                                        }}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm h-24 resize-none"
                                        placeholder="Enter the answer..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conclusion Section */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-800">Conclusion</h3>
                    </div>
                    <div className="space-y-2">
                        <textarea
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                            placeholder="Write a final summary or conclusion for this page..."
                        />
                    </div>
                </div>

                {/* New Publishing Controls - always visible at bottom */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-xl z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        type="button"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2 rounded-[3px] flex items-center gap-2 hover:bg-slate-100 transition-all disabled:opacity-50 font-bold text-sm active:scale-95"
                    >
                        <Save size={18} />
                        {saving && !published ? "Saving..." : "Save Draft"}
                    </button>

                    {isSystemAdmin && (
                        <>
                            {published ? (
                                <button
                                    type="button"
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="bg-red-50 text-red-600 border border-red-100 px-5 py-2 rounded-[3px] flex items-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50 font-bold text-sm active:scale-95"
                                >
                                    Unpublish
                                </button>
                            ) : null}

                            <button
                                type="button"
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className={`px-5 py-2 rounded-[3px] flex items-center gap-2 transition-all disabled:opacity-50 font-bold text-sm shadow-md active:scale-95 ${published
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-[#1e355e] text-white hover:bg-blue-700"
                                    }`}
                            >
                                <Eye size={18} />
                                {saving && published ? "Publishing..." : (published ? "Update Live Page" : (isNew ? "Create Page" : "Publish Live"))}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
