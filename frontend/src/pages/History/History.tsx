import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";

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
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          Request History
        </h1>

        <p className="text-slate-400">
          View all AI gateway requests.
        </p>

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
      {history.map((item) => (
        <tr
          key={item.id}
          className="border-b border-slate-800"
        >
          <td className="py-4 capitalize">
            {item.provider}
          </td>

          <td>{item.prompt}</td>

          <td>{item.responseTime} ms</td>

          <td>
            {new Date(item.createdAt).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </DashboardLayout>
  );
}