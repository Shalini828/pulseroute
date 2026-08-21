import DashboardLayout from "../../components/layout/DashboardLayout";
import { useProject } from "../../context/ProjectContext";
import { useEffect, useState } from "react";
import { apiKeyService } from "../../services/apikey.service";

export default function ApiKeys() {
  const { project, loading } = useProject();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  useEffect(() => {
    async function loadApiKeys() {
      if (!project?.id) return;

      try {
        const response = await apiKeyService.getApiKeys(project.id);

        console.log("API Keys Response:", response);

        setApiKeys(response.data ?? []);
      } catch (error) {
        console.error("Failed to load API keys:", error);
      } finally {
        setLoadingKeys(false);
      }
    }

    loadApiKeys();
  }, [project]);

  if (loading || loadingKeys) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">API Keys</h1>

        <p className="text-slate-400">Manage API keys for project:</p>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">{project?.name}</h2>

          <p className="mt-2 text-slate-400">Project ID:</p>

          <code className="text-blue-400">{project?.id}</code>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">API Keys</h2>

          {apiKeys.length === 0 ? (
            <p className="text-slate-400">No API Keys found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3">Name</th>
                  <th className="py-3">Key</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {apiKeys.map((key: any) => (
                  <tr key={key.id} className="border-b border-slate-800">
                    <td className="py-3">{key.name}</td>

                    <td className="py-3 font-mono">{key.key}</td>

                    <td className="py-3">
                      {key.revoked ? (
                        <span className="text-red-400">Revoked</span>
                      ) : (
                        <span className="text-green-400">Active</span>
                      )}
                    </td>

                    <td className="py-3">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
