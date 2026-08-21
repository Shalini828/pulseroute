import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TrafficData {
  date: string;
  requests: number;
}

interface Props {
  data: TrafficData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-slate-400">
        {label}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-400" />

        <span className="text-xs text-slate-400">
          Requests
        </span>

        <span className="text-sm font-semibold text-white">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

export default function TrafficChart({ data }: Props) {
  const [filter, setFilter] = useState<
    "Today" | "7D" | "30D"
  >("7D");

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    if (filter === "Today") {
      return data.slice(-1);
    }

    if (filter === "7D") {
      return data.slice(-7);
    }

    return data.slice(-30);
  }, [filter, data]);

  /*
   * Total requests in selected period
   */
  const totalRequests = filteredData.reduce(
    (sum, item) => sum + item.requests,
    0,
  );

  /*
   * Average should be calculated using days
   * that actually contain traffic.
   *
   * Example:
   * [0, 0, 0, 4, 2, 0, 0]
   *
   * Average = (4 + 2) / 2 = 3
   *
   * instead of 6 / 7 = 0.85 -> rounded to 1
   */
  const activeDays = filteredData.filter(
    (item) => item.requests > 0,
  );

  const avgRequests =
    activeDays.length > 0
      ? Math.round(
          activeDays.reduce(
            (sum, item) => sum + item.requests,
            0,
          ) / activeDays.length,
        )
      : 0;

  /*
   * Highest number of requests on a single day
   */
  const maxRequests =
    filteredData.length > 0
      ? Math.max(
          ...filteredData.map(
            (item) => item.requests,
          ),
        )
      : 0;

  /*
   * Empty state
   */
  if (!data || data.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Traffic Analytics
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Request volume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor request activity across your gateway.
            </p>
          </div>
        </div>

        <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-center">
            <TrendingUp
              size={30}
              className="mx-auto mb-3 text-slate-600"
            />

            <p className="text-sm font-medium text-slate-300">
              No traffic data yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Send your first AI request to see analytics here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Traffic Analytics
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Request volume
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor request activity over time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(["Today", "7D", "30D"] as const).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === item
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-slate-800/80 py-4">
        <div>
          <p className="text-xs text-slate-500">
            Total
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {totalRequests.toLocaleString()}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        <div>
          <p className="text-xs text-slate-500">
            Average
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {avgRequests.toLocaleString()}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        <div>
          <p className="text-xs text-slate-500">
            Peak
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {maxRequests.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 h-[280px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={filteredData}
            margin={{
              top: 12,
              right: 12,
              left: 0,
              bottom: 8,
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
              width={32}
              allowDecimals={false}
              domain={[0, "auto"]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#334155",
                strokeDasharray: "4 4",
              }}
            />

            <Line
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{
                r: 3,
                strokeWidth: 0,
                fill: "#3b82f6",
              }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "#0f172a",
                fill: "#60a5fa",
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}