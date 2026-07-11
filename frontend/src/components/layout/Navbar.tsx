import { Bell, Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-5">
  <Search className="text-slate-400 cursor-pointer" />

  <Bell className="text-slate-400 cursor-pointer" />

  <div className="flex items-center gap-2 text-slate-300">
    <User size={18} />
    <span className="text-sm">Demo User</span>
  </div>

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition"
  >
    <LogOut size={16} />
    Logout
  </button>
</div>
    </header>
  );
}