import { Trophy, Users, Lightbulb, Code2, ShieldAlert, Cpu } from "lucide-react";

const features = [
  { 
    icon: Code2, 
    title: "Hackathons", 
    desc: "Build breakthrough applications and real-world prototypes in intense 24-hour sprint challenges.",
    tag: "SYS_SPRINT"
  },
  { 
    icon: Trophy, 
    title: "Code Contests", 
    desc: "Test your algorithmic prowess and data structures mastery against top student minds.",
    tag: "ALGO_ARENA"
  },
  { 
    icon: Cpu, 
    title: "Tech Workshops", 
    desc: "Hands-on masterclasses on AI/ML, full-stack systems, cloud architecture, and cybersecurity.",
    tag: "DEEP_DIVE"
  },
  { 
    icon: Lightbulb, 
    title: "Expert Tech Talks", 
    desc: "Gain insider perspectives and mentorship from industry pioneers and elite open-source maintainers.",
    tag: "KEYNOTE"
  },
];

const AboutSection = () => (
  <section id="about" className="py-28 border-t border-border/60 relative bg-secondary/10">
    <div className="container mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="max-w-2xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
          <span>// 01. CORE_PHILOSOPHY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 uppercase">
          What is <span className="text-cyan-400">Cybotixx?</span>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
          Cybotixx is the premier tech forum of the BCA department. We bridge the critical gap between academic theory and industry engineering by building an elite community where students architect, code, and deploy real solutions.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, index) => (
          <div
            key={f.title}
            className="bg-card/80 border border-border/80 rounded-2xl p-7 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top glowing accent on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <f.icon size={24} />
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-secondary text-muted-foreground uppercase tracking-wider">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-mono text-lg font-bold mb-3 tracking-wide text-foreground group-hover:text-cyan-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                {f.desc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>MODULE_0{index + 1}</span>
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default AboutSection;
