import { useEffect, useState } from "react";
import {
  getHistory,
  getMetrics,
  getProviders,
} from "../services/dashboard.service";

export default function useDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [history, setHistory] = useState([]);
  const [providers, setProviders] = useState([]);

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
  }, []);

  return {
    metrics,
    history,
    providers,
  };
}