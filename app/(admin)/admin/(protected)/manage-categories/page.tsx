"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Inbox } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        posts: number;
    };
}

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Category "${name}" will be permanently deleted!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.error || "Failed to delete category");
                    return;
                }

                setCategories(categories.filter((c) => c.id !== id));
                toast.success("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("An error occurred while deleting the category.");
            }
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Blog Categories</h2>
                <Link
                    href="/admin/manage-categories/new"
                    className="bg-[#1e355e] text-white px-3.5 py-1.5 rounded-[3px] flex items-center gap-2 hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-900/10 active:scale-95"
                >
                    <Plus size={16} />
                    Add New Category
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Slug</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Posts</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{category.name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {category.slug}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-[3px] text-xs font-semibold">
                                        {category._count?.posts || 0} posts
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/manage-categories/${category.id}`}
                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-[3px] transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteCategory(category.id, category.name)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-[3px] transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Inbox className="w-8 h-8 opacity-20" />
                                        <span>No categories found. Add your first category!</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
