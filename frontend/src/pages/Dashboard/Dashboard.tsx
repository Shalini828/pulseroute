import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import ProviderCard from "../../components/dashboard/ProviderCard";
import TrafficChart from "../../components/dashboard/TrafficChart";
import RecentRequests from "../../components/dashboard/RecentRequests";
import useDashboard from "../../hooks/useDashboard";

import { FolderKanban, Activity, Timer, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { metrics, history, providers } = useDashboard();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weeklyTraffic = weekDays.map((day) => ({
    day,
    requests: history.filter((item: any) => {
      const requestDay = new Date(item.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      return requestDay === day;
    }).length,
  }));
  const totalRequests = metrics.reduce(
    (sum: number, item: any) => sum + item.totalRequests,
    0,
  );

  const activeMetrics = metrics.filter((item: any) => item.totalRequests > 0);

  const averageLatency =
    activeMetrics.length > 0
      ? (
          activeMetrics.reduce(
            (sum: number, item: any) => sum + item.averageResponseTime,
            0,
          ) / activeMetrics.length
        ).toFixed(0)
      : "0";

  const totalSuccessful = metrics.reduce(
    (sum: number, item: any) => sum + item.successfulRequests,
    0,
  );

  const availability =
    totalRequests > 0
      ? ((totalSuccessful / totalRequests) * 100).toFixed(2)
      : "100.00";
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Welcome to PulseRoute 🚀</h1>

          <p className="text-slate-400 mt-2">
            Intelligent API Infrastructure Platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Providers"
            value={providers.length.toString()}
            icon={FolderKanban}
          />

          <StatCard
            title="Requests"
            value={totalRequests.toString()}
            icon={Activity}
          />

          <StatCard
            title="Average Latency"
            value={`${averageLatency} ms`}
            icon={Timer}
          />

          <StatCard
            title="Availability"
            value={`${availability}%`}
            icon={ShieldCheck}
          />
        </div>

        {/* Providers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Providers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {providers.map((provider: any) => {
              const metric = metrics.find(
                (m: any) => m.provider === provider.name,
              );

              return (
                <ProviderCard
                  key={provider.name}
                  provider={{
                    ...provider,
                    totalRequests: metric?.totalRequests ?? 0,
                    averageResponseTime: metric?.averageResponseTime ?? 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="grid xl:grid-cols-2 gap-6">
          <TrafficChart data={weeklyTraffic} />

          <RecentRequests />
        </div>
      </div>
    </DashboardLayout>
  );
}
