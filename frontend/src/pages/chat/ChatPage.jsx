import { useMemo, useState } from "react";
import { MessageSquareText, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/shared/SectionHeader";

const initialThreads = [
  { role: "assistant", content: "I can help you improve your story for an AI product role. What do you want to optimize first?" },
  { role: "user", content: "Help me shape a stronger intro for my portfolio." },
];

const suggestions = ["Refine my resume summary", "Mock a product design interview", "Plan my next 30 days"];

function ChatPage() {
  const [threads, setThreads] = useState(initialThreads);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sidebarItems = useMemo(() => [
    "Interview prep",
    "Resume polishing",
    "Role evaluation",
  ], [ ]);

  const handleSend = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const nextThreads = [...threads, { role: "user", content: draft.trim() }];
    setThreads(nextThreads);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      setThreads((current) => [
        ...current,
        {
          role: "assistant",
          content: "That is a strong direction. I’d frame your experience around measurable outcomes, a clear AI narrative, and one standout proof point.",
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.3fr_1fr]">
      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="Conversations" title="Threads" description="Keep your thinking organized." />
        </CardHeader>
        <CardContent className="space-y-3">
          {sidebarItems.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
              <div className="flex items-center gap-2"> <MessageSquareText className="h-4 w-4 text-violet-300" /> {item}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <SectionHeader eyebrow="AI mentor" title="Career guidance chat" description="Claude-style, high-signal replies tailored to your growth." />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button key={item} className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
            {threads.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-violet-600/20 text-white" : "bg-white/5 text-slate-300"}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-violet-300" />
                    Typing…
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSend} className="flex gap-3">
            <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask for resume, roadmap, or interview support..." className="h-12 rounded-2xl border-white/10 bg-slate-950/70 px-4" />
            <Button type="submit" className="h-12 px-4">
              <SendHorizonal className="mr-2 h-4 w-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatPage;
