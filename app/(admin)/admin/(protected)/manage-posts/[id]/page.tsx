"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/admin/Editor";
import { ArrowLeft, Save, Image as ImageIcon, Upload, Loader2, Eye } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function PostForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isSystemAdmin, setIsSystemAdmin] = useState(false);

    useEffect(() => {
        checkSession();
        fetchCategories();
        if (!isNew) {
            fetchPost();
        }
    }, [id]);

    const checkSession = async () => {
        const session = await getSession();
        if (session?.user?.email === "admin@gmail.com") {
            setIsSystemAdmin(true);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/admin/posts/${id}`, { cache: "no-store" });
            const data = await res.json();
            setTitle(data.title);
            setSlug(data.slug || "");
            setCategoryId(data.categoryId || "");
            setContent(data.content);
            setExcerpt(data.excerpt || "");
            setMetaDescription(data.metaDescription || "");
            setCoverImage(data.coverImage || "");
            setPublished(data.published);
        } catch (error) {
            console.error("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await res.json();
            if (data.url) {
                setCoverImage(data.url);
            }
        } catch (error: any) {
            console.error("Upload failed:", error);
            alert(error.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (targetPublishedState: boolean) => {
        setSaving(true);

        try {
            const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug,
                    categoryId,
                    content,
                    excerpt,
                    metaDescription,
                    coverImage,
                    published: targetPublishedState
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save post");
            }

            // Update local state
            setPublished(targetPublishedState);

            router.push("/admin/manage-posts");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving post:", error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/manage-posts"
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">
                    {isNew ? "Create New Post" : "Edit Post"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Post Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg text-slate-900"
                        placeholder="e.g., How to use the Handwriting Tool"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-600 font-mono"
                            placeholder="auto-generated-from-title"
                        />
                        <p className="text-xs text-slate-400">Leave empty to auto-generate from title.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
                        >
                            <option value="">Uncategorized</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Excerpt (Short Summary)</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                        placeholder="A brief summary of your post..."
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

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Cover Image</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                placeholder="https://example.com/image.jpg or upload..."
                            />
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border border-slate-200">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploading ? "Uploading..." : "Upload"}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        {coverImage && (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 h-32">
                                <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage("")}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ArrowLeft size={14} className="rotate-45" />
                                </button>
                            </div>
                        )}
                    </div>
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
            </form>
        </div>
    );
}
