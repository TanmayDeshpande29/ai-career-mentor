import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ email: form.email, name: "Ava Chen", role: "Product Designer" });
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
        <p className="text-sm text-slate-400">Sign in to continue your next career move.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword((current) => !current)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input type="checkbox" className="rounded border-white/10 bg-slate-950" />
            Remember me
          </label>
          <a href="#" className="text-violet-300">Forgot password?</a>
        </div>

        <Button type="submit" className="w-full">Sign in</Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        New here? <Link to="/signup" className="font-medium text-violet-300">Create your account</Link>
      </p>
    </div>
  );
}

export default LoginForm;