import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";

const settingsGroups = [
  { title: "Profile", description: "Update your professional identity and preferences." },
  { title: "Password", description: "Secure your account with a fresh password." },
  { title: "Theme", description: "Choose a workspace aesthetic that suits your focus." },
  { title: "Notifications", description: "Control how often you receive updates and nudges." },
  { title: "API Keys", description: "Connect external tools and automation flows." },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Settings" title="Workspace preferences" description="Shape how your experience feels and behaves." />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {settingsGroups.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              <Button variant="ghost" className="mt-4 px-0">Manage</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;