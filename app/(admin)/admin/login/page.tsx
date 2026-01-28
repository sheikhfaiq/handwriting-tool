"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  MousePointer2,
  Download,
  Settings
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative bg-white">
        <div className="w-full max-w-md space-y-12 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none shadow-sm">
              <Lock size={12} />
              Admin Access
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
              Welcome <span className="text-[#1e355e]">Back.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Sign in to manage your premium handwriting studio experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group relative">
                <label className="absolute left-4 -top-2.5 px-2 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-[#1e355e] transition-colors">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-[#1e355e]/10 focus-within:bg-white focus-within:border-[#1e355e]">
                  <Mail className="text-slate-300 group-focus-within:text-[#1e355e]" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="admin@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="absolute left-4 -top-2.5 px-2 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-[#1e355e] transition-colors">
                  Secure Password
                </label>
                <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-[#1e355e]/10 focus-within:bg-white focus-within:border-[#1e355e]">
                  <Lock className="text-slate-300 group-focus-within:text-[#1e355e]" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group/btn relative py-5 bg-[#1e355e] text-white font-black rounded-[2rem] shadow-2xl shadow-[#1e355e]/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "Authenticating..." : "Enter Studio"}
                {!loading && <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />}
              </span>
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold leading-none italic">
              <Sparkles size={14} className="text-blue-500" />
              Premium Dashboard v2.0
            </div>
          </div>
        </div>

        {/* Abstract Left Background Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-50/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Right Column: Experience Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1e355e] relative flex-col justify-center p-20 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="space-y-6">
            <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">
              Your <br />
              <span className="text-blue-400">Creative</span> <br />
              Powerhouse.
            </h2>
            <p className="text-blue-100/70 text-xl font-medium max-w-md leading-relaxed">
              Handwriting Studio empowers you to transform digital content into soulful, human-feeling masterpieces.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-md">
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#1e355e] transition-all duration-300">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-black text-lg">AI-Enhanced Strokes</h4>
                <p className="text-sm text-blue-100/50 font-medium">Naturally varying pressure and flow.</p>
              </div>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#1e355e] transition-all duration-300">
                <Download size={24} />
              </div>
              <div>
                <h4 className="font-black text-lg">Production Ready</h4>
                <p className="text-sm text-blue-100/50 font-medium">Export high-res PDF and Image sets.</p>
              </div>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#1e355e] transition-all duration-300">
                <Settings size={24} />
              </div>
              <div>
                <h4 className="font-black text-lg">Full Content Management</h4>
                <p className="text-sm text-blue-100/50 font-medium">Advanced blog and page editor included.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Floating Micro-illustration (SVG) */}
        <div className="absolute bottom-12 right-12 z-20 animate-bounce duration-[3s]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] shadow-2xl">
            <MousePointer2 className="text-blue-400" size={32} />
            <div className="mt-4 space-y-2">
              <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden leading-none">
                <div className="h-full bg-blue-400 w-2/3"></div>
              </div>
              <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
