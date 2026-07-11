import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Download } from "lucide-react";

export default function History() {
  interface HistoryItem {
    id: string;
    provider: string;
    prompt: string;
    response: string;
    responseTime: number;
    createdAt: string;
  }

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/gateway/history");
        setHistory(res.data.history);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  const exportCSV = () => {
  const headers = [
    "Provider",
    "Prompt",
    "Latency (ms)",
    "Date",
  ];

  const rows = history.map((item) => [
    item.provider,
    item.prompt,
    item.responseTime,
    new Date(item.createdAt).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "request-history.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Request History</h1>

        <div className="flex justify-between items-center">
          <p className="text-slate-400">View all AI gateway requests.</p>

          <button
          onClick={exportCSV}
           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="mt-6 flex gap-4">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          >
            <option>All</option>
            <option>Gemini</option>
            <option>Groq</option>
            <option>OpenAI</option>
          </select>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-3">Provider</th>
                <th className="py-3">Prompt</th>
                <th className="py-3">Latency</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {history
                .filter((item) =>
                  item.prompt.toLowerCase().includes(search.toLowerCase()),
                )
                .filter(
                  (item) =>
                    providerFilter === "All" ||
                    item.provider.toLowerCase() ===
                      providerFilter.toLowerCase(),
                )
                .map((item) => (
                  <tr key={item.id} className="border-b border-slate-800">
                    <td className="py-4 capitalize">{item.provider}</td>

                    <td>{item.prompt}</td>

                    <td>{item.responseTime} ms</td>

                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
