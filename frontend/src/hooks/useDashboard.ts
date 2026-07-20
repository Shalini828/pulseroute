import { useEffect, useState } from "react";
import {
  getOverview,
  getProviderAnalytics,
  getDailyAnalytics,
  getRecentRequests,
} from "../services/dashboard.service";

interface Metric {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalResponseTime: number;
  status: string;
}

interface HistoryItem {
  id: string;
  provider: string;
  prompt: string;
  response: string;
  responseTime: number;
  createdAt: string;
}

interface Provider {
  name: string;
  priority: number;
  status: "healthy" | "degraded";
}

export default function useDashboard() {

const [overview, setOverview] = useState<any>(null);
const [providerAnalytics, setProviderAnalytics] = useState<any[]>([]);
const [dailyAnalytics, setDailyAnalytics] = useState<any[]>([]);
const [recentRequests, setRecentRequests] = useState<any[]>([]);

useEffect(() => {
  async function load() {
    try {
  const overviewData = await getOverview();
const providerData = await getProviderAnalytics();
const dailyData = await getDailyAnalytics();
const recentData = await getRecentRequests();

setOverview(overviewData.data);
setProviderAnalytics(providerData.data);
setDailyAnalytics(dailyData.data);
setRecentRequests(recentData.data);
    } catch (err) {
      console.error(err);
    }
  }

  load();
  
  const interval = setInterval(load, 5000);

  return () => clearInterval(interval);
}, []);

 return {
  overview,
  providerAnalytics,
  dailyAnalytics,
  recentRequests,
};
}