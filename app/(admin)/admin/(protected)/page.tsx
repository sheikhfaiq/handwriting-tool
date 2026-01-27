import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Pages</h3>
          <p className="text-slate-600 mb-6">Manage your static pages and informational content.</p>
          <Link
            href="/admin/manage-pages"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Pages
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Posts</h3>
          <p className="text-slate-600 mb-6">Create and manage your blog posts and news.</p>
          <Link
            href="/admin/manage-posts"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
