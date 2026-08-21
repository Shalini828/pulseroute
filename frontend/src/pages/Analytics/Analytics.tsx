import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  getAnalyticsOverview,
  getDailyAnalytics,
  getProviderAnalytics,
  getRecentRequests,
} from "../../services/dashboard.service";

import ProviderRequestsChart from "../../components/analytics/ProviderRequestsChart";
import { Link } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Timer,
  TrendingUp,
} from "lucide-react";

interface OverviewData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeProviders?: number;
}

interface DailyData {
  date: string;
  requests: number;
}

interface RecentRequest {
  provider: string;
  prompt: string;
  responseTime: number;
  createdAt: string;
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Analytics() {
  const [overview, setOverview] = useState<OverviewData | null>(null);

  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  const [providerData, setProviderData] = useState<any[]>([]);

  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);

        /*
         * Overview
         *
         * getAnalyticsOverview() returns AxiosResponse,
         * so we need .data.
         */
        const overviewResponse = await getAnalyticsOverview();

        setOverview(overviewResponse.data ?? overviewResponse);

        /*
         * Daily analytics
         *
         * getDailyAnalytics() already returns res.data.
         */
        const daily = await getDailyAnalytics();

        setDailyData(Array.isArray(daily.data) ? daily.data : []);

        /*
         * Provider analytics
         */
        const providers = await getProviderAnalytics();

        setProviderData(Array.isArray(providers.data) ? providers.data : []);

        /*
         * Recent requests
         *
         * IMPORTANT:
         * getRecentRequests() already returns res.data.
         */
        const recent = await getRecentRequests();

        setRecentRequests(
          Array.isArray(recent)
            ? recent
            : Array.isArray(recent?.data)
              ? recent.data
              : [],
        );
      } catch (err) {
        console.error("Failed to load analytics:", err);

        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();

    /*
     * Refresh analytics every 10 seconds
     * so the page stays in sync with the gateway.
     */
    const interval = setInterval(loadAnalytics, 10000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <XCircle size={36} className="mx-auto text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const totalRequests = overview?.totalRequests ?? 0;

  const successfulRequests = overview?.successfulRequests ?? 0;

  const failedRequests = overview?.failedRequests ?? 0;

  const averageResponseTime = Math.round(overview?.averageResponseTime ?? 0);

  const successRate =
    totalRequests > 0
      ? Math.round((successfulRequests / totalRequests) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                Analytics
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Gateway Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor request volume, provider performance, latency, and
                recent gateway activity.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-300">
                Live Analytics
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total Requests */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Total Requests
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {totalRequests.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Requests processed
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <Activity size={20} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Successful */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Successful
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {successfulRequests.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-emerald-400">
                    {successRate}% success rate
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Failed */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Failed
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {failedRequests.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Unsuccessful requests
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                  <XCircle size={20} className="text-red-400" />
                </div>
              </div>
            </div>

            {/* Average Response */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Avg. Response
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {averageResponseTime.toLocaleString()}
                    <span className="ml-1 text-lg font-medium text-slate-400">
                      ms
                    </span>
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Average gateway latency
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <Timer size={20} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            REQUESTS OVER TIME
        ====================================================== */}

        <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <TrendingUp size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Traffic Analytics
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Requests over time
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Daily request volume across your gateway.
              </p>
            </div>
          </div>

          {dailyData.length === 0 ? (
            <div className="mt-6 flex h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
              <div className="text-center">
                <TrendingUp size={30} className="mx-auto mb-3 text-slate-600" />

                <p className="text-sm font-medium text-slate-300">
                  No traffic data yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Send AI requests to populate this chart.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#64748b"
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    minTickGap={30}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={35}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelFormatter={(label) => formatDate(String(label))}
                  />

                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      fill: "#3b82f6",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#60a5fa",
                      stroke: "#0f172a",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* =====================================================
            PROVIDER PERFORMANCE
        ====================================================== */}

        <section>
          <ProviderRequestsChart data={providerData} />
        </section>

        {/* =====================================================
            RECENT REQUESTS
        ====================================================== */}

        <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Recent Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest requests processed by the gateway.
              </p>
            </div>

            <Link
              to="/history"
              className="inline-flex w-fit items-center text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              View Full History →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
              <p className="text-sm font-medium text-slate-300">
                No recent requests found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Requests will appear here after they pass through the gateway.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Provider
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Prompt
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Response Time
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.slice(0, 10).map((request, index) => (
                    <tr
                      key={`${request.createdAt}-${index}`}
                      className="border-b border-slate-800/70 transition hover:bg-slate-900/70"
                    >
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium capitalize text-blue-300">
                          {request.provider}
                        </span>
                      </td>

                      <td className="max-w-[360px] px-4 py-4">
                        <p
                          className="truncate text-sm text-slate-300"
                          title={request.prompt}
                        >
                          {request.prompt || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-300">
                        {Math.round(request.responseTime ?? 0)} ms
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {new Date(request.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
