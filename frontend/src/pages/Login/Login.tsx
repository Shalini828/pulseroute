import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  LockKeyhole,
  Route,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { loginUser } from "../../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(form);

      // Debug the backend response
      console.log("✅ Login Response:", data);

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store user
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ Stored Token:", localStorage.getItem("token"));

      alert("Login successful!");

      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Login Error:", err);

      alert(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#070d18] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
        {/* =====================================================
          LEFT — PRODUCT INFORMATION
      ====================================================== */}
        <section className="hidden w-1/2 flex-col justify-between px-10 py-10 lg:flex xl:px-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                <Zap size={22} className="text-blue-400" fill="currentColor" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">PulseRoute</h1>

                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                  AI Gateway Platform
                </p>
              </div>
            </div>
          </div>

          {/* Main product introduction */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs font-medium text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Intelligent AI Infrastructure
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              One gateway.
              <br />
              <span className="text-blue-400">Every AI provider.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
              Route, monitor, and optimize AI requests across multiple providers
              from a single control plane built for modern AI applications.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Route size={18} className="text-blue-400" />
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  Smart Routing
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Route requests across connected AI providers.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Activity size={18} className="text-emerald-400" />
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  Real-time Monitoring
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Track latency, requests, and system health.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                  <BarChart3 size={18} className="text-purple-400" />
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  Advanced Analytics
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Understand usage and provider performance.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <ShieldCheck size={18} className="text-amber-400" />
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  Secure Gateway
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Centralized API authentication and access control.
                </p>
              </div>
            </div>

            {/* Provider strip */}
            <div className="mt-7 flex items-center gap-3 text-xs text-slate-500">
              <span>Connected ecosystem</span>

              <span className="text-slate-700">•</span>

              <span className="font-medium text-slate-400">Gemini</span>

              <span className="text-slate-700">•</span>

              <span className="font-medium text-slate-400">OpenAI</span>

              <span className="text-slate-700">•</span>

              <span className="font-medium text-slate-400">Groq</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} PulseRoute AI Gateway
          </div>
        </section>

        {/* =====================================================
          RIGHT — LOGIN
      ====================================================== */}
        <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 lg:w-1/2 lg:border-l lg:border-slate-800/70 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                <Zap size={20} className="text-blue-400" fill="currentColor" />
              </div>

              <div>
                <p className="font-bold text-white">PulseRoute</p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
                  AI Gateway Platform
                </p>
              </div>
            </div>

            {/* Login heading */}
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                <LockKeyhole size={19} className="text-blue-400" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your PulseRoute control plane.
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/10"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">
                      Password
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-4 pr-12 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
 <Link
  to="/forgot-password"
  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
>
  Forgot password?
</Link>
</div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-600">
              <LockKeyhole size={13} />
              Secure access to your AI infrastructure
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
