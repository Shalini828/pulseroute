import api from "./api";

export const projectService = {
  async getProjects() {
    const response = await api.get("/projects");
    return response.data;
  },

  async getProjectById(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: {
    name: string;
    description: string;
  }) {
    const response = await api.post("/projects", data);
    return response.data;
  },

  async updateProject(
    id: string,
    data: {
      name: string;
      description: string;
    },
  ) {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};