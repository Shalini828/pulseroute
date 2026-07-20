import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getOverview,
  getProviderAnalytics,
} from "../../services/dashboard.service";
import ProviderRequestsChart from "../../components/analytics/ProviderRequestsChart";

interface Overview {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}

interface ProviderMetric {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  successRate: number;
}

export default function Analytics() {
  const [overview, setOverview] = useState<Overview>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
  });

  const [metrics, setMetrics] = useState<ProviderMetric[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const overviewRes = await getOverview();
        const providerRes = await getProviderAnalytics();

        setOverview(overviewRes.data);
        setMetrics(providerRes.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-slate-400 mt-2">
            Monitor provider performance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Requests</p>
            <h2 className="text-3xl font-bold mt-2">
              {overview.totalRequests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Successful</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {overview.successfulRequests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Failed</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {overview.failedRequests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Latency
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {overview.averageResponseTime.toFixed(0)} ms
            </h2>
          </div>
        </div>

        {/* Chart */}
        <ProviderRequestsChart data={metrics} />

        {/* Provider Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left py-3">Provider</th>
                <th className="text-left py-3">Requests</th>
                <th className="text-left py-3">Successful</th>
                <th className="text-left py-3">Failed</th>
                <th className="text-left py-3">Avg Latency</th>
                <th className="text-left py-3">Success Rate</th>
              </tr>
            </thead>

            <tbody>
              {metrics.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-slate-400"
                  >
                    No analytics available.
                  </td>
                </tr>
              ) : (
                metrics.map((metric) => (
                  <tr
                    key={metric.provider}
                    className="border-b border-slate-800"
                  >
                    <td className="capitalize py-4">
                      {metric.provider}
                    </td>

                    <td>{metric.totalRequests}</td>

                    <td>{metric.successfulRequests}</td>

                    <td>{metric.failedRequests}</td>

                    <td>
                      {metric.averageResponseTime.toFixed(0)} ms
                    </td>

                    <td>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                        {metric.successRate.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}