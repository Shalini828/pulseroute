import {
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Check,
  X,
  Settings,
  UserCircle,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../context/ProjectContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { project, projects, setProject } = useProject();

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const projectName = project?.name || "No Project";

  const handleProjectSelect = (selectedProject: typeof project) => {
    if (!selectedProject) return;

    setProject(selectedProject);
    setProjectMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    console.log("Searching for:", searchQuery);

    // For now, search UI is functional.
    // We can connect this to your actual backend search later.
  };

  return (
    <header className="sticky top-0 z-40 flex h-[88px] w-full items-center justify-between border-b border-slate-800/80 bg-[#0b1220]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Right controls */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span className="text-xs font-medium text-emerald-300">
            Gateway Online
          </span>
        </div>

        <span className="text-slate-700">•</span>

        <span className="text-xs text-slate-500">AI Gateway</span>
      </div>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {/* ================= PROJECT SELECTOR ================= */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => {
              setProjectMenuOpen((previous) => !previous);
              setNotificationOpen(false);
              setUserMenuOpen(false);
            }}
            className="flex h-12 items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 text-left transition-colors hover:border-slate-600 hover:bg-slate-800"
          >
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Project
              </span>

              <span className="max-w-[120px] truncate text-sm font-semibold text-slate-100">
                {projectName}
              </span>
            </div>

            <ChevronDown
              size={15}
              className={`shrink-0 text-slate-500 transition-transform ${
                projectMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {projectMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="border-b border-slate-800 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Switch Project
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {projects.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-slate-500">
                    No projects available
                  </p>
                ) : (
                  projects.map((item) => {
                    const isSelected = item.id === project?.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleProjectSelect(item)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition ${
                          isSelected
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>

                          {item.description && (
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <Check
                            size={17}
                            className="ml-3 shrink-0 text-blue-400"
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= SEARCH ================= */}
        <div className="relative">
          <button
            type="button"
            aria-label="Search"
            title="Search"
            onClick={() => {
              setSearchOpen((previous) => !previous);
              setNotificationOpen(false);
              setUserMenuOpen(false);
              setProjectMenuOpen(false);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            <Search size={19} strokeWidth={1.8} />
          </button>

          {searchOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3">
                  <Search size={17} className="shrink-0 text-slate-500" />

                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </form>

              <p className="mt-3 px-1 text-xs text-slate-500">
                Search your PulseRoute dashboard
              </p>
            </div>
          )}
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => {
              setNotificationOpen((previous) => !previous);
              setSearchOpen(false);
              setUserMenuOpen(false);
              setProjectMenuOpen(false);
            }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-[#0b1220]" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <p className="text-sm font-semibold text-white">
                  Notifications
                </p>

                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
                  1 New
                </span>
              </div>

              <div className="p-2">
                <div className="rounded-lg p-3 hover:bg-slate-800">
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400" />

                    <div>
                      <p className="text-sm text-slate-200">
                        Welcome to PulseRoute
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Your AI Gateway dashboard is ready.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-3 text-center text-xs text-slate-600">
                  No other notifications
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-slate-800 sm:block" />

        {/* ================= USER ================= */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((previous) => !previous);
              setSearchOpen(false);
              setNotificationOpen(false);
              setProjectMenuOpen(false);
            }}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-800/70"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <User size={17} className="text-blue-400" strokeWidth={1.9} />
            </div>

            <div className="hidden min-w-0 text-left md:block">
              <p className="truncate text-sm font-medium text-slate-200">
                Demo User
              </p>

              <p className="text-[11px] text-slate-500">Administrator</p>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-500 transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              {/* User info */}
              <div className="border-b border-slate-800 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                    <User size={18} className="text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Demo User
                    </p>

                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <UserCircle size={17} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-sm font-medium text-red-300 transition-all hover:border-red-500/30 hover:bg-red-500/15 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
        >
          <LogOut size={16} strokeWidth={1.9} />

          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
