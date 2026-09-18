'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Terminal, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAdmin } from "../actions/auth";
import Link from "next/link";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        toast.success("Authentication successful");
        router.push("/admin");
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 bg-grid-pattern relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-card/90 border border-border/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-cyan-400 transition-colors mb-6">
            <ArrowLeft size={14} /> BACK_TO_HOME
          </Link>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Shield size={24} />
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-tight uppercase text-foreground">Admin Portal</h1>
          <p className="font-mono text-xs text-cyan-400 mt-1">// ENTER SECURE CREDENTIALS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Admin Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@cybotixx.com" 
              className="mt-1.5 bg-secondary/50 border-border/80 h-11 font-sans" 
            />
          </div>
          <div>
            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
              className="mt-1.5 bg-secondary/50 border-border/80 h-11 font-sans" 
            />
          </div>
          <Button type="submit" className="w-full font-mono text-xs tracking-wider uppercase h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold glow-cyan transition-all mt-2" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : "AUTHENTICATE"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
