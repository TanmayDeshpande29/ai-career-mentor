import {
  BrainCircuit,
  FileSearch,
  GraduationCap,
  MessageSquareCode,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Mentor",
    description:
      "Get personalised career guidance powered by modern LLMs.",
  },
  {
    icon: FileSearch,
    title: "Resume Review",
    description:
      "Analyse your resume and receive actionable feedback.",
  },
  {
    icon: GraduationCap,
    title: "Career Roadmaps",
    description:
      "Structured learning paths based on your goals.",
  },
  {
    icon: MessageSquareCode,
    title: "Interview Practice",
    description:
      "Prepare with AI-generated technical and HR interview questions.",
  },
];

function FeatureSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold">
          Everything You Need
        </h2>

        <p className="mt-4 text-slate-400">
          One platform for your complete AI career journey.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-violet-500"
            >
              <Icon className="mb-5 h-10 w-10 text-violet-500" />

              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
}

export default FeatureSection;