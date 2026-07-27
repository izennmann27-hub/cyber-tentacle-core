import krakenAsset from "@/assets/kraken-skull.png.asset.json";

interface Props {
  status: string;
  active: number;
  total: number;
}

export function KrakenHead({ status, active, total }: Props) {
  return (
    <div className="relative overflow-hidden panel glitch-clip">
      <div className="pointer-events-none absolute inset-0 cyber-grid animate-drift opacity-60" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />

      <div className="relative grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
        <div className="relative flex flex-col justify-center">
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-background/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            head online // local
          </div>
          <h1 className="animate-flicker font-display text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            <span className="neon-text">KRAKEN</span>
            <br />
            <span className="text-foreground">ORCHESTRATOR</span>
          </h1>
          <p className="mt-4 max-w-md font-mono text-sm text-muted-foreground">
            Локальная модель-голова координирует подчинённые нейросети —
            щупальца — по каналам плоти и меди. Одна воля. Много рук.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[11px] uppercase">
            <StatBlock label="status" value={status} />
            <StatBlock label="tentacles" value={`${active}/${total}`} />
            <StatBlock label="latency" value="12ms" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button className="glitch-clip neon-border bg-primary/90 px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground transition hover:bg-primary">
              ▸ dispatch
            </button>
            <button className="glitch-clip border border-accent/60 bg-accent/10 px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-accent transition hover:bg-accent/20">
              ◇ open console
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 -z-10 opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--glow) 45%, transparent), transparent 60%)",
            }}
          />
          <img
            src={krakenAsset.url}
            alt="Cyberpunk kraken head — cybernetic skull with tentacles"
            className="relative w-full max-w-md animate-tentacle mix-blend-luminosity"
            style={{
              filter:
                "drop-shadow(0 0 40px color-mix(in oklab, var(--glow) 40%, transparent))",
            }}
          />
          <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/50 bg-background/40 px-3 py-2">
      <div className="text-[9px] tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-bold text-primary">{value}</div>
    </div>
  );
}