import api from "./api";

export const apiKeyService = {
  async getApiKeys(projectId: string) {
    const response = await api.get(
      `/projects/${projectId}/apikeys`,
    );

    return response.data;
  },

  async createApiKey(
    projectId: string,
    name: string,
  ) {
    const response = await api.post(
      `/projects/${projectId}/apikeys`,
      {
        name,
      },
    );

    return response.data;
  },

  async revokeApiKey(
    projectId: string,
    apiKeyId: string,
  ) {
    const response = await api.patch(
      `/projects/${projectId}/apikeys/${apiKeyId}/revoke`,
    );

    return response.data;
  },

  async deleteApiKey(
    projectId: string,
    apiKeyId: string,
  ) {
    const response = await api.delete(
      `/projects/${projectId}/apikeys/${apiKeyId}`,
    );

    return response.data;
  },
};