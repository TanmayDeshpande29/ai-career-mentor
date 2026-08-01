import { ArrowRight, BarChart3, BrainCircuit, BookOpenCheck, Compass, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const recentChats = [
  { title: "Interview prep for product design", time: "12m ago" },
  { title: "Resume polish for AI PM role", time: "1h ago" },
  { title: "Roadmap for full-stack build", time: "Yesterday" },
];

const recommendations = [
  { title: "Build a portfolio narrative", meta: "6 lessons" },
  { title: "Practice AI product case studies", meta: "2 mock interviews" },
  { title: "Refine LinkedIn positioning", meta: "1 checklist" },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-slate-900/80 to-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">Weekly momentum</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Your growth plan is moving fast.</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              You have three high-impact objectives lined up: tighten your resume, sharpen your interview narrative, and prepare for your next role move.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/chat">Continue session <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resume score" value="91/100" hint="ATS ready" icon={Sparkles} />
        <StatCard label="Learning streak" value="12 days" hint="Consistency is compounding" icon={TrendingUp} />
        <StatCard label="Roadmap progress" value="68%" hint="2 milestones remaining" icon={Compass} />
        <StatCard label="Mentor sessions" value="4" hint="Next in 2 hours" icon={BrainCircuit} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <SectionHeader eyebrow="Recent activity" title="Recent chats" description="Your latest AI conversations stay in one place." />
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChats.map((chat) => (
              <div key={chat.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{chat.title}</p>
                  <p className="text-sm text-slate-400">{chat.time}</p>
                </div>
                <Button variant="ghost" size="sm">Open</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <SectionHeader eyebrow="Suggested next step" title="Recommended learning" description="High-signal resources to keep momentum." />
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-500/10 p-2 text-violet-300"><BookOpenCheck className="h-4 w-4" /></div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Performance" title="Momentum snapshot" description="A quick view of your career engine health." />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-violet-300"><BarChart3 className="h-4 w-4" /> <span className="text-sm">Weekly focus</span></div>
            <p className="mt-3 text-xl font-semibold text-white">Resume + interview prep</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-violet-300"><Sparkles className="h-4 w-4" /> <span className="text-sm">Mentor energy</span></div>
            <p className="mt-3 text-xl font-semibold text-white">Very high</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-violet-300"><TrendingUp className="h-4 w-4" /> <span className="text-sm">Confidence</span></div>
            <p className="mt-3 text-xl font-semibold text-white">+18% this week</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
