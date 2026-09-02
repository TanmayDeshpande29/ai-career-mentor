import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/shared/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword, getPreferences, updateAccount, updatePreferences } from "@/services/settingsService";

function SettingsPage() {
  const { user, accessToken, updateUser } = useAuth();
  const [account, setAccount] = useState({ full_name: user?.name || "", email: user?.email || "" });
  const [password, setPassword] = useState({ current_password: "", new_password: "" });
  const [preferences, setPreferences] = useState({ email_notifications: true, career_updates: true, ai_notifications: true });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { getPreferences(accessToken).then(setPreferences).catch(() => setError("Unable to load notification preferences.")); }, [accessToken]);
  async function saveAccount(event) { event.preventDefault(); setSaving(true); setError(""); try { const updated = await updateAccount(account, accessToken); updateUser(updated); setMessage("Account details updated."); } catch { setError("Unable to update account details."); } finally { setSaving(false); } }
  async function savePassword(event) { event.preventDefault(); setSaving(true); setError(""); try { await changePassword(password, accessToken); setPassword({ current_password: "", new_password: "" }); setMessage("Password updated."); } catch (requestError) { setError(requestError.response?.data?.detail || "Unable to update password."); } finally { setSaving(false); } }
  async function savePreferences() { try { await updatePreferences(preferences, accessToken); setMessage("Notification preferences updated."); } catch { setError("Unable to update notification preferences."); } }

  return <div className="space-y-6">
    {message && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
    {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
    <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="Profile" title="Account details" description="Update the information associated with your account." /></CardHeader><CardContent><form onSubmit={saveAccount} className="space-y-4"><Input value={account.full_name} onChange={(event) => setAccount({ ...account, full_name: event.target.value })} placeholder="Full name" required /><Input type="email" value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} placeholder="Email" required /><Button disabled={saving}>Save account</Button></form></CardContent></Card>
    <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="Security" title="Change password" description="Your password is hashed before it is stored." /></CardHeader><CardContent><form onSubmit={savePassword} className="space-y-4"><Input type="password" value={password.current_password} onChange={(event) => setPassword({ ...password, current_password: event.target.value })} placeholder="Current password" required /><Input type="password" minLength="8" value={password.new_password} onChange={(event) => setPassword({ ...password, new_password: event.target.value })} placeholder="New password" required /><Button disabled={saving}>Update password</Button></form></CardContent></Card>
    <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="Notifications" title="Notification preferences" description="Choose which updates you receive." /></CardHeader><CardContent className="space-y-3">{Object.entries(preferences).map(([key, value]) => <label key={key} className="flex items-center gap-3 text-sm capitalize text-slate-300"><input type="checkbox" checked={value} onChange={(event) => setPreferences({ ...preferences, [key]: event.target.checked })} />{key.replaceAll("_", " ")}</label>)}<Button onClick={savePreferences}>Save preferences</Button></CardContent></Card>
    <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="API keys" title="Integrations" description="API key management will be available when integrations are configured." /></CardHeader></Card>
  </div>;
}

export default SettingsPage;