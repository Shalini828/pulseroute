import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: number | null;
  trendLabel?: string;
  loading?: boolean;
  status?: "healthy" | "warning" | "critical" | "neutral";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendLabel,
  loading = false,
  status = "neutral",
}: StatCardProps) {
  const trendPositive = trend !== null && trend !== undefined && trend > 0;
  const trendNegative = trend !== null && trend !== undefined && trend < 0;

  if (loading) {
    return (
      <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />

            <div className="mt-5 h-9 w-28 animate-pulse rounded bg-slate-800" />

            <div className="mt-4 h-3 w-32 animate-pulse rounded bg-slate-800" />
          </div>

          <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-800" />
        </div>
      </div>
    );
  }

  const statusClasses = {
    healthy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    critical: "border-red-500/20 bg-red-500/10 text-red-300",
    neutral: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 sm:p-6">
      {/* Subtle hover glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>

          <p className="mt-5 whitespace-nowrap text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-3 text-xs leading-5 text-slate-500">{subtitle}</p>
          )}

          {trend !== null && trend !== undefined && (
            <div
              className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium ${
                trendPositive
                  ? "text-emerald-400"
                  : trendNegative
                    ? "text-red-400"
                    : "text-slate-500"
              }`}
            >
              {trendPositive ? (
                <ArrowUpRight size={14} />
              ) : trendNegative ? (
                <ArrowDownRight size={14} />
              ) : (
                <Minus size={14} />
              )}

              <span>
                {trend > 0 ? "+" : ""}
                {trend}%{trendLabel ? ` ${trendLabel}` : ""}
              </span>
            </div>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${statusClasses[status]}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
