import { useMemo, useState } from "react";
import {
  TENTACLES,
  TENTACLE_CATEGORIES,
  type TentacleCategory,
  type TentacleDef,
} from "@/lib/tentacles";

export function TentaclesMenu({ onClose }: { onClose: () => void }) {
  const [cat, setCat] = useState<TentacleCategory>("все");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TENTACLES.map((t) => [t.id, t.installed])),
  );

  const list = useMemo(
    () =>
      TENTACLES.filter(
        (t) =>
          (cat === "все" || t.category === cat) &&
          (query.trim() === "" ||
            `${t.name} ${t.model} ${t.role}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [cat, query],
  );

  const active = Object.values(state).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <button
        type="button"
        aria-label="Закрыть меню щупалец"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-primary/30 bg-popover/95">
        <div className="flex items-center justify-between border-b border-primary/20 px-5 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">
              щупальца
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              микропрограммы · подключено {active} / {TENTACLES.length}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-primary/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            esc
          </button>
        </div>

        <div className="space-y-3 border-b border-primary/15 px-5 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="поиск щупальца…"
            aria-label="Поиск щупальца"
            className="w-full border border-primary/25 bg-background/50 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {TENTACLE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
                  c === cat
                    ? "border-primary/70 bg-primary/10 text-primary"
                    : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 divide-y divide-primary/10 overflow-y-auto">
          {list.map((t) => (
            <Row
              key={t.id}
              t={t}
              on={state[t.id]}
              onToggle={() => setState((p) => ({ ...p, [t.id]: !p[t.id] }))}
            />
          ))}
          {list.length === 0 && (
            <div className="px-5 py-8 text-center font-mono text-[11px] text-muted-foreground">
              ничего не найдено
            </div>
          )}
        </div>

        <div className="border-t border-primary/20 px-5 py-3">
          <button
            type="button"
            className="w-full border border-primary/40 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
          >
            + подключить щупальце из сети
          </button>
        </div>
      </aside>
    </div>
  );
}

function Row({ t, on, onToggle }: { t: TentacleDef; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-primary/5">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center border font-display text-base ${
          on ? "border-primary/60 text-primary" : "border-border/60 text-muted-foreground"
        }`}
      >
        {t.glyph}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-display text-sm uppercase tracking-[0.12em] text-foreground">
            {t.name}
          </span>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">
            {t.size}
          </span>
        </div>
        <div className="font-mono text-[10px] text-primary/70">{t.model}</div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{t.role}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        aria-label={`${on ? "Отключить" : "Подключить"} ${t.name}`}
        className={`mt-1 shrink-0 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
          on
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
        }`}
      >
        {on ? "● вкл" : "○ выкл"}
      </button>
    </div>
  );
}