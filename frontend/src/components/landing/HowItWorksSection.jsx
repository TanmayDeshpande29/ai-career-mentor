import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { title: "Tell us your goals", description: "Share your target roles, timeline, and current strengths." },
  { title: "Get tailored guidance", description: "Receive a custom roadmap, resume feedback, and interview prep." },
  { title: "Ship with momentum", description: "Use clear next steps to keep moving every week." },
];

function HowItWorksSection() {
  return (
    <section className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-400">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">A calm, focused system for ambitious career growth.</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                  {index === 0 ? <Sparkles className="h-5 w-5" /> : index === 1 ? <BrainCircuit className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
