import api from "./api";

export const getMetrics = async () => {
  const res = await api.get("/metrics");
  return res.data;
};

export const getHistory = async () => {
  const res = await api.get("/gateway/history");
  return res.data;
};

export const getProviders = async () => {
  const res = await api.get("/providers");
  return res.data;
};

export const getOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getProviderAnalytics = async () => {
  const res = await api.get("/analytics/providers");
  return res.data;
};

export const getDailyAnalytics = async () => {
  const res = await api.get("/analytics/daily");
  return res.data;
};

export const getRecentRequests = async () => {
  const res = await api.get("/analytics/recent");
  return res.data;
};

export const getLogs = async () => {
  const res = await api.get("/logs");
  return res.data;
};

export const getCacheStats = async () => {
  const res = await api.get("/cache/stats");
  return res.data;
};