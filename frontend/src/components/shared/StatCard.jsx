import { Card, CardContent } from "@/components/ui/card";

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300"><Icon className="h-5 w-5" /></div> : null}
      </CardContent>
    </Card>
  );
}

export default StatCard;
