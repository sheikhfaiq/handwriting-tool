"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/admin/Editor";
import { ArrowLeft, Save } from "lucide-react";
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

    useEffect(() => {
        if (!isNew) {
            fetchPage();
        }
    }, [id]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${id}`;
            const method = isNew ? "POST" : "PUT";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, metaDescription, published }),
            });

            router.push("/admin/manage-pages");
            router.refresh();
        } catch (error) {
            console.error("Error saving page:", error);
        } finally {
            setSaving(false);
        }
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

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
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
                    <label className="text-sm font-semibold text-slate-700">Content</label>
                    <Editor value={content} onChange={setContent} key={id} />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="published"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Publish this page (make it public)
                    </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? "Saving..." : "Save Page"}
                    </button>
                </div>
            </form>
        </div>
    );
}
