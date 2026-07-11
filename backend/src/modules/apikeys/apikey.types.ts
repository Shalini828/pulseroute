export interface CreateApiKeyRequest {
  name: string;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  prefix: string;
  createdAt: Date;
  revoked: boolean;
  projectId: string;
}