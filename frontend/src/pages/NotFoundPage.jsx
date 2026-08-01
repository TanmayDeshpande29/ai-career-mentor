import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.24),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#030712_100%)] px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
          <Compass className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-violet-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Lost in the flow?</h1>
        <p className="mt-3 text-slate-400">The page you’re looking for doesn’t exist, but your next move still can.</p>
        <Button asChild className="mt-6">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Return home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;