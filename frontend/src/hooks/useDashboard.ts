import { useEffect, useState } from "react";
import {
  getOverview,
  getProviderAnalytics,
  getDailyAnalytics,
  getRecentRequests,
  getCacheStats,
  getSystemHealth,
  getOperationalStats,
} from "../services/dashboard.service";

interface ServiceHealth {
  name: string;
  status: "healthy" | "warning" | "unhealthy";
  responseTime?: number;
  message?: string;
}

interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  services: ServiceHealth[];
}

export default function useDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [providerAnalytics, setProviderAnalytics] = useState<any[]>([]);
  const [dailyAnalytics, setDailyAnalytics] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [operationalStats, setOperationalStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const overviewData = await getOverview();
        const providerData = await getProviderAnalytics();
        const dailyData = await getDailyAnalytics();
        const recentData = await getRecentRequests();
        const cacheData = await getCacheStats();
        const healthData = await getSystemHealth();
        const opsData = await getOperationalStats();

        setOverview(overviewData.data);
        setProviderAnalytics(providerData.data);
        setDailyAnalytics(dailyData.data);
        setRecentRequests(recentData.data);
        setCacheStats(cacheData.cache);
        setSystemHealth(healthData.data);
        setOperationalStats(opsData.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    overview,
    providerAnalytics,
    dailyAnalytics,
    recentRequests,
    cacheStats,
    systemHealth,
    operationalStats,
    loading,
    error,
  };
}
