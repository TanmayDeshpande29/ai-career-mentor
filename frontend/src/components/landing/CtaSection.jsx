import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function CtaSection() {
  return (
    <section className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-violet-500/20 bg-gradient-to-r from-violet-500/15 to-indigo-500/10 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">Ready to begin?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Turn your next ambition into a concrete plan.</h2>
            <p className="mt-3 text-lg text-slate-400">Join the founders, builders, and operators creating momentum with a smarter career system.</p>
          </div>
          <Button asChild size="lg" className="px-6">
            <Link to="/signup">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
