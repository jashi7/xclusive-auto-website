import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, LogIn } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { dealerInfo } from "../../mock";

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/admin");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={dealerInfo.logo} alt="Xclusive Auto" className="h-16 mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl text-white">Admin Login</h1>
          <p className="text-neutral-500 text-sm mt-1">Xclusive Auto Dashboard</p>
        </div>
        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-4">
          <div>
            <Label className="text-neutral-300 text-xs uppercase tracking-wider">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-neutral-950 border-neutral-800 text-white h-11 pl-10" placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <Label className="text-neutral-300 text-xs uppercase tracking-wider">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-neutral-950 border-neutral-800 text-white h-11 pl-10" placeholder="••••••••" required />
            </div>
          </div>
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
          <Button type="submit" disabled={busy} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold h-12 rounded-xl">
            {busy ? "Signing in..." : (<><LogIn className="w-4 h-4 mr-2" /> Sign In</>)}
          </Button>
        </form>
      </div>
    </div>
  );
}
