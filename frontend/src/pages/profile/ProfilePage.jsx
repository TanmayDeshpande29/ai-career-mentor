import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Profile" title="About you" description="Your professional identity, ready to impress." />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-lg font-semibold text-violet-200">
              {user?.avatar ?? "AC"}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name ?? "Ava Chen"}</p>
              <p className="text-sm text-slate-400">{user?.role ?? "Product Designer"}</p>
              <p className="text-sm text-slate-500">{user?.email ?? "ava@mentor.ai"}</p>
            </div>
          </div>
          <Button className="w-full">Edit profile</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Focus" title="Current positioning" description="A concise view of the story you’re telling the market." />
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Designing AI-native experiences with a blend of product strategy, systems thinking, and polished execution.</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Strongest signals: user empathy, product intuition, technical fluency, and thoughtful communication.</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Next target: senior product designer or AI product strategist roles.</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
