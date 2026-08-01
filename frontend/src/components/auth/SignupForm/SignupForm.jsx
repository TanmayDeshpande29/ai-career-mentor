import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    signup({ name: form.name, email: form.email });
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Create your account</h2>
        <p className="text-sm text-slate-400">Start building your AI-powered career edge.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Ava Chen" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword((current) => !current)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">Create account</Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="font-medium text-violet-300">Sign in</Link>
      </p>
    </div>
  );
}

export default SignupForm;