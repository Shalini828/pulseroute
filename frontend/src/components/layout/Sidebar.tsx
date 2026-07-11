import {
  LayoutDashboard,
  Cpu,
  PlugZap,
  BarChart3,
  FileText,
  History,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
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
    icon: PlugZap,
    label: "Providers",
    path: "/providers",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: FileText,
    label: "Logs",
    path: "/logs",
  },
  {
    icon: History,
    label: "History",
    path: "/history",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-500">
          PulseRoute
        </h1>
      </div>

      <nav className="px-4">
        {menuItems.map(({ icon: Icon, label, path }) => (
  <NavLink
    key={label}
    to={path}
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    <Icon size={20} />
    {label}
  </NavLink>
))}
      </nav>
    </aside>
  );
}