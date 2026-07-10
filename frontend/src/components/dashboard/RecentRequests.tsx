import { useEffect, useState } from "react";
import api from "../../services/api";

interface Request {
  id: string;
  provider: string;
  prompt: string;
  responseTime: number;
}

export default function RecentRequests() {
  const [rows, setRows] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/gateway/history");
        setRows((res.data.history || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Requests</h2>

      <table className="w-full">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="text-left py-3">Provider</th>
            <th className="text-left py-3">Prompt</th>
            <th className="text-left py-3">Latency</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-slate-400">
                No requests yet.
              </td>
            </tr>
          ) : (
            rows.slice(0, 5).map((row) => (
              <tr key={row.id} className="border-b border-slate-800">
                <td className="py-4 capitalize">{row.provider}</td>

                <td>{row.prompt}</td>

                <td>{row.responseTime} ms</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
