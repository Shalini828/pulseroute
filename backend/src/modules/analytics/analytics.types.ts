export interface AnalyticsOverview {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeProviders: number;
}

export interface ProviderAnalytics {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  successRate: number;
}

export interface DailyAnalytics {
  date: string;
  requests: number;
}

export interface RecentRequest {
  provider: string;
  prompt: string;
  responseTime: number;
  createdAt: Date;
}