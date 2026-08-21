import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

interface HistoryItem {
  id: string;
  provider: string;
  prompt: string;
  response: string;
  responseTime: number;
  createdAt: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/gateway/history");
        setHistory(res.data.history || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, providerFilter]);

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

  const filteredHistory = history
    .filter((item) =>
      item.prompt
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((item) =>
      providerFilter === "All"
        ? true
        : item.provider.toLowerCase() ===
          providerFilter.toLowerCase()
    );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / itemsPerPage),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          Request History
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-slate-400">
            View all AI gateway requests.
          </p>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 transition hover:bg-blue-700"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="mt-6 flex gap-4">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={providerFilter}
            onChange={(e) =>
              setProviderFilter(e.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          >
            <option>All</option>
            <option>Gemini</option>
            <option>Unknown</option>
          </select>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4">Provider</th>
                <th className="p-4">Prompt</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-slate-400"
                  >
                    No requests found.
                  </td>
                </tr>
              ) : (
                filteredHistory
                  .slice(
                    (currentPage - 1) *
                      itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-slate-900"
                    >
                      <td className="p-4">
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 capitalize">
                          {item.provider}
                        </span>
                      </td>

                      <td className="max-w-md truncate p-4">
                        {item.prompt}
                      </td>

                      <td className="p-4">
                        <span
                          className={
                            item.responseTime >
                            5000
                              ? "font-semibold text-red-400"
                              : "font-semibold text-green-400"
                          }
                        >
                          {item.responseTime} ms
                        </span>
                      </td>

                      <td className="p-4 text-slate-300">
                        {new Date(
                          item.createdAt,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-800 p-4">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) => p - 1)
              }
              className={`rounded-lg px-5 py-2 ${
                currentPage === 1
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              ← Previous
            </button>

            <span className="text-slate-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) => p + 1)
              }
              className={`rounded-lg px-5 py-2 ${
                currentPage >= totalPages
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}