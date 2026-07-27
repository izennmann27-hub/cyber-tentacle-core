import { cn } from "@/lib/utils";

export interface Tentacle {
  id: string;
  name: string;
  model: string;
  role: string;
  status: "linked" | "idle" | "syncing" | "offline";
  load: number;
  glyph: string;
}

const STATUS_COLOR: Record<Tentacle["status"], string> = {
  linked: "text-primary",
  idle: "text-muted-foreground",
  syncing: "text-accent",
  offline: "text-destructive",
};

export function TentacleCard({ t }: { t: Tentacle }) {
  return (
    <div className="group relative panel glitch-clip overflow-hidden p-4 transition-all hover:-translate-y-0.5">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/50 bg-background/60 font-display text-lg neon-text">
            {t.glyph}
          </div>
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-widest">{t.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{t.model}</div>
          </div>
        </div>
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.24em]", STATUS_COLOR[t.status])}>
          ● {t.status}
        </span>
      </div>

      <p className="relative mt-3 font-mono text-xs text-muted-foreground">{t.role}</p>

      <div className="relative mt-4">
        <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          <span>load</span>
          <span className="text-primary">{t.load}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden border border-border/50 bg-background/60">
          <div
            className="h-full bg-primary"
            style={{
              width: `${t.load}%`,
              boxShadow: "0 0 12px color-mix(in oklab, var(--glow) 60%, transparent)",
            }}
          />
        </div>
      </div>

      <div className="relative mt-4 flex gap-2">
        <button className="flex-1 border border-primary/40 bg-primary/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary transition hover:bg-primary/20">
          summon
        </button>
        <button className="border border-border/60 bg-background/40 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground">
          config
        </button>
      </div>
    </div>
  );
}