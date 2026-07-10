import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">
        <Search className="text-slate-400" />
        <Bell className="text-slate-400" />
      </div>
    </header>
  );
}