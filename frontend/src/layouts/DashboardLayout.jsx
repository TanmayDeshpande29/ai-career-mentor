import { NavLink, Outlet } from "react-router-dom";
import { BookOpenCheck, Bot, Compass, LayoutDashboard, LogOut, Menu, Settings, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "AI Chat", to: "/dashboard/chat", icon: Bot },
  { label: "Resume", to: "/dashboard/resume", icon: BookOpenCheck },
  { label: "Roadmap", to: "/dashboard/roadmap", icon: Compass },
  { label: "Profile", to: "/dashboard/profile", icon: UserCircle2 },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#030712_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl lg:w-72">
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-violet-400">Workspace</p>
              <h2 className="text-lg font-semibold text-white">AI Career Mentor</h2>
            </div>
            <button className="rounded-full border border-white/10 p-2 text-slate-400 lg:hidden">
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
            <p className="text-sm text-violet-200">Ready to accelerate?</p>
            <p className="mt-2 text-xl font-semibold text-white">{user?.name ?? "Ava"}</p>
            <p className="text-sm text-slate-400">{user?.role ?? "Speeding up your next move"}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${isActive ? "bg-violet-500/20 text-white shadow-inner" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm font-medium text-white">Launch mode</p>
            <p className="mt-2 text-sm text-slate-400">Your interview prep and roadmap are synced. Keep going.</p>
            <Button variant="secondary" className="mt-4 w-full" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex flex-wrap items-center justify-between rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div>
              <p className="text-sm text-slate-400">Good evening</p>
              <h1 className="text-2xl font-semibold text-white">Your career engine is live.</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">New project</Button>
              <Button>Book strategy call</Button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
