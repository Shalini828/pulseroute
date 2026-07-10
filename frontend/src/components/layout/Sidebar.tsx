import {
  LayoutDashboard,
  Cpu,
  PlugZap,
  BarChart3,
  FileText,
  History,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Cpu, label: "Gateway" },
  { icon: PlugZap, label: "Providers" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Logs" },
  { icon: History, label: "History" },
  { icon: Settings, label: "Settings" },
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
        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition mb-2"
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}