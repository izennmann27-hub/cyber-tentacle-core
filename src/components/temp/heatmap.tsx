import { useState } from "react";
import { heatmapMonthCells, today, type Task } from "@/lib/temp-data";

function level(n: number) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n <= 4) return 3;
  return 4;
}

const ACTIVE_ALPHA = [0, 0.18, 0.34, 0.55, 0.85];
const DONE_ALPHA = [0, 0.28, 0.48, 0.7, 1];

const MONTHS = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const selectCls =
  "border border-border/60 bg-card/45 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] outline-none backdrop-blur-md";

export function Heatmap({ tasks, personId }: { tasks: Task[]; personId: string }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const cols = heatmapMonthCells(tasks, personId, year, month);
  const iso = today();
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 3 + i);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          aria-label="Месяц"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className={selectCls}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="Год"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={selectCls}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-[3px]">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((c, ri) => {
              if (!c) return <div key={ri} className="h-3 w-3" />;
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
                    outline:
                      c.date === iso ? "2px solid color-mix(in oklab, var(--primary) 70%, transparent)" : undefined,
                    opacity: c.future ? 0.35 : 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
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
