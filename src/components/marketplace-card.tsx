export interface MarketTentacle {
  id: string;
  name: string;
  vendor: string;
  size: string;
  rating: number;
  price: string;
  tag: string;
}

export function MarketplaceCard({ item }: { item: MarketTentacle }) {
  return (
    <div className="relative panel glitch-clip overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
      <div className="flex items-center justify-between">
        <span className="rounded-sm bg-accent/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-accent">
          {item.tag}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">{item.size}</span>
      </div>
      <div className="mt-3 font-display text-sm font-bold uppercase tracking-widest">{item.name}</div>
      <div className="font-mono text-[10px] text-muted-foreground">by {item.vendor}</div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[11px] text-primary">
          {"\u2605".repeat(Math.round(item.rating))}
          <span className="text-muted-foreground">{"\u2605".repeat(5 - Math.round(item.rating))}</span>
        </span>
        <span className="font-display text-sm font-bold neon-text">{item.price}</span>
      </div>
      <button className="mt-4 w-full glitch-clip border border-primary/50 bg-primary/10 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-primary transition hover:bg-primary/20">
        ▾ download tentacle
      </button>
    </div>
  );
}