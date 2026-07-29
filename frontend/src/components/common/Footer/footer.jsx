import { BrainCircuit, Mail } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">

        <div className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-violet-500" />

          <div>
            <h2 className="text-lg font-semibold text-white">
              AI Career Mentor
            </h2>

            <p className="text-sm text-slate-400">
              Learn • Build • Get Hired
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="mailto:example@gmail.com"
            className="text-slate-400 transition hover:text-white"
          >
            <Mail />
          </a>
        </div>

      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        © {year} AI Career Mentor. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;