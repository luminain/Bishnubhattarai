import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { api } from "@/lib/api";
import { ADMIN } from "@/constants/testIds";

export default function AdminLogin() {
  const [email, setEmail] = useState("bishnu@bbchauffeur.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("bb_admin_token", res.data.access_token);
      localStorage.setItem("bb_admin_email", res.data.email);
      toast.success("Welcome back, Bishnu.");
      nav("/admin");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#07080A] px-5 hero-radial">
      <div className="w-full max-w-md card-lux chrome-rule p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[#3A465B] bg-[#0F1216] flex items-center justify-center">
            <Lock size={18} className="text-[#B08D57]" />
          </div>
          <div>
            <div className="font-serif text-2xl text-[#E7EBF2]">Admin Access</div>
            <div className="text-xs text-[#9AA3B2]">Bishnu Bhattarai · Private Chauffeur</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="block lux-kicker mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                   className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={ADMIN.emailInput} />
          </div>
          <div>
            <label className="block lux-kicker mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={ADMIN.passwordInput} />
          </div>
          <button type="submit" disabled={loading}
                  className="btn-lux-primary w-full h-12 rounded-md text-sm disabled:opacity-60"
                  data-testid={ADMIN.loginBtn}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#9AA3B2] leading-relaxed text-center">
          Default credentials for testing: <span className="font-mono text-[#C9D0DB]">bishnu@bbchauffeur.com / BayArea2025!</span>
        </p>
      </div>
    </main>
  );
}
