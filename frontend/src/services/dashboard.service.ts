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
  const res = await api.get("/providers/health");
  return res.data;
};

export const getLogs = async () => {
  const res = await api.get("/logs");
  return res.data;
};