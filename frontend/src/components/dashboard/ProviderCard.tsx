import {
  CheckCircle,
  AlertTriangle,
  Activity,
  Timer,
  Layers,
} from "lucide-react";

interface Provider {
  name: string;
  priority: number;
  status: "healthy" | "degraded";

  totalRequests: number;
  averageResponseTime: number;

  successRate?: number;
}

interface Props {
  provider: Provider;
}

export default function ProviderCard({ provider }: Props) {
  const healthy = provider.status === "healthy";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">

      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>

      <div className="relative">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-xl font-bold capitalize">
              {provider.name}
            </h3>

            <div
              className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                healthy
                  ? "bg-green-500/15 text-green-400"
                  : "bg-yellow-500/15 text-yellow-400"
              }`}
            >
              {healthy ? (
                <CheckCircle size={14} />
              ) : (
                <AlertTriangle size={14} />
              )}

              {healthy ? "Healthy" : "Degraded"}
            </div>
          </div>

          <div className="rounded-xl bg-blue-500/10 p-3">
            <Layers className="text-blue-400" size={26} />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-xl bg-slate-800/50 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Activity size={15} />
              Requests
            </div>

            <p className="mt-2 text-lg font-semibold">
              {provider.totalRequests}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Timer size={15} />
              Latency
            </div>

            <p className="mt-2 text-lg font-semibold">
              {Math.round(provider.averageResponseTime)} ms
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3">
            <p className="text-slate-400 text-sm">
              Priority
            </p>

            <p className="mt-2 text-lg font-semibold">
              #{provider.priority}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3">
            <p className="text-slate-400 text-sm">
              Success
            </p>

            <p className="mt-2 text-lg font-semibold text-green-400">
              {provider.successRate?.toFixed(1) ?? "100"}%
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}