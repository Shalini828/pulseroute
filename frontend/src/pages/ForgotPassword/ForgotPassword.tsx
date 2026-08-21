import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary UI behavior.
    // We will connect this to the backend later.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT — PRODUCT INFORMATION */}
        <section className="hidden border-r border-slate-800 bg-slate-950 px-12 py-12 lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-xl">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <span className="text-2xl text-blue-400">ϟ</span>
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  PulseRoute
                </h1>

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                  AI Gateway Platform
                </p>
              </div>
            </div>

            {/* Main text */}
            <div className="mt-12">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Account recovery
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight text-white">
                Get back to your
                <span className="block text-blue-400">
                  AI control plane.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Enter the email associated with your PulseRoute account
                and we'll help you reset your password securely.
              </p>
            </div>

            {/* Security feature */}
            <div className="mt-10 flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Secure account recovery
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your account recovery request is handled through
                  a secure verification process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — FORM */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Back to login */}
            <Link
              to="/login"
              className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <Mail size={22} />
                </div>

                <h1 className="text-3xl font-bold text-white">
                  Forgot your password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  No worries. Enter your email address and we'll
                  send you instructions to reset your password.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Email address
                    </label>

                    <div className="relative mt-2">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-4 pl-11 text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Send reset link
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              /* SUCCESS STATE */
              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Mail size={24} />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-white">
                  Check your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  If an account exists for{" "}
                  <span className="font-medium text-slate-200">
                    {email}
                  </span>
                  , you'll receive password reset instructions.
                </p>

                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Back to login
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck size={14} />
              Secure access to your AI infrastructure
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}