import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Code2,
  Cpu,
  GitBranch,
  Globe2,
  KeyRound,
  Lock,
  Menu,
  Network,
  Route,
  Server,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  details: string;
  icon: ReactNode;
  capabilities: string[];
};

const features: Feature[] = [
  {
    title: "Smart Routing",
    description:
      "Route every request to the best-performing AI provider using intelligent routing logic.",
    details:
      "PulseRoute acts as a single control plane between your application and multiple AI providers. Instead of hard-coding a provider into your application, requests can be routed according to latency, availability and routing policies.",
    icon: <Route size={23} />,
    capabilities: [
      "Latency-aware routing",
      "Provider-based routing",
      "Automatic provider selection",
      "Single unified gateway",
    ],
  },
  {
    title: "Automatic Failover",
    description:
      "Keep your application reliable with automatic retries and backup providers.",
    details:
      "If a provider becomes unavailable or a request fails, PulseRoute can retry the request or redirect traffic toward another connected provider.",
    icon: <GitBranch size={23} />,
    capabilities: [
      "Automatic retries",
      "Provider health checks",
      "Backup providers",
      "Failure recovery",
    ],
  },
  {
    title: "Real-time Monitoring",
    description:
      "Track requests, latency, errors and provider health from one centralized dashboard.",
    details:
      "Every request moving through the gateway can be monitored so developers can understand traffic, response times, failures and provider health without switching between multiple provider dashboards.",
    icon: <Activity size={23} />,
    capabilities: [
      "Request monitoring",
      "Latency tracking",
      "Error tracking",
      "Provider health",
    ],
  },
  {
    title: "Advanced Analytics",
    description:
      "Understand usage, performance, traffic patterns and infrastructure costs.",
    details:
      "PulseRoute transforms gateway traffic into actionable analytics. Compare providers, analyze request patterns and understand how your AI infrastructure is performing.",
    icon: <BarChart3 size={23} />,
    capabilities: [
      "Usage analytics",
      "Traffic analysis",
      "Provider comparison",
      "Performance insights",
    ],
  },
  {
    title: "Secure Gateway",
    description:
      "Centralize authentication, API key management and access control.",
    details:
      "Applications communicate with one gateway instead of exposing provider credentials throughout the application stack. PulseRoute provides a centralized layer for authentication and provider access.",
    icon: <Shield size={23} />,
    capabilities: [
      "API key authentication",
      "Centralized access control",
      "Provider credential isolation",
      "Secure gateway architecture",
    ],
  },
];

function FeatureCard({
  feature,
  onClick,
  featured = false,
}: {
  feature: Feature;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "border-blue-500/40 bg-gradient-to-b from-blue-500/[0.08] to-[#080f20]"
          : "border-white/[0.08] bg-[#080f20]"
      } hover:border-blue-500/40 hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.08] text-blue-400 transition-all duration-300 group-hover:border-blue-500/40 group-hover:bg-blue-500/15 group-hover:text-cyan-300">
        {feature.icon}
      </div>

      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>

      <p className="mt-4 min-h-[84px] text-sm leading-7 text-slate-400">
        {feature.description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-400 transition group-hover:text-cyan-300">
        Explore feature
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}

function FeatureModal({
  feature,
  onClose,
}: {
  feature: Feature;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-blue-500/20 bg-[#070d1c] shadow-[0_0_100px_rgba(37,99,235,0.18)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="p-7 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            {feature.icon}
          </div>

          <h2 className="mt-7 text-3xl font-bold text-white">
            {feature.title}
          </h2>

          <p className="mt-3 text-base leading-7 text-slate-400">
            {feature.description}
          </p>

          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              <Sparkles size={15} />
              How it works
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {feature.details}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Capabilities
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {feature.capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <Check size={14} />
                  </span>

                  <span className="text-sm text-slate-300">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ProviderNode({
  name,
  latency,
  icon,
}: {
  name: string;
  latency: string;
  icon: ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#091225]/95 px-5 py-5 shadow-2xl backdrop-blur transition hover:border-blue-500/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-slate-300">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{name}</p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] text-slate-500">{latency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-20%] top-[-15%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.08] blur-[140px]" />
        <div className="absolute right-[-15%] top-[20%] h-[550px] w-[550px] rounded-full bg-indigo-600/[0.08] blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-[130px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-3"
            onClick={() => scrollTo("top")}
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-blue-500/30 bg-[#081329] shadow-[0_0_25px_rgba(37,99,235,0.15)]">
              <img
                src="/pulseroute-logo.png"
                alt="PulseRoute"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div>
              <h1 className="text-[18px] font-bold tracking-tight">
                PulseRoute
              </h1>

              <p className="text-[9px] font-semibold tracking-[0.3em] text-blue-400">
                AI GATEWAY PLATFORM
              </p>
            </div>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            <button
              onClick={() => scrollTo("features")}
              className="flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
            >
              Product
              <ChevronDown size={13} />
            </button>

            <button
              onClick={() => scrollTo("features")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </button>

            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </button>

            <button
              onClick={() => scrollTo("providers")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Providers
            </button>

            <button
              onClick={() => scrollTo("pricing")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Pricing
            </button>

            <button
              onClick={() => scrollTo("docs")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Docs
            </button>

            <button className="flex items-center gap-1 text-sm text-slate-400 transition hover:text-white">
              Resources
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Right */}
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="/login"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign in
            </a>

            <a
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
            >
              Get started
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.06] bg-[#050a17] px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-2">
              {[
                ["Features", "features"],
                ["How it works", "how-it-works"],
                ["Providers", "providers"],
                ["Pricing", "pricing"],
                ["Docs", "docs"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}

              <a
                href="/login"
                className="mt-2 rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-slate-300"
              >
                Sign in
              </a>

              <a
                href="/register"
                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold"
              >
                Get started →
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}
      <main id="top">
        <section className="relative border-b border-white/[0.06]">
          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
              backgroundSize: "58px 58px",
              maskImage:
                "radial-gradient(circle at center, black 0%, transparent 75%)",
            }}
          />

          <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.06] px-4 py-2 text-sm text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                Intelligent AI Infrastructure
              </div>

              <h2 className="mt-8 max-w-2xl text-[52px] font-bold leading-[0.98] tracking-[-0.045em] sm:text-[64px] lg:text-[72px]">
                One gateway.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Every AI
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  provider.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Route, monitor, and optimize AI requests across multiple
                providers from one powerful control plane built for modern AI
                applications.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/register"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold shadow-xl shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                >
                  Start building
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>

                <button
                  onClick={() => scrollTo("docs")}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/30 hover:bg-blue-500/[0.05]"
                >
                  <Code2 size={16} />
                  View documentation
                </button>
              </div>

              {/* Trust */}
              <div className="mt-9">
                <p className="text-xs text-slate-600">
                  Trusted by developers building the future
                </p>

                <div className="mt-3 flex items-center">
                  {["S", "A", "R", "K", "M", "P", "N"].map((letter, i) => (
                    <div
                      key={letter}
                      className={`-ml-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#030712] bg-gradient-to-br ${
                        i % 2 === 0
                          ? "from-blue-500 to-violet-500"
                          : "from-cyan-500 to-blue-600"
                      } text-[10px] font-bold`}
                    >
                      {letter}
                    </div>
                  ))}

                  <span className="ml-3 rounded-full border border-blue-500/25 bg-blue-500/[0.05] px-3 py-1.5 text-xs font-medium text-blue-400">
                    +2.5k
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT GATEWAY VISUAL */}
            <div className="relative mx-auto h-[560px] w-full max-w-[650px]">
              {/* glow */}
              <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />

              {/* particle dots */}
              {[
                ["14%", "30%", "bg-cyan-400"],
                ["78%", "23%", "bg-violet-400"],
                ["85%", "57%", "bg-blue-400"],
                ["20%", "68%", "bg-blue-400"],
                ["48%", "78%", "bg-cyan-400"],
                ["70%", "78%", "bg-violet-400"],
              ].map(([left, top, color], index) => (
                <span
                  key={index}
                  className={`absolute h-1.5 w-1.5 rounded-full ${color} opacity-80 shadow-[0_0_12px_currentColor]`}
                  style={{ left, top }}
                />
              ))}

              {/* Application */}
              <div className="absolute left-1/2 top-5 flex w-[220px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-blue-500/20 bg-[#091225]/95 px-5 py-4 shadow-2xl backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Cpu size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Your Application
                  </p>
                  <p className="text-xs text-slate-500">API Client</p>
                </div>
              </div>

              {/* line application -> gateway */}
              <div className="absolute left-1/2 top-[105px] h-[85px] w-px -translate-x-1/2 bg-gradient-to-b from-blue-400/60 to-cyan-400/20" />

              <div className="absolute left-1/2 top-[180px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

              {/* Gateway */}
              <div className="absolute left-1/2 top-[195px] w-[320px] -translate-x-1/2 rounded-3xl border border-blue-500/70 bg-[#091329]/95 p-6 shadow-[0_0_55px_rgba(37,99,235,0.18)] backdrop-blur-xl">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/25">
                    <Zap size={25} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-xl font-bold text-white">PulseRoute</p>
                    <p className="text-xs text-slate-500">AI Gateway</p>
                  </div>
                </div>

                <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  Gateway operational
                </div>
              </div>

              {/* branching lines */}
              <div className="absolute left-1/2 top-[355px] h-[65px] w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/60 to-transparent" />

              <div className="absolute left-[20%] top-[385px] h-px w-[30%] rotate-[18deg] bg-gradient-to-r from-transparent via-blue-500/50 to-blue-500/10" />

              <div className="absolute right-[20%] top-[385px] h-px w-[30%] -rotate-[18deg] bg-gradient-to-r from-blue-500/10 via-blue-500/50 to-transparent" />

              {/* Provider cards */}
              <div className="absolute bottom-8 left-1/2 grid w-full -translate-x-1/2 grid-cols-3 gap-3 px-2">
                <ProviderNode
                  name="OpenAI"
                  latency="98ms"
                  icon={<Sparkles size={17} />}
                />

                <ProviderNode
                  name="Google Gemini"
                  latency="120ms"
                  icon={<Globe2 size={17} />}
                />

                <ProviderNode
                  name="Groq"
                  latency="87ms"
                  icon={<Activity size={17} />}
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              STATS
          ===================================================== */}
          <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070e1e]/90 backdrop-blur md:grid-cols-4">
              {[
                {
                  value: "3+",
                  label: "AI Providers",
                  icon: <Network size={20} />,
                },
                {
                  value: "24/7",
                  label: "Real-time Monitoring",
                  icon: <Activity size={20} />,
                },
                {
                  value: "<100ms",
                  label: "Average Routing Latency",
                  icon: <Zap size={20} />,
                },
                {
                  value: "99.9%",
                  label: "Gateway Uptime",
                  icon: <Shield size={20} />,
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 px-7 py-6 ${
                    index !== 3
                      ? "border-b border-white/[0.06] md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/[0.06] text-blue-400">
                    {stat.icon}
                  </div>

                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FEATURES
        ========================================================= */}
        <section
          id="features"
          className="scroll-mt-20 border-b border-white/[0.06] py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                PLATFORM
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Everything you need to
                <br />
                manage AI traffic
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
                A centralized infrastructure layer for routing, monitoring,
                optimizing and securing your AI workloads.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  featured={index === 0}
                  onClick={() => setSelectedFeature(feature)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section
          id="how-it-works"
          className="relative overflow-hidden border-b border-white/[0.06] bg-[#050a17] py-28"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section heading */}
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-4 py-2 text-sm font-medium text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                THE PULSEROUTE FLOW
              </div>

              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                One API.
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Every AI provider.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                PulseRoute sits between your application and your AI providers,
                handling routing, reliability, security and observability
                through one unified gateway.
              </p>
            </div>

            {/* ==================== FLOW ==================== */}
            <div className="relative mt-16">
              {/* Connecting line */}
              <div className="absolute left-[16%] right-[16%] top-1/2 hidden h-px bg-gradient-to-r from-cyan-500/20 via-blue-500/60 to-violet-500/20 lg:block" />

              <div className="relative grid gap-6 lg:grid-cols-3">
                {/* STEP 01 */}
                <div className="group relative rounded-2xl border border-white/[0.08] bg-[#080f20]/90 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_50px_rgba(37,99,235,0.12)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-400">
                      01
                    </div>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      CONNECT
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-white">
                    Connect your providers
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    Add your AI providers once. PulseRoute securely manages
                    credentials and provider configuration for you.
                  </p>

                  {/* Mini provider UI */}
                  <div className="mt-7 rounded-xl border border-white/[0.07] bg-[#050a17] p-4">
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Connected providers
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                        <span className="text-sm text-slate-300">OpenAI</span>
                        <span className="text-xs text-emerald-400">
                          ● Connected
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                        <span className="text-sm text-slate-300">
                          Google Gemini
                        </span>
                        <span className="text-xs text-emerald-400">
                          ● Connected
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                        <span className="text-sm text-slate-300">Groq</span>
                        <span className="text-xs text-emerald-400">
                          ● Connected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 02 */}
                <div className="group relative rounded-2xl border border-blue-500/30 bg-[#080f20]/90 p-7 shadow-[0_0_50px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-400">
                      02
                    </div>

                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      ROUTE
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-white">
                    Send one unified request
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    Your application talks to one API while PulseRoute decides
                    where the request should go.
                  </p>

                  {/* API code */}
                  <div className="mt-7 overflow-hidden rounded-xl border border-white/[0.07] bg-[#030712]">
                    <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                      <span className="h-2 w-2 rounded-full bg-green-400/70" />

                      <span className="ml-2 text-xs text-slate-500">
                        request.ts
                      </span>
                    </div>

                    <pre className="overflow-x-auto p-4 text-xs leading-6">
                      <code>
                        <span className="text-violet-400">POST</span>{" "}
                        <span className="text-slate-300">
                          /v1/chat/completions
                        </span>
                        {"\n\n"}
                        <span className="text-slate-500">{"{"}</span>
                        {"\n"}
                        {"  "}
                        <span className="text-cyan-400">model</span>
                        {": "}
                        <span className="text-emerald-400">"auto"</span>,{"\n"}
                        {"  "}
                        <span className="text-cyan-400">messages</span>
                        {": "}
                        <span className="text-slate-400">[...]</span>
                        {"\n"}
                        <span className="text-slate-500">{"}"}</span>
                      </code>
                    </pre>
                  </div>
                </div>

                {/* STEP 03 */}
                <div className="group relative rounded-2xl border border-white/[0.08] bg-[#080f20]/90 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.12)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg font-bold text-violet-400">
                      03
                    </div>

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
                      OPTIMIZE
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-white">
                    Monitor & optimize
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    Track latency, errors, provider health and usage from one
                    centralized control plane.
                  </p>

                  {/* Metrics */}
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-[#050a17] p-4">
                      <p className="text-xs text-slate-500">Latency</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        87ms
                      </p>
                      <p className="mt-1 text-xs text-emerald-400">↓ 18%</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#050a17] p-4">
                      <p className="text-xs text-slate-500">Success rate</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        99.9%
                      </p>
                      <p className="mt-1 text-xs text-emerald-400">Healthy</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#050a17] p-4">
                      <p className="text-xs text-slate-500">Requests</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        24.8K
                      </p>
                      <p className="mt-1 text-xs text-blue-400">Today</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#050a17] p-4">
                      <p className="text-xs text-slate-500">Providers</p>
                      <p className="mt-2 text-xl font-semibold text-white">3</p>
                      <p className="mt-1 text-xs text-emerald-400">Online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== CONTROL PLANE ==================== */}
            <div className="mt-16 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080f20]/80">
              <div className="grid lg:grid-cols-2">
                {/* LEFT */}
                <div className="p-8 lg:p-12">
                  <div className="text-sm font-medium uppercase tracking-wider text-blue-400">
                    THE CONTROL PLANE
                  </div>

                  <h3 className="mt-4 text-3xl font-bold text-white">
                    See exactly what happens
                    <span className="block text-slate-400">
                      behind every request.
                    </span>
                  </h3>

                  <p className="mt-5 max-w-xl leading-7 text-slate-400">
                    PulseRoute evaluates provider health, latency and routing
                    policies before forwarding each request. If a provider
                    fails, traffic can automatically move to another available
                    provider.
                  </p>

                  <div className="mt-8 space-y-5">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-400">
                        ✓
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          Unified API
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Maintain one integration instead of managing separate
                          provider APIs.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-400">
                        ✓
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          Intelligent routing
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Route requests based on latency, availability,
                          reliability and configured policies.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-400">
                        ✓
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          Automatic failover
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Keep applications running when a provider becomes
                          unavailable.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-blue-400">
                        ✓
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          Centralized observability
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Monitor requests, latency, errors and provider health
                          from one dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT - ROUTING VISUAL */}
                <div className="relative border-t border-white/[0.06] bg-[#030712] p-8 lg:border-l lg:border-t-0 lg:p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_65%)]" />

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          LIVE ROUTING
                        </p>

                        <p className="mt-1 font-medium text-white">
                          Request decision
                        </p>
                      </div>

                      <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Operational
                      </span>
                    </div>

                    {/* Application */}
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 text-center">
                      <p className="text-xs text-violet-400">APPLICATION</p>

                      <p className="mt-1 font-semibold text-white">
                        Your AI Application
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center py-3">
                      <div className="h-8 w-px bg-gradient-to-b from-violet-500 to-blue-500" />
                    </div>

                    {/* Gateway */}
                    <div className="rounded-2xl border border-blue-500/40 bg-blue-500/[0.05] p-5 text-center shadow-[0_0_40px_rgba(37,99,235,0.12)]">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                        ⚡
                      </div>

                      <p className="mt-3 font-semibold text-white">
                        PulseRoute
                      </p>

                      <p className="text-xs text-slate-500">AI Gateway</p>

                      <div className="mx-auto mt-3 w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400">
                        Gateway operational
                      </div>
                    </div>

                    {/* Provider connections */}
                    <div className="my-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-center">
                        <p className="text-xs font-medium text-white">OpenAI</p>
                        <p className="mt-1 text-[11px] text-emerald-400">
                          98ms
                        </p>
                      </div>

                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-3 text-center">
                        <p className="text-xs font-medium text-white">Groq</p>
                        <p className="mt-1 text-[11px] text-emerald-400">
                          87ms
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-center">
                        <p className="text-xs font-medium text-white">Gemini</p>
                        <p className="mt-1 text-[11px] text-emerald-400">
                          120ms
                        </p>
                      </div>
                    </div>

                    {/* Decision */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          ROUTING DECISION
                        </span>

                        <span className="text-xs font-medium text-emerald-400">
                          ✓ Selected
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-medium text-white">Groq</span>

                        <span className="text-sm text-emerald-400">87ms</span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      </div>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        Selected based on current latency and provider
                        availability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== BOTTOM BENEFITS ==================== */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "One integration",
                  text: "Connect once and work with multiple AI providers.",
                },
                {
                  title: "Smart routing",
                  text: "Choose providers based on real-time conditions.",
                },
                {
                  title: "Automatic failover",
                  text: "Keep traffic moving when providers fail.",
                },
                {
                  title: "Full visibility",
                  text: "Monitor your AI traffic from one control plane.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-blue-500/20 hover:bg-white/[0.03]"
                >
                  <h4 className="font-semibold text-white">{item.title}</h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PROVIDERS
        ========================================================= */}
        <section
          id="providers"
          className="scroll-mt-20 border-b border-white/[0.06] py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                ECOSYSTEM
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Connect your favorite AI providers
              </h2>

              <p className="mt-4 text-slate-400">
                One gateway while keeping the flexibility to work with multiple
                AI platforms.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "OpenAI",
                  models: "GPT models and AI APIs",
                  icon: <Sparkles size={21} />,
                },
                {
                  name: "Google Gemini",
                  models: "Gemini models and APIs",
                  icon: <Globe2 size={21} />,
                },
                {
                  name: "Groq",
                  models: "Fast inference APIs",
                  icon: <Activity size={21} />,
                },
                {
                  name: "+ More",
                  models: "More providers coming soon",
                  icon: <Network size={21} />,
                },
              ].map((provider) => (
                <div
                  key={provider.name}
                  className="group rounded-2xl border border-white/[0.08] bg-[#070e1e] p-6 transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/[0.07] text-blue-400">
                      {provider.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {provider.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {provider.models}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {provider.name === "+ More"
                      ? "Coming soon"
                      : "Ready to connect"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            DASHBOARD / DEVELOPER SECTION
        ========================================================= */}
        <section
          id="docs"
          className="scroll-mt-20 border-b border-white/[0.06] py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                BUILT FOR DEVELOPERS
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Powerful gateway.
                <br />
                Complete visibility.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
                Monitor AI traffic, compare providers, inspect requests and
                understand the health of your infrastructure from one
                centralized dashboard.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Real-time request monitoring",
                  "Provider performance analytics",
                  "Cost tracking and optimization",
                  "Centralized API key management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                      <Check size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <a
                href="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-blue-500"
              >
                Explore dashboard
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[30px] bg-blue-600/[0.06] blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#070d1c] shadow-2xl">
                {/* top */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                      <Zap size={15} />
                    </div>

                    <span className="text-sm font-semibold">PulseRoute</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-500">Operational</span>
                  </div>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  {/* sidebar */}
                  <div className="border-r border-white/[0.06] p-4">
                    {[
                      "Overview",
                      "Requests",
                      "Providers",
                      "Analytics",
                      "Logs",
                      "API Keys",
                      "Settings",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`mb-1 rounded-lg px-3 py-2.5 text-xs ${
                          index === 0
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-slate-500"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          Overview
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          AI infrastructure metrics
                        </p>
                      </div>

                      <div className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-500">
                        Last 7 days
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ["Total Requests", "24.5K", "+12.5%"],
                        ["Success Rate", "99.9%", "+0.4%"],
                        ["Avg. Latency", "86ms", "-8.2%"],
                        ["Providers", "3", "Healthy"],
                      ].map(([label, value, change]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <p className="text-[10px] text-slate-600">{label}</p>

                          <p className="mt-2 text-lg font-bold text-white">
                            {value}
                          </p>

                          <p className="mt-1 text-[10px] text-emerald-400">
                            {change}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* chart */}
                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-300">
                          Traffic Overview
                        </p>

                        <div className="flex gap-3 text-[9px] text-slate-600">
                          <span>OpenAI</span>
                          <span>Gemini</span>
                          <span>Groq</span>
                        </div>
                      </div>

                      <div className="relative mt-5 h-28">
                        {[0, 1, 2, 3].map((line) => (
                          <div
                            key={line}
                            className="absolute left-0 right-0 border-t border-white/[0.04]"
                            style={{ top: `${line * 33}%` }}
                          />
                        ))}

                        <svg
                          viewBox="0 0 500 120"
                          className="absolute inset-0 h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0 90 C50 80, 60 50, 105 65 S170 95, 220 45 S280 70, 325 38 S400 65, 450 25 S480 30, 500 15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-500"
                          />

                          <path
                            d="M0 100 C70 95, 80 75, 130 80 S200 55, 245 75 S320 50, 365 60 S430 45, 500 50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-violet-500"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PRICING / CTA
        ========================================================= */}
        <section
          id="pricing"
          className="scroll-mt-20 border-b border-white/[0.06] py-28"
        >
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[30px] border border-blue-500/20 bg-gradient-to-br from-[#0b1730] via-[#080f20] to-[#0b1025] px-7 py-16 text-center sm:px-12">
              <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-blue-600/15 blur-[90px]" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <Zap size={25} fill="currentColor" />
                </div>

                <h2 className="mt-7 text-3xl font-bold text-white sm:text-5xl">
                  Ready to simplify your
                  <br />
                  AI infrastructure?
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
                  Build, route and monitor your AI applications from one
                  centralized gateway.
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <a
                    href="/register"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold shadow-xl shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                  >
                    Get started for free
                    <ArrowRight size={16} />
                  </a>

                  <a
                    href="/login"
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    Sign in
                  </a>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Check size={13} className="text-emerald-400" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <a href="#top" className="flex w-fit items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/[0.06]">
                  <img
                    src="/pulseroute-logo.png"
                    alt="PulseRoute"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div>
                  <p className="font-bold text-white">PulseRoute</p>
                  <p className="text-[8px] font-semibold tracking-[0.25em] text-blue-400">
                    AI GATEWAY PLATFORM
                  </p>
                </div>
              </a>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                The intelligent AI gateway for modern applications. Route,
                monitor and optimize AI traffic across multiple providers.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Platform</p>

              <div className="mt-5 space-y-3 text-sm text-slate-500">
                <button
                  onClick={() => scrollTo("features")}
                  className="block transition hover:text-white"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="block transition hover:text-white"
                >
                  How it works
                </button>

                <button
                  onClick={() => scrollTo("providers")}
                  className="block transition hover:text-white"
                >
                  Providers
                </button>

                <button
                  onClick={() => scrollTo("pricing")}
                  className="block transition hover:text-white"
                >
                  Pricing
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Developers</p>

              <div className="mt-5 space-y-3 text-sm text-slate-500">
                <button
                  onClick={() => scrollTo("docs")}
                  className="block transition hover:text-white"
                >
                  Documentation
                </button>

                <a
                  href="/register"
                  className="block transition hover:text-white"
                >
                  Get started
                </a>

                <a href="/login" className="block transition hover:text-white">
                  Sign in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PulseRoute. All rights reserved.</p>

            <div className="flex gap-5">
              <span className="cursor-pointer transition hover:text-slate-400">
                Privacy
              </span>

              <span className="cursor-pointer transition hover:text-slate-400">
                Terms
              </span>

              <span className="cursor-pointer transition hover:text-slate-400">
                Security
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          FEATURE MODAL
      ========================================================= */}
      {selectedFeature && (
        <FeatureModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </div>
  );
}

/* Small reusable icon for the "Send requests" step */
function SendIcon() {
  return (
    <div className="relative">
      <ArrowRight size={22} />
    </div>
  );
}
