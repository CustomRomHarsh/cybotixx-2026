import { Shield, Terminal, Cpu, Award } from "lucide-react";

const heads = [
  { name: "R Kishore", position: "President", bio: "Third year BCA student, AI/ML enthusiast & system architect.", tag: "SYS_ADMIN" },
  { name: "Pratheek D", position: "Vice President", bio: "Third year BCA student, Full-stack developer & UI artisan.", tag: "LEAD_DEV" },
  { name: "Harsh S Shah", position: "Tech Lead", bio: "Third year BCA student, open-source contributor & security researcher.", tag: "CORE_SEC" },
  { name: "Jyothi K", position: "Head", bio: "Third year BCA student, Event Head & community coordinator.", tag: "OPERATIONS" },
  { name: "Leena Soni", position: "Head", bio: "Third year BCA student, Event Head & logistics planner.", tag: "LOGISTICS" },
];

const ClubHeadsSection = () => (
  <section id="team" className="py-28 border-t border-border/60 bg-secondary/10 relative">
    <div className="container mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
          <span>// 03. COMMAND_STAFF</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 uppercase">
          The <span className="text-cyan-400">Core Squad</span>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
          Meet the student leaders driving Cybotixx 2026 forward with passion, technical excellence, and relentless execution.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {heads.map((h, index) => (
          <div 
            key={h.name} 
            className="bg-card/90 border border-border/80 rounded-2xl p-7 hover:border-cyan-500/50 transition-all duration-300 group relative flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xl font-bold group-hover:scale-105 transition-transform">
                  {h.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-secondary text-cyan-300 border border-border uppercase tracking-wider">
                  [{h.tag}]
                </span>
              </div>

              <h3 className="font-mono text-xl font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                {h.name}
              </h3>
              <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest mt-1 mb-4">
                // {h.position}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                {h.bio}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>OPERATOR #0{index + 1}</span>
              <span className="text-emerald-400">● SECURE</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default ClubHeadsSection;
