import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProviders } from "../../services/dashboard.service";

interface Provider {
  name: string;
  priority: number;
  status: "healthy" | "unhealthy";
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await getProviders();
        setProviders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadProviders();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Providers</h1>
          <p className="text-slate-400 mt-2">
            View all configured AI providers.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left py-3">Provider</th>
                <th className="text-left py-3">Priority</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((provider) => (
                <tr
                  key={provider.name}
                  className="border-b border-slate-800"
                >
                  <td className="py-4 capitalize">{provider.name}</td>

                  <td>{provider.priority}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        provider.status === "healthy"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}