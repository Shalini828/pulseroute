export interface CreateProviderRequest {
  name: string;
  baseUrl: string;
  priority: number;
  enabled?: boolean;
}

export interface UpdateProviderRequest {
  name?: string;
  baseUrl?: string;
  priority?: number;
  enabled?: boolean;
}

export interface ProviderResponse {
  id: string;
  name: string;
  baseUrl: string;
  priority: number;
  enabled: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}