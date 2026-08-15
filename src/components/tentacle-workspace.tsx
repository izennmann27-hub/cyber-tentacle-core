import { useRef, useState } from "react";
import type { TentacleDef } from "@/lib/tentacles";

const ACTIONS: Record<TentacleDef["category"], string[]> = {
  система: ["ps aux", "df -h", "снять логи", "перезапуск демона"],
  код: ["diff рабочей копии", "прогнать тесты", "собрать патч", "review"],
  медиа: ["разобрать файл", "описать кадр", "экспорт", "очередь"],
  сеть: ["открыть url", "снять DOM", "скриншот", "скан подсети"],
  данные: ["схема базы", "индексировать папку", "поиск по памяти", "экспорт csv"],
};

interface Line {
  id: number;
  kind: "in" | "out" | "sys";
  text: string;
}

export function TentacleWorkspace({
  t,
  on,
  onBack,
  onOpenSettings,
}: {
  t: TentacleDef;
  on: boolean;
  onBack: () => void;
  onOpenSettings: () => void;
}) {
  const [value, setValue] = useState("");
  const idRef = useRef(1);
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "sys", text: `щупальце ${t.name} · ${t.model} · канал открыт` },
  ]);

  const push = (text: string) => {
    const id = idRef.current++;
    setLines((prev) => [
      ...prev.slice(-40),
      { id, kind: "in", text },
      { id: id + 5000, kind: "out", text: "щупальце приняло задачу · выполняю локально…" },
    ]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    push(q);
    setValue("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-primary/20 px-5 py-3">
        <button
          type="button"
          onClick={onBack}
          className="border border-primary/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          ← назад
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm uppercase tracking-[0.14em] text-foreground">
              {t.glyph} {t.name}
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.28em] ${
                on ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {on ? "● активно" : "○ отключено"}
            </span>
          </div>
          <div className="font-mono text-[10px] text-primary/70">{t.model}</div>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="border border-primary/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          настройки
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-primary/10 border-b border-primary/15 font-mono text-[9px] uppercase tracking-[0.24em]">
        <Meta label="категория" value={t.category} />
        <Meta label="вес" value={t.size} />
        <Meta label="канал" value="локальный" />
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-primary/15 px-5 py-3">
        {ACTIONS[t.category].map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => push(a)}
            className="border border-primary/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            {a}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-5 py-4 font-mono text-[11px]">
        {lines.map((l) => (
          <div
            key={l.id}
            className={
              l.kind === "in"
                ? "text-foreground/85"
                : l.kind === "out"
                  ? "text-primary/70"
                  : "text-muted-foreground"
            }
          >
            <span className="mr-2 uppercase tracking-[0.3em] text-muted-foreground">
              {l.kind === "in" ? "> вы" : l.kind === "out" ? "[щупальце]" : "[канал]"}
            </span>
            {l.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-3 border-t border-primary/20 bg-background/40 px-4 py-3 focus-within:border-primary/50"
      >
        <span className="font-mono text-[11px] text-primary/60">▌</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`задача для ${t.name}`}
          aria-label={`Задача для ${t.name}`}
          className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
        >
          пуск
        </button>
      </form>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2">
      <div className="text-muted-foreground/70">{label}</div>
      <div className="mt-0.5 text-primary">{value}</div>
    </div>
  );
}