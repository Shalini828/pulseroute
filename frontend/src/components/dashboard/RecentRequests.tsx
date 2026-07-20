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
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Recent Requests
      </h2>

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
              <td
                colSpan={3}
                className="text-center py-6 text-slate-400"
              >
                No requests yet.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={`${row.provider}-${row.createdAt}-${index}`}
                className="border-b border-slate-800"
              >
                <td className="py-4 capitalize">
                  {row.provider}
                </td>

                <td className="max-w-xs truncate">
                  {row.prompt}
                </td>

                <td>{row.responseTime} ms</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}