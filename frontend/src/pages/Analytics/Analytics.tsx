import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMetrics } from "../../services/dashboard.service";
import ProviderRequestsChart from "../../components/analytics/ProviderRequestsChart";

interface Metric {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  status: string;
}

export default function Analytics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await getMetrics();
        setMetrics(res.metrics || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadMetrics();
  }, []);

  const summary = useMemo(() => {
    const totalRequests = metrics.reduce(
      (sum, item) => sum + item.totalRequests,
      0,
    );

    const successfulRequests = metrics.reduce(
      (sum, item) => sum + item.successfulRequests,
      0,
    );

    const failedRequests = metrics.reduce(
      (sum, item) => sum + item.failedRequests,
      0,
    );

    const averageLatency =
      metrics.length > 0
        ? (
            metrics.reduce((sum, item) => sum + item.averageResponseTime, 0) /
            metrics.length
          ).toFixed(0)
        : "0";

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency,
    };
  }, [metrics]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-slate-400 mt-2">Monitor provider performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Requests</p>
            <h2 className="text-3xl font-bold mt-2">{summary.totalRequests}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Successful</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {summary.successfulRequests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Failed</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {summary.failedRequests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Average Latency</p>
            <h2 className="text-3xl font-bold mt-2">
              {summary.averageLatency} ms
            </h2>
          </div>
        </div>

<ProviderRequestsChart data={metrics} />
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left py-3">Provider</th>
                <th className="text-left py-3">Requests</th>
                <th className="text-left py-3">Success</th>
                <th className="text-left py-3">Failed</th>
                <th className="text-left py-3">Avg Latency</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.provider} className="border-b border-slate-800">
                  <td className="capitalize py-4">{metric.provider}</td>

                  <td>{metric.totalRequests}</td>

                  <td>{metric.successfulRequests}</td>

                  <td>{metric.failedRequests}</td>

                  <td>{metric.averageResponseTime} ms</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        metric.status === "healthy"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {metric.status}
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
