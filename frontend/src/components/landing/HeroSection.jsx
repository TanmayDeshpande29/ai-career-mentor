import { ArrowRight, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2">
          <p className="text-sm text-violet-300">
            🚀 Powered by Agentic AI
          </p>
        </div>

        <BrainCircuit
          className="mb-8 h-20 w-20 text-violet-500"
        />

        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
          Build Your
          <span className="text-violet-500">
            {" "}AI Career{" "}
          </span>
          Faster
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Resume Analysis, AI Interview Preparation,
          Career Roadmaps, Coding Guidance and
          Personalized Learning — all inside one platform.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
          >
            <Link to="/login">
              Login
            </Link>
          </Button>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;