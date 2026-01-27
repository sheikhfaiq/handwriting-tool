"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
        >
          Secure Login
        </button>
      </form>
    </div>
  );
}
