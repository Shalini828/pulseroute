import { CheckCircle, AlertTriangle } from "lucide-react";

interface Provider {
  name: string;
  priority: number;
  status: "healthy" | "degraded";
}

interface Props {
  provider: Provider;
}

export default function ProviderCard({
  provider,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-xl font-semibold capitalize">
            {provider.name}
          </h3>

          <p className="text-slate-400 mt-2">
            Priority: {provider.priority}
          </p>

          <p
            className={`mt-1 text-sm ${
              provider.status === "healthy"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {provider.status}
          </p>
        </div>

        {provider.status === "healthy" ? (
          <CheckCircle
            className="text-green-500"
            size={32}
          />
        ) : (
          <AlertTriangle
            className="text-yellow-500"
            size={32}
          />
        )}

      </div>
    </div>
  );
}