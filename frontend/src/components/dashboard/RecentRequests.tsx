import { CheckCircle2, Clock3 } from "lucide-react";

interface RecentRequest {
  provider: string;
  prompt: string;
  responseTime: number;
  createdAt: string;
}

interface Props {
  rows: RecentRequest[];
}

export default function RecentRequests({ rows }: Props) {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "gemini":
        return "bg-blue-500/15 text-blue-400";

      case "groq":
        return "bg-purple-500/15 text-purple-400";

      case "openai":
        return "bg-emerald-500/15 text-emerald-400";

      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Recent Requests
        </h2>

        <span className="text-sm text-slate-400">
          {rows.length} requests
        </span>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-sm text-slate-400">

              <th className="pb-4">Provider</th>

              <th className="pb-4">Prompt</th>

              <th className="pb-4">Status</th>

              <th className="pb-4">Latency</th>

              <th className="pb-4">Time</th>

            </tr>

          </thead>

          <tbody>

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >
                  No requests yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={`${row.provider}-${row.createdAt}-${index}`}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getProviderColor(
                        row.provider,
                      )}`}
                    >
                      {row.provider}
                    </span>
                  </td>

                  <td className="max-w-xs truncate text-slate-300">
                    {row.prompt}
                  </td>

                  <td>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                      <CheckCircle2 size={14} />
                      Success
                    </span>
                  </td>

                  <td className="font-medium">
                    {row.responseTime} ms
                  </td>

                  <td className="text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock3 size={14} />
                      {new Date(row.createdAt).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}