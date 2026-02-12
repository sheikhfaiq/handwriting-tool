"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/admin/Editor";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function PageForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
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
                    published: targetPublishedState
                }),
            });

            // Update local state to reflect the action taken
            setPublished(targetPublishedState);

            router.push("/admin/manage-pages");
            router.refresh();
        } catch (error) {
            console.error("Error saving page:", error);
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
                            </div>
                        </div>
                    ) : (
                        <Editor value={content} onChange={setContent} key={id} />
                    )}
                </div>

                {/* New Publishing Controls - always visible at bottom */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-xl z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        type="button"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 transition-colors disabled:opacity-50 font-medium"
                    >
                        <Save size={20} />
                        {saving && !published ? "Saving..." : "Save Draft"}
                    </button>

                    {isSystemAdmin && (
                        <>
                            {published ? (
                                <button
                                    type="button"
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                                >
                                    Unpublish
                                </button>
                            ) : null}

                            <button
                                type="button"
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 font-semibold shadow-sm ${published
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                <Eye size={20} />
                                {saving && published ? "Publishing..." : (published ? "Update Live Page" : "Publish Live")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
