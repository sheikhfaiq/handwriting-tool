"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Camera, Eye } from "lucide-react";

interface Post {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    coverImage?: string;
    category?: {
        name: string;
    };
}

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
            setPosts(posts.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (loading) return <div>Loading posts...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Blog Posts</h2>
                <Link
                    href="/admin/manage-posts/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add New Post
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Cover</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    {post.coverImage ? (
                                        <img src={post.coverImage} alt="" className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                                            <Camera size={20} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{post.title}</div>
                                    <div className="text-slate-400 text-xs font-mono">/blog/{post.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {post.category ? (
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                            {post.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">Uncategorized</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <a
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="View Live"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <Link
                                            href={`/admin/manage-posts/${post.id}`}
                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No posts found. Write your first blog post!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
