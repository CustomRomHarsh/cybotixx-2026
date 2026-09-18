import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Sparkles, Cpu, ShieldCheck, Zap, Code2 } from "lucide-react";

const HeroSection = () => (
  <section className="min-h-[92vh] flex flex-col items-center justify-center relative overflow-hidden bg-grid-pattern pt-20 pb-16">
    {/* Ambient lighting effects */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

    <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Top Tech Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary/80 border border-border/80 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs tracking-widest text-cyan-300 uppercase font-medium">
            // BCA Tech Forum • Cybotixx 2026
          </span>
          <Terminal size={14} className="text-cyan-400" />
        </div>

        {/* Main Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase leading-[0.95]">
            Architect <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              The Future
            </span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-cyan-400/90 tracking-[0.25em] uppercase">
            [ EXECUTE: INNOVATE. CODE. CREATE. ]
          </p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans">
          The ultimate student-driven tech arena. Push your limits through high-intensity hackathons, algorithmic code sprints, and cutting-edge masterclasses.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto font-mono text-sm tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 h-12 glow-cyan gap-3">
              Secure Your Slot <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#events" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-mono text-sm tracking-wider border-border/80 hover:bg-secondary/80 h-12 px-8">
              Explore Events
            </Button>
          </a>
        </div>

        {/* Live Tech Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
          {[
            { label: "Active Tracks", value: "04+", icon: Code2, color: "text-cyan-400" },
            { label: "Code Sprints", value: "24h", icon: Zap, color: "text-amber-400" },
            { label: "Innovators", value: "500+", icon: Cpu, color: "text-emerald-400" },
            { label: "Prize Pool", value: "₹50K+", icon: ShieldCheck, color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 border border-border/80 p-5 rounded-xl backdrop-blur-md text-left group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>
);

export default HeroSection;
