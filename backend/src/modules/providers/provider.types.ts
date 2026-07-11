export interface CreateProviderRequest {
  name: string;
  baseUrl: string;
  priority: number;
}

export interface UpdateProviderRequest {
  name?: string;
  baseUrl?: string;
  priority?: number;
}

export interface ProviderResponse {
  id: string;
  name: string;
  baseUrl: string;
  priority: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}