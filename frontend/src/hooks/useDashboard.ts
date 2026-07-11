import { useEffect, useState } from "react";
import {
  getHistory,
  getMetrics,
  getProviders,
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
const [metrics, setMetrics] = useState<Metric[]>([]);
const [history, setHistory] = useState<HistoryItem[]>([]);
const [providers, setProviders] = useState<Provider[]>([]);
useEffect(() => {
  async function load() {
    try {
      const metricsData = await getMetrics();
      const historyData = await getHistory();
      const providersData = await getProviders();

      setMetrics(metricsData.metrics);
      setHistory(historyData.history);
      setProviders(providersData.providers);
    } catch (err) {
      console.error(err);
    }
  }

  load();
  

  const interval = setInterval(load, 5000);

  return () => clearInterval(interval);
}, []);

  return {
    metrics,
    history,
    providers,
  };
}