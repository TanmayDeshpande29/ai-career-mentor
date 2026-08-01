import { UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";

const highlights = [
  { label: "Skills", value: "Product design, React, AI workflows" },
  { label: "Strengths", value: "Strategic thinking, storytelling, execution" },
  { label: "Weaknesses", value: "Need clearer metrics and stronger leadership framing" },
  { label: "Suggestions", value: "Add impact-driven bullet points and quantify wins" },
];

function ResumePage() {
  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Resume intelligence" title="Upload and analyze your résumé" description="Get a recruiter-grade review with structure, clarity, and ATS guidance." />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-slate-950/70 px-8 py-16 text-center">
            <UploadCloud className="h-12 w-12 text-violet-300" />
            <h3 className="mt-4 text-xl font-semibold text-white">Drop your resume here</h3>
            <p className="mt-2 max-w-lg text-sm text-slate-400">PDF and DOCX uploads are supported. We’ll extract the essentials and score it for ATS fit.</p>
            <Button className="mt-6">Choose file</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <SectionHeader eyebrow="ATS score" title="67 / 100" description="Strong baseline with a few strategic gaps." />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-3 rounded-full bg-white/10">
              <div className="h-3 w-[67%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Top opportunities: add more role-specific keywords, emphasize measurable outcomes, and tighten section headings.
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <SectionHeader eyebrow="Analysis" title="Resume snapshot" description="A practical summary of the strengths and gaps in your current draft." />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-violet-300">{item.label}</p>
                <p className="mt-2 text-sm text-slate-300">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResumePage;
