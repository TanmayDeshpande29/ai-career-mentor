import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpenCheck, Compass, Sparkles } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardSummary } from "@/services/dashboardService";

function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getDashboardSummary(accessToken).then(setSummary).catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load your dashboard.")); }, [accessToken]);
  if (!summary && !error) return <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-slate-400">Loading your dashboard...</div>;
  if (error) return <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">{error}</div>;
  return <div className="space-y-6"><Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-slate-900/80 to-slate-950/70"><CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm uppercase tracking-[0.3em] text-violet-300">Welcome back</p><h2 className="mt-3 text-3xl font-semibold text-white">{user?.name || "Your dashboard"}</h2><p className="mt-3 text-slate-400">Your career workspace is ready for the next step.</p></div><Button asChild><Link to="/dashboard/chat">Open chat <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Resume score" value={summary.has_resume ? "Not analyzed" : "0"} hint={summary.has_resume ? "AI analysis not configured" : "No resume uploaded yet"} icon={Sparkles} /><StatCard label="Learning streak" value={`${summary.learning_streak} days`} hint="Tracking starts with activity" icon={BarChart3} /><StatCard label="Roadmap progress" value={`${summary.roadmap_progress}%`} hint={summary.has_roadmap ? "No completed items yet" : "No roadmap generated yet"} icon={Compass} /><StatCard label="Mentor sessions" value={summary.mentor_sessions} hint={summary.mentor_sessions ? "Conversations saved" : "No mentor sessions yet"} icon={BookOpenCheck} /></div><Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="Recent activity" title="Recent chats" description="Saved conversations will appear here." /></CardHeader><CardContent>{summary.recent_activity?.length ? summary.recent_activity.map((item) => <div key={item.id}>{item.title}</div>) : <p className="text-sm text-slate-400">No recent activity.</p>}</CardContent></Card></div>;
}
export default DashboardPage;