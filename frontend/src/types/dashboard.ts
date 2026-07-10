export interface Metric {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  status: string;
}

export interface HistoryItem {
  id: string;
  provider: string;
  prompt: string;
  response: string;
  responseTime: number;
  createdAt: string;
}