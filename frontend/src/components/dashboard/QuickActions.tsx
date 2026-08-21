import { KeyRound, Play, BarChart3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    {
      title: "API Keys",
      icon: KeyRound,
      path: "/apikeys",
      color: "border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white",
    },
    {
      title: "Gateway",
      icon: Play,
      path: "/gateway",
      color:
        "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
      color:
        "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white",
    },
    {
      title: "Projects",
      icon: BookOpen,
      path: "/projects",
      color:
        "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-medium transition-all duration-200 ${action.color}`}
          >
            <Icon size={18} />
            {action.title}
          </button>
        );
      })}
    </div>
  );
}
