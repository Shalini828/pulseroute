import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import useDashboard from "../../hooks/useDashboard";
import SystemHealth from "../../components/dashboard/SystemHealth";
import GettingStarted from "../../components/dashboard/GettingStarted";
import { useProject } from "../../context/ProjectContext";

import {
  FolderKanban,
  Activity,
  Timer,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Server,
} from "lucide-react";

export default function Dashboard() {
  const { project } = useProject();

  const { overview, cacheStats, systemHealth, loading, error } =
    useDashboard();

  const totalRequests = overview?.totalRequests ?? 0;
  const successfulRequests = overview?.successfulRequests ?? 0;
  const activeProviders = overview?.activeProviders ?? 0;

  const avgLatency = Math.round(
    overview?.averageResponseTime ?? 0
  );

  const successRate =
    totalRequests > 0
      ? ((successfulRequests / totalRequests) * 100).toFixed(2)
      : "100";

  const hitRate = Math.round(cacheStats?.hitRate ?? 0);

  const systemStatus = systemHealth?.status ?? "unknown";

  const statusText =
    systemStatus === "healthy"
      ? "All Systems Operational"
      : systemStatus === "degraded"
        ? "Degraded Performance"
        : "System Issues";

  const statusClasses =
    systemStatus === "healthy"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : systemStatus === "degraded"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
        : "border-red-500/20 bg-red-500/10 text-red-300";

  const statusDot =
    systemStatus === "healthy"
      ? "bg-emerald-400"
      : systemStatus === "degraded"
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <DashboardLayout>
      <main className="w-full">

        {/* =====================================================
            DASHBOARD HEADER
        ====================================================== */}
        <section className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Control Center
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor your PulseRoute AI gateway performance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusClasses}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                />
                {statusText}
              </div>

              <div className="hidden rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400 sm:block">
                Production
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Requests"
              value={totalRequests.toLocaleString()}
              icon={Activity}
              loading={loading}
              subtitle="Requests processed"
            />

            <StatCard
              title="Active Providers"
              value={activeProviders.toString()}
              icon={FolderKanban}
              loading={loading}
              subtitle={
                activeProviders === 1
                  ? "Provider connected"
                  : "Providers connected"
              }
            />

            <StatCard
              title="Success Rate"
              value={`${successRate}%`}
              icon={ShieldCheck}
              loading={loading}
              subtitle={`${successfulRequests.toLocaleString()} successful`}
            />

            <StatCard
              title="Avg. Latency"
              value={`${avgLatency} ms`}
              icon={Timer}
              loading={loading}
              subtitle="Average response time"
            />

          </div>
        </section>

        {/* =====================================================
            SECONDARY METRIC
        ====================================================== */}
        <section className="mt-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <Zap
                    size={17}
                    className="text-blue-400"
                    strokeWidth={1.9}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Cache Performance
                  </p>

                  <p className="text-xs text-slate-500">
                    Requests served from cache
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{
                      width: `${Math.min(hitRate, 100)}%`,
                    }}
                  />
                </div>

                <span className="text-sm font-semibold text-slate-200">
                  {hitRate}%
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            CURRENT PROJECT + QUICK OVERVIEW
        ====================================================== */}
        <section className="mt-7">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">

            {/* CURRENT PROJECT */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                    <FolderKanban
                      size={19}
                      className="text-blue-400"
                      strokeWidth={1.9}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                      Current Project
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      {project?.name ?? "No project selected"}
                    </h2>
                  </div>

                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </div>

              </div>

              <div className="mt-6 border-t border-slate-800/70 pt-4">

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">
                    Project ID
                  </span>

                  <code className="break-all text-xs text-blue-400">
                    {project?.id ?? "—"}
                  </code>
                </div>

              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <ArrowUpRight
                  size={14}
                  className="text-blue-400"
                />

                <span>
                  Active workspace connected to your gateway
                </span>
              </div>

            </div>

            {/* QUICK STATUS */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <Server
                    size={19}
                    className="text-emerald-400"
                    strokeWidth={1.9}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Gateway Status
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    {statusText}
                  </h2>
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Providers
                  </span>

                  <span className="text-sm font-semibold text-slate-200">
                    {activeProviders}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Requests
                  </span>

                  <span className="text-sm font-semibold text-slate-200">
                    {totalRequests.toLocaleString()}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            SYSTEM HEALTH
        ====================================================== */}
        <section className="mt-7">
          <SystemHealth
            services={systemHealth?.services}
            overallStatus={systemHealth?.status}
            loading={loading}
            error={error}
          />
        </section>

        {/* =====================================================
            GETTING STARTED
        ====================================================== */}
        <section className="mt-7">
          <GettingStarted />
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-8 border-t border-slate-800/80 py-5">

          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} PulseRoute AI Gateway
            </p>

            <div className="flex items-center gap-3">
              <span>v1.0</span>

              <span className="text-slate-700">
                •
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Systems operational
              </span>
            </div>

          </div>

        </footer>

      </main>
    </DashboardLayout>
  );
}