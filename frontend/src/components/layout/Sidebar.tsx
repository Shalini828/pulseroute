import {
  LayoutDashboard,
  Cpu,
  PlugZap,
  BarChart3,
  FileText,
  History,
  Settings,
  ListOrdered,
  FolderKanban,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const sections = [
  {
    title: "MAIN",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: Cpu,
        label: "Gateway",
        path: "/gateway",
      },
      {
        icon: BarChart3,
        label: "Analytics",
        path: "/analytics",
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        icon: FolderKanban,
        label: "Projects",
        path: "/projects",
      },
      {
        icon: PlugZap,
        label: "Providers",
        path: "/providers",
        badge: "Warn",
      },
      {
        icon: ListOrdered,
        label: "Queue",
        path: "/queue",
        badge: "0",
      },
      {
        icon: FileText,
        label: "API Keys",
        path: "/apikeys",
      },
    ],
  },
  {
    title: "MONITORING",
    items: [
      {
        icon: FileText,
        label: "Logs",
        path: "/logs",
        badge: "12",
      },
      {
        icon: History,
        label: "History",
        path: "/history",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        icon: Settings,
        label: "Settings",
        path: "/settings",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-slate-800/80 bg-[#0b1220] lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-[88px] shrink-0 items-center border-b border-slate-800/70 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-500/20">
            <LayoutDashboard
              size={21}
              className="text-blue-400"
              strokeWidth={2}
            />
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight text-white">
              PulseRoute
            </div>

            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500">
              AI Gateway Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-7">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map(
                  ({ icon: Icon, label, path, badge }) => (
                    <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) =>
                        [
                          "group relative flex h-11 items-center gap-3 rounded-xl px-3",
                          "text-sm font-medium transition-all duration-150",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                            : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-300" />
                          )}

                          <Icon
                            size={19}
                            strokeWidth={isActive ? 2.2 : 1.9}
                            className={
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-slate-200"
                            }
                          />

                          <span className="truncate">{label}</span>

                          {badge && (
                            <span
                              className={[
                                "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                badge === "Warn"
                                  ? "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                                  : "border border-slate-700 bg-slate-800 text-slate-400",
                              ].join(" ")}
                            >
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-slate-800/70 p-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Storage
            </span>

            <span className="text-xs font-semibold text-slate-200">
              68%
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: "68%" }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              PulseRoute
            </span>

            <span className="text-[11px] font-medium text-slate-400">
              v1.0
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}