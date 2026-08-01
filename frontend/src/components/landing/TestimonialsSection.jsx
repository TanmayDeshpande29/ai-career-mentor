import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "The resume feedback felt sharper than anything I’d seen before. It translated directly into interviews.",
    name: "Maya Patel",
    role: "Product Designer",
  },
  {
    quote: "The roadmap made a noisy career search feel calm and methodical. I finally had a plan.",
    name: "Jordan Liu",
    role: "Frontend Engineer",
  },
  {
    quote: "The mentor experience was incredibly practical. It helped me frame my story and move faster.",
    name: "Amara Brooks",
    role: "AI PM",
  },
];

function TestimonialsSection() {
  return (
    <section className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-400">Testimonials</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Trusted by people building serious momentum.</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <p className="text-slate-300">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
