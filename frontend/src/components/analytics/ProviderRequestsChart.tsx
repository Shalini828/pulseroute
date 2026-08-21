import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Metric {
  provider: string;
  totalRequests: number;
  successfulRequests?: number;
  failedRequests?: number;
  successRate?: number;
}

interface Props {
  data: Metric[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: Metric;
  }>;
}

function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0].payload;

  const providerName =
    item.provider?.trim() || "Unspecified";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">
        {providerName}
      </p>

      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-slate-400">
            Total Requests
          </span>

          <span className="text-sm font-semibold text-blue-400">
            {item.totalRequests}
          </span>
        </div>

        {typeof item.successfulRequests === "number" && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-slate-400">
              Successful
            </span>

            <span className="text-sm font-medium text-emerald-400">
              {item.successfulRequests}
            </span>
          </div>
        )}

        {typeof item.failedRequests === "number" && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-slate-400">
              Failed
            </span>

            <span className="text-sm font-medium text-red-400">
              {item.failedRequests}
            </span>
          </div>
        )}

        {typeof item.successRate === "number" && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-slate-400">
              Success Rate
            </span>

            <span className="text-sm font-medium text-slate-200">
              {item.successRate.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProviderRequestsChart({
  data,
}: Props) {
  const chartData = [...(data ?? [])]
    .map((item) => ({
      ...item,
      provider:
        item.provider?.trim() || "Unspecified",
    }))
    .sort(
      (a, b) =>
        b.totalRequests - a.totalRequests,
    );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Provider Analytics
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          Requests by Provider
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare request volume across your connected AI providers.
        </p>
      </div>

      {/* Empty state */}
      {chartData.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">
              No provider data yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Send an AI request to see provider analytics.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="provider"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.06)",
                  }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="totalRequests"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={90}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Provider summary */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chartData.map((provider) => (
              <div
                key={provider.provider}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-slate-200">
                    {provider.provider}
                  </span>

                  <span className="text-lg font-semibold text-white">
                    {provider.totalRequests}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  total request
                  {provider.totalRequests !== 1
                    ? "s"
                    : ""}
                </p>

                {typeof provider.successRate ===
                  "number" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Success rate
                      </span>

                      <span className="text-slate-300">
                        {provider.successRate.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              provider.successRate,
                              0,
                            ),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}