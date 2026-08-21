import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Database,
  ListChecks,
  Loader2,
  PlugZap,
  Server,
  type LucideIcon,
} from "lucide-react";

interface ServiceHealth {
  name: string;
  status: "healthy" | "warning" | "unhealthy";
  responseTime?: number;
  message?: string;
  icon?: LucideIcon;
}

interface Props {
  services?: ServiceHealth[];
  overallStatus?: "healthy" | "degraded" | "unhealthy";
  loading?: boolean;
  error?: string | null;
}

const defaultIcons: Record<string, LucideIcon> = {
  "API Gateway": Server,
  Database,
  Queue: ListChecks,
  "Cache (Redis)": PlugZap,
  Providers: PlugZap,
};

const statusConfig = {
  healthy: {
    label: "Healthy",
    text: "text-emerald-300",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/15",
    dot: "bg-emerald-400",
    statusIcon: CheckCircle2,
  },
  warning: {
    label: "Warning",
    text: "text-amber-300",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/15",
    dot: "bg-amber-400",
    statusIcon: AlertTriangle,
  },
  unhealthy: {
    label: "Unhealthy",
    text: "text-red-300",
    iconBg: "bg-red-500/10",
    iconBorder: "border-red-500/15",
    dot: "bg-red-400",
    statusIcon: AlertCircle,
  },
} as const;

function getStatusFromOverall(
  status: Props["overallStatus"],
): keyof typeof statusConfig {
  if (status === "unhealthy") return "unhealthy";
  if (status === "degraded") return "warning";
  return "healthy";
}

export default function SystemHealth({
  services = [],
  overallStatus = "healthy",
  loading = false,
  error = null,
}: Props) {
  const healthyCount = services.filter(
    (service) => service.status === "healthy",
  ).length;

  const warningCount = services.filter(
    (service) => service.status === "warning",
  ).length;

  const unhealthyCount = services.filter(
    (service) => service.status === "unhealthy",
  ).length;

  const totalServices = services.length;

  const derivedStatus =
    unhealthyCount > 0
      ? "unhealthy"
      : warningCount > 0
        ? "warning"
        : "healthy";

  const effectiveStatus =
    services.length > 0
      ? derivedStatus
      : getStatusFromOverall(overallStatus);

  const headerConfig = statusConfig[effectiveStatus];

  const headerLabel =
    loading
      ? "Checking infrastructure..."
      : error
        ? "Health check unavailable"
        : totalServices === 0
          ? "No health data"
          : effectiveStatus === "healthy"
            ? `${healthyCount}/${totalServices} Healthy`
            : effectiveStatus === "warning"
              ? `${healthyCount}/${totalServices} Healthy`
              : "System Issues";

  return (
    <section className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              System Health
            </span>

            {!loading && !error && totalServices > 0 && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${headerConfig.dot}`}
              />
            )}
          </div>

          <h2 className="mt-2 text-lg font-semibold text-white">
            Infrastructure status
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {loading
              ? "Checking the health of your gateway infrastructure..."
              : error
                ? "We could not retrieve the latest infrastructure status."
                : "Live status of the services powering your AI gateway."}
          </p>
        </div>

        {/* Overall status */}
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
            loading
              ? "border-slate-700 bg-slate-900 text-slate-300"
              : error
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : `${headerConfig.iconBorder} ${headerConfig.iconBg} ${headerConfig.text}`
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Checking</span>
            </>
          ) : error ? (
            <>
              <AlertCircle size={14} />
              <span>Unavailable</span>
            </>
          ) : (
            <>
              <span
                className={`h-1.5 w-1.5 rounded-full ${headerConfig.dot}`}
              />
              <span>{headerLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {!loading && !error && services.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-800/70 py-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{healthyCount} Healthy</span>
          </div>

          {warningCount > 0 && (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>{warningCount} Warning</span>
            </div>
          )}

          {unhealthyCount > 0 && (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span>{unhealthyCount} Unhealthy</span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <div>
            <p className="text-sm font-medium text-red-300">
              Unable to load system health
            </p>

            <p className="mt-1 text-xs leading-5 text-red-300/70">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[84px] animate-pulse rounded-xl border border-slate-800 bg-slate-900/70"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && services.length === 0 && (
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-10 text-center">
          <Server size={22} className="text-slate-500" />

          <p className="mt-3 text-sm font-medium text-slate-300">
            No service health data
          </p>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            The backend has not returned any infrastructure health checks yet.
          </p>
        </div>
      )}

      {/* Services */}
      {!loading && !error && services.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {services.map((service) => {
            const config = statusConfig[service.status];

            const ServiceIcon =
              service.icon ?? defaultIcons[service.name] ?? Server;

            const StatusIcon = config.statusIcon;

            return (
              <div
                key={service.name}
                className="group flex min-h-[84px] items-center justify-between gap-4 rounded-xl border border-slate-800/90 bg-slate-900/60 px-4 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900"
              >
                {/* Service information */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.iconBg} ${config.iconBorder}`}
                  >
                    <ServiceIcon
                      size={18}
                      className={config.text}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-100">
                        {service.name}
                      </p>

                      <span
                        className={`hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline-flex ${config.iconBg} ${config.text}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {service.message || config.label}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex shrink-0 items-center gap-3">
                  {service.responseTime != null && (
                    <span className="text-xs tabular-nums text-slate-500">
                      {service.responseTime}ms
                    </span>
                  )}

                  <StatusIcon
                    size={17}
                    className={config.text}
                    strokeWidth={2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}