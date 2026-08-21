import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecentRequests } from "../../services/dashboard.service";

interface RecentRequest {
  provider: string;
  prompt: string;
  responseTime: number;
  createdAt: string;
}

interface Props {
  error?: string | null;
}

export default function RecentActivity({ error = null }: Props) {
  const [requests, setRequests] = useState<RecentRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getRecentRequests();
        setRequests(res.data || []);
        setLoadingRequests(false);
      } catch (err) {
        console.error(err);
        setLoadingRequests(false);
      }
    }

    load();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-sm shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            <Clock size={16} />
            Recent Requests
          </div>
          <p className="max-w-xl text-sm text-slate-400">
            Latest AI requests processed through your gateway
          </p>
        </div>

        <Link
          to="/logs"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-300 transition whitespace-nowrap"
        >
          View all logs
          <ArrowRight size={14} />
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : loadingRequests ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl border border-slate-800 bg-slate-900 animate-pulse"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-8 text-center py-8 text-slate-400">
          <p className="text-sm">No requests yet</p>
          <Link
            to="/gateway"
            className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300"
          >
            Send your first request →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {requests.slice(0, 5).map((request, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 transition duration-200 hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {request.provider}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {truncateText(request.prompt, 50)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(request.createdAt)}
                </span>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  {request.responseTime}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
