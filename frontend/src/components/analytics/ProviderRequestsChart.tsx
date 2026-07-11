import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

interface Metric {
  provider: string;
  totalRequests: number;
}

interface Props {
  data: Metric[];
}

export default function ProviderRequestsChart({
  data,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Requests by Provider
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="provider" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRequests" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}