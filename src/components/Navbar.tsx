'use client'
import { useState, useEffect } from "react";
import { Menu, X, Terminal, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { to: "/", label: "Home" },
  { to: "/#about", label: "About" },
  { to: "/#events", label: "Events" },
  { to: "/#team", label: "Team" },
  { to: "/registrations", label: "Directory" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-2xl shadow-cyan-950/10" 
        : "bg-transparent border-b border-border/30"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Terminal size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold tracking-wider uppercase bg-gradient-to-r from-foreground via-foreground/90 to-cyan-400 bg-clip-text text-transparent">
              Cybotixx
            </span>
            <span className="font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
              // 2026.BCA
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/50 border border-border/80 px-3 py-1.5 rounded-full backdrop-blur-md">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                pathname === l.to 
                  ? "bg-foreground text-background font-semibold shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA & Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYS_ONLINE</span>
          </div>

          <Link href="/register">
            <Button size="sm" className="font-mono text-xs tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold glow-cyan transition-all">
              Initialize Reg
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button 
          className="md:hidden p-2 rounded-lg bg-secondary border border-border text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b border-border bg-background/98 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM ACTIVE</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">v2.0.26</span>
          </div>

          <div className="space-y-2">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-mono transition-colors ${
                  pathname === l.to 
                    ? "bg-secondary text-foreground font-semibold" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="w-full font-mono text-xs tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold h-11">
                Initialize Registration
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
