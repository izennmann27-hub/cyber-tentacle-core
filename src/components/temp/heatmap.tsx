import { heatmapCells, today, type Task } from "@/lib/temp-data";

function level(n: number) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n <= 4) return 3;
  return 4;
}

const ACTIVE_ALPHA = [0, 0.18, 0.34, 0.55, 0.85];
const DONE_ALPHA = [0, 0.28, 0.48, 0.7, 1];

export function Heatmap({ tasks, personId, weeks = 26 }: { tasks: Task[]; personId: string; weeks?: number }) {
  const cells = heatmapCells(tasks, personId, weeks);
  const now = today();
  const cols: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

  return (
    <div className="flex gap-[2px] overflow-x-auto pb-1">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-[2px]">
          {col.map((c) => {
            const doneLv = level(c.done);
            const activeLv = level(c.active);
            const isDone = doneLv > 0;
            const alpha = isDone ? DONE_ALPHA[doneLv] : ACTIVE_ALPHA[activeLv];
            const tone = isDone ? "var(--primary)" : "var(--accent)";
            return (
              <div
                key={c.date}
                title={`${c.date} · активность ${c.active} · выполнено ${c.done}`}
                className="h-3 w-3 border border-border/40"
                style={{
                  background:
                    alpha > 0
                      ? `color-mix(in oklab, ${tone} ${Math.round(alpha * 100)}%, transparent)`
                      : c.future
                        ? "transparent"
                        : "color-mix(in oklab, var(--foreground) 6%, transparent)",
                  outline: c.date === now ? "2px solid color-mix(in oklab, var(--primary) 70%, transparent)" : undefined,
                  opacity: c.future ? 0.35 : 1,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="flex items-center gap-1">
        <i className="inline-block h-2 w-2" style={{ background: "color-mix(in oklab, var(--accent) 55%, transparent)" }} />
        активность
      </span>
      <span className="flex items-center gap-1">
        <i className="inline-block h-2 w-2" style={{ background: "color-mix(in oklab, var(--primary) 80%, transparent)" }} />
        выполнено
      </span>
    </div>
  );
}