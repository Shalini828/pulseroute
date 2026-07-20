export interface CreateProviderRequest {
  name: string;
  apiKey: string;
  model: string;
  baseUrl: string;
  priority: number;
  enabled?: boolean;
}

export interface UpdateProviderRequest {
  name?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  priority?: number;
  enabled?: boolean;
}

export interface ProviderResponse {
  id: string;
  name: string;
  model: string;
  baseUrl: string;
  priority: number;
 enabled: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}