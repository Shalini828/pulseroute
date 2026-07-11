import { CheckCircle, AlertTriangle } from "lucide-react";

interface Provider {
  name: string;
  priority: number;
  status: "healthy" | "degraded";

  totalRequests: number;
  averageResponseTime: number;
}

interface Props {
  provider: Provider;
}

export default function ProviderCard({ provider }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold capitalize">{provider.name}</h3>

          <div className="mt-4 space-y-2">
            <p className="text-slate-400">
              <span className="font-medium text-white">Priority:</span>{" "}
              {provider.priority}
            </p>

            <p className="text-slate-400">
              <span className="font-medium text-white">Status:</span>{" "}
              <span
                className={
                  provider.status === "healthy"
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {provider.status}
              </span>
            </p>

            <p className="text-slate-400">
              <span className="font-medium text-white">Requests:</span>{" "}
              {provider.totalRequests ?? 0}
            </p>

            <p className="text-slate-400">
              <span className="font-medium text-white">Avg Latency:</span>{" "}
              {Math.round(provider.averageResponseTime ?? 0)} ms
            </p>
          </div>
        </div>

        {provider.status === "healthy" ? (
          <CheckCircle className="text-green-500" size={32} />
        ) : (
          <AlertTriangle className="text-yellow-500" size={32} />
        )}
      </div>
    </div>
  );
}
