import { Link, NavLink } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-medium"
      : "text-slate-400 hover:text-white transition";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <BrainCircuit className="h-8 w-8 text-violet-500" />

          <span className="text-xl font-bold text-white">
            AI Career Mentor
          </span>

        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <a
            href="#features"
            className="text-slate-400 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-slate-400 transition hover:text-white"
          >
            About
          </a>

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            asChild
          >
            <Link to="/login">
              Login
            </Link>
          </Button>

          <Button
            asChild
          >
            <Link to="/signup">
              Get Started
            </Link>
          </Button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;