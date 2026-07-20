import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import ProviderCard from "../../components/dashboard/ProviderCard";
import TrafficChart from "../../components/dashboard/TrafficChart";
import RecentRequests from "../../components/dashboard/RecentRequests";
import useDashboard from "../../hooks/useDashboard";

import { FolderKanban, Activity, Timer, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { overview, providerAnalytics, dailyAnalytics, recentRequests } =
    useDashboard();
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
            value={overview?.activeProviders?.toString() ?? "0"}
            icon={FolderKanban}
          />

          <StatCard
            title="Requests"
            value={overview?.totalRequests?.toString() ?? "0"}
            icon={Activity}
          />

          <StatCard
            title="Average Latency"
            value={`${Math.round(overview?.averageResponseTime ?? 0)} ms`}
            icon={Timer}
          />

          <StatCard
            title="Availability"
            value={
              overview && overview.totalRequests > 0
                ? `${(
                    (overview.successfulRequests / overview.totalRequests) *
                    100
                  ).toFixed(2)}%`
                : "100%"
            }
            icon={ShieldCheck}
          />
        </div>

        {/* Providers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Providers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {providerAnalytics.map((provider: any) => {
              return (
                <ProviderCard key={provider.provider} provider={provider} />
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="grid xl:grid-cols-2 gap-6">
          <TrafficChart data={dailyAnalytics} />
          <RecentRequests rows={recentRequests.slice(0, 5)} />
        </div>
      </div>
    </DashboardLayout>
  );
}
