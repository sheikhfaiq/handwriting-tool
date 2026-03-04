"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";
import { toast } from "react-hot-toast";

export default function CategoryForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const res = await fetch(`/api/admin/categories/${id}`);
            const data = await res.json();
            setName(data.name);
            setSlug(data.slug);
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew ? "/api/admin/categories" : `/api/admin/categories/${id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    slug: slug || slugify(name, { lower: true, strict: true })
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save category");
            }

            toast.success(isNew ? "Category created successfully!" : "Category updated successfully!");

            router.push("/admin/manage-categories");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving category:", error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/manage-categories"
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold text-slate-800">
                    {isNew ? "Create New Category" : "Edit Category"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                        placeholder="e.g., Handwriting Tips"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-600 font-mono"
                        placeholder="auto-generated-from-name"
                    />
                    <p className="text-xs text-slate-400">Leave empty to auto-generate from name.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#1e355e] text-white px-5 py-2 rounded-[3px] hover:bg-blue-700 transition-all font-bold text-sm shadow-md shadow-blue-900/10 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : (isNew ? "Create Category" : "Save Category")}
                    </button>
                </div>
            </form>
        </div>
    );
}
