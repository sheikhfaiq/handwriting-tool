"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

interface Page {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
}

export default function PagesList() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch("/api/admin/pages");
            const data = await res.json();
            setPages(data);
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;

        try {
            await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
            setPages(pages.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting page:", error);
        }
    };

    if (loading) return <div>Loading pages...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Static Pages</h2>
                <Link
                    href="/admin/manage-pages/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add New Page
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Slug</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">/{page.slug}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${page.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {page.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(page.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <a
                                            href={`/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="View Live"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <Link
                                            href={`/admin/manage-pages/${page.id}`}
                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deletePage(page.id)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pages.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No pages found. Create your first page!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
