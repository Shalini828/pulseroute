import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { apiKeyService } from "../../services/apikey.service";
import { useProject } from "../../context/ProjectContext";

export default function Settings() {
  const { project } = useProject();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  useEffect(() => {
    if (!project) return;

    loadApiKeys();
  }, [project]);

  async function loadApiKeys() {
    if (!project) return;

    try {
      setLoadingKeys(true);

      const response = await apiKeyService.getApiKeys(project.id);

      console.log("API Keys:", response);

      setApiKeys(response.data ?? response);
    } catch (error) {
      console.error("Failed to load API keys:", error);
    } finally {
      setLoadingKeys(false);
    }
  }

  async function handleCreateKey() {
    if (!project) return;

    const name = prompt("Enter API Key name");

    if (!name) return;

    try {
      const response = await apiKeyService.createApiKey(project.id, name);

      console.log("Create API Key Response:", response);

      const fullApiKey = response.data?.apiKey;

      if (!fullApiKey) {
        alert("API Key created but full key was not returned.");
        await loadApiKeys();
        return;
      }

      await navigator.clipboard.writeText(fullApiKey);

      alert(
        `API Key copied to clipboard!\n\n${fullApiKey}\n\nSave it now. You won't be able to see it again.`,
      );

      await loadApiKeys();
    } catch (error) {
      console.error(error);
      alert("Failed to create API Key.");
    }
  }

  async function handleDelete(id: string) {
    if (!project) return;

    if (!confirm("Delete this API Key?")) return;

    try {
      await apiKeyService.deleteApiKey(project.id, id);

      await loadApiKeys();

      alert("Deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  }

  async function handleRevoke(id: string) {
    if (!project) return;

    try {
      await apiKeyService.revokeApiKey(project.id, id);

      await loadApiKeys();

      alert("Key revoked.");
    } catch (err) {
      console.error(err);
      alert("Revoke failed.");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>

          <p className="text-slate-400 mt-2">
            Manage your PulseRoute preferences.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>

              <div className="space-y-3">
                <p>
                  <span className="text-slate-400">Name:</span> {user.name}
                </p>

                <p>
                  <span className="text-slate-400">Email:</span> {user.email}
                </p>
              </div>
            </div>

            {/* Application */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Application</h2>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">API Keys</h2>

                  <button
                    onClick={handleCreateKey}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                  >
                    + Create Key
                  </button>
                </div>

                <p className="text-slate-400 mb-6">
                  Manage API keys used to access your PulseRoute gateway.
                </p>

                {loadingKeys ? (
                  <p className="text-slate-400">Loading API Keys...</p>
                ) : apiKeys.length === 0 ? (
                  <p className="text-slate-400">No API Keys found.</p>
                ) : (
                  apiKeys.map((key: any) => (
                    <div
                      key={key.id}
                      className="rounded-xl border border-slate-700 p-4 flex justify-between items-center mb-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{key.name}</p>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              key.revoked
                                ? "bg-red-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {key.revoked ? "Revoked" : "Active"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 break-all">
                          {key.prefix}...
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(key.prefix);
                            alert("API key copied!");
                          }}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                        >
                          Copy
                        </button>
                        <button
                          disabled={key.revoked}
                          onClick={() => handleRevoke(key.id)}
                          className={`px-3 py-2 rounded-lg ${
                            key.revoked
                              ? "bg-gray-700 cursor-not-allowed"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                        >
                          {key.revoked ? "Revoked" : "Revoke"}
                        </button>

                        <button
                          onClick={() => handleDelete(key.id)}
                          className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 mt-6">
                <p>
                  <span className="text-slate-400">Version:</span> v1.0.0
                </p>

                <p>
                  <span className="text-slate-400">Environment:</span>{" "}
                  Development
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
