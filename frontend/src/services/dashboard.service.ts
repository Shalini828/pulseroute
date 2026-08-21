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

export const getQueueJobs = async () => {
  const res = await api.get("/queue");
  return res.data;
};

export const getAnalyticsOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getSystemHealth = async () => {
  const res = await api.get("/system/health");
  return res.data;
};

export const getOperationalStats = async () => {
  const res = await api.get("/analytics/operational-stats");
  return res.data;
};

// ================= API KEYS =================

export const getApiKeys = (projectId: string) => {
  return api.get(`/projects/${projectId}/apikeys`);
};

export const createApiKey = (
  projectId: string,
  data: {
    name: string;
  },
) => {
  return api.post(`/projects/${projectId}/apikeys`, data);
};

export const revokeApiKey = (projectId: string, apiKeyId: string) => {
  return api.patch(`/projects/${projectId}/apikeys/${apiKeyId}/revoke`);
};

export const deleteApiKey = (projectId: string, apiKeyId: string) => {
  return api.delete(`/projects/${projectId}/apikeys/${apiKeyId}`);
};

export const getProjects = () => {
  return api.get("/projects");
};
