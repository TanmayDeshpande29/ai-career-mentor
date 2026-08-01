import { CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SectionHeader from "@/components/shared/SectionHeader";

const milestones = [
  { title: "Refresh positioning", detail: "Craft a sharper narrative around AI products and design systems.", status: "Complete" },
  { title: "Strengthen proof points", detail: "Quantify wins and tie work to business outcomes.", status: "In progress" },
  { title: "Prepare interview stories", detail: "Turn your highlight reel into tailored STAR stories.", status: "Next" },
];

const resources = ["AI PM interview guide", "System design concepts", "Case study templates"];

function RoadmapPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Career roadmap" title="12-week growth plan" description="A focused plan to get you interview-ready and marketable." />
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-violet-300">
                    {index === 0 ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    <p className="font-medium text-white">{milestone.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{milestone.detail}</p>
                </div>
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200">{milestone.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Resources" title="Suggested materials" description="High-signal learning aids for each milestone." />
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource) => (
            <div key={resource} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-violet-300" />
              {resource}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default RoadmapPage;
