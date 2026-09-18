import Link from "next/link";
import { Terminal, Github, Mail, Globe, Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/60 bg-secondary/20 relative overflow-hidden pt-20 pb-12">
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal size={18} />
            </div>
            <span className="font-mono text-lg font-bold tracking-widest uppercase text-foreground">
              Cybotixx 2026
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-sans">
            The official tech forum of the BCA department. Building the next generation of software engineers, open-source contributors, and tech innovators.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border font-mono text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>BCA VVP CAMPUS</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-4 text-foreground">
            // NAVIGATION
          </h4>
          <div className="space-y-2.5 font-mono text-xs">
            <Link href="/" className="block text-muted-foreground hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/#about" className="block text-muted-foreground hover:text-cyan-400 transition-colors">About Us</Link>
            <Link href="/#events" className="block text-muted-foreground hover:text-cyan-400 transition-colors">Events</Link>
            <Link href="/#team" className="block text-muted-foreground hover:text-cyan-400 transition-colors">Core Team</Link>
            <Link href="/register" className="block text-muted-foreground hover:text-cyan-400 transition-colors">Register Now</Link>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-4 text-foreground">
            // CONTACT & SEC
          </h4>
          <div className="space-y-2.5 font-mono text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-cyan-400" />
              <span>cybotixxvvp@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              <span>BCA Department</span>
            </p>
            <Link href="/adminlogin" className="inline-block pt-2 text-cyan-400 hover:underline">
              [ ADMIN PORTAL ]
            </Link>
          </div>
        </div>
      </div>

      {/* Big CYBOTIXX watermark behind bottom section */}
      <div className="relative pt-12 border-t border-border/40">
        <div className="select-none pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <span className="font-mono text-[clamp(3rem,14vw,11rem)] font-extrabold tracking-[0.2em] uppercase text-foreground leading-none whitespace-nowrap">
            CYBOTIXX
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono relative z-10 gap-4">
          <p>© {new Date().getFullYear()} Cybotixx. All rights reserved.</p>
          <p className="text-cyan-400">// CRAFTED FOR TECH STUDENTS</p>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
