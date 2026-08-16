import { useMemo, useRef, useState } from "react";
import type { TentacleDef } from "@/lib/tentacles";
import {
  BACKENDS,
  endpointUrl,
  streamEndpoint,
  type OctoError,
  type StreamFrame,
} from "@/lib/octo-endpoints";

const ACTIONS: Record<TentacleDef["category"], string[]> = {
  чат: ["новый диалог", "включить RAG", "включить tools", "очистить историю"],
  анализ: ["загрузить файл", "быстрый разбор", "CVE / FMDB поиск", "сохранить в memory"],
  медиа: ["image", "video", "music", "квота"],
  документы: ["создать", "экспорт PDF", "тема", "live preview"],
  код: ["file tree", "surgical edit", "diff", "git status"],
  данные: ["search", "recent", "sessions", "экспорт"],
  система: ["health check", "logs", "restart", "обновить список"],
};

interface Line {
  id: number;
  kind: "in" | "out" | "sys" | "err";
  text: string;
}

type Tab = "консоль" | "коннект" | "контракт";

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
  const [tab, setTab] = useState<Tab>("консоль");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ step: number; total: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(1);
  const primary = t.endpoints[0];
  const backend = BACKENDS[t.backend];
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, kind: "sys", text: `${t.name} · ${t.title} · ${backend.label} :${backend.port}` },
    { id: -1, kind: "sys", text: `точка коннекта · ${primary.method} ${endpointUrl(primary)}` },
  ]);

  const add = (kind: Line["kind"], text: string) =>
    setLines((prev) => [...prev.slice(-120), { id: idRef.current++, kind, text }]);

  const run = async (task: string) => {
    add("in", task);
    if (!primary) return;
    setBusy(true);
    setProgress(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const body =
      t.id === "octo-chat"
        ? { messages: [{ role: "user", content: task }], stream: true }
        : { prompt: task, task, stream: true };
    try {
      await streamEndpoint(
        primary,
        body,
        (f: StreamFrame) => {
          if (f.type === "progress") setProgress({ step: f.step, total: f.total });
          else if (f.type === "tokens") add("sys", `токенов: ${f.total}`);
          else if (f.type === "result") add("out", JSON.stringify(f.data).slice(0, 800));
          else if (f.type === "done") add("sys", `готово · ${f.status}`);
          else if (f.type === "error") add("err", `${f.code}: ${f.message}`);
        },
        ctrl.signal,
      );
    } catch (e) {
      const err = e as OctoError;
      add(
        "err",
        err?.code
          ? `${err.code}${err.status ? ` (${err.status})` : ""}: ${err.message || "нет ответа"}`
          : `нет связи с ${backend.label} :${backend.port} — бэкенд не запущен`,
      );
    } finally {
      setBusy(false);
      setProgress(null);
      abortRef.current = null;
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || busy) return;
    setValue("");
    void run(q);
  };

  const specRows = useMemo(
    () => [
      ["input", t.input],
      ["output", t.output],
    ] as const,
    [t],
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${krakenSkull.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.18,
          filter: "grayscale(1) brightness(0.85) contrast(1.05)",
          maskImage: "radial-gradient(ellipse at 50% 45%, #000 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, #000 25%, transparent 78%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 scanlines" />
      <div className="relative z-10 flex h-full flex-col">
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
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/80">
              {t.title}
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.28em] ${
                on ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {on ? "● активно" : "○ отключено"}
            </span>
          </div>
          <div className="font-mono text-[10px] text-primary/70">
            {t.model}
            {t.hotkey ? ` · ${t.hotkey}` : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="border border-primary/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          настройки
        </button>
      </div>

      <div className="grid grid-cols-4 divide-x divide-primary/10 border-b border-primary/15 font-mono text-[9px] uppercase tracking-[0.24em]">
        <Meta label="категория" value={t.category} />
        <Meta label="бэкенд" value={`${backend.label}`} />
        <Meta label="порт" value={String(backend.port)} />
        <Meta label="инструментов" value={String(t.tools.length)} />
      </div>

      <div className="flex gap-1.5 border-b border-primary/15 px-5 py-2">
        {(["консоль", "коннект", "контракт"] as Tab[]).map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setTab(x)}
            className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
              tab === x
                ? "border-primary/70 bg-primary/10 text-primary"
                : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      {tab === "консоль" && (
        <>
          <div className="flex flex-wrap gap-1.5 border-b border-primary/15 px-5 py-3">
            {ACTIONS[t.category].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => void run(a)}
                disabled={busy}
                className="border border-primary/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary disabled:opacity-40"
              >
                {a}
              </button>
            ))}
          </div>

          {progress && (
            <div className="border-b border-primary/15 px-5 py-2">
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                <span>прогресс</span>
                <span className="text-primary">
                  {progress.step} / {progress.total}
                </span>
              </div>
              <div className="mt-1 h-1 w-full bg-primary/15">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(progress.step / Math.max(progress.total, 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-1.5 overflow-y-auto px-5 py-4 font-mono text-[11px]">
            {lines.map((l) => (
              <div
                key={l.id}
                className={
                  l.kind === "in"
                    ? "text-foreground/85"
                    : l.kind === "out"
                      ? "text-primary/80"
                      : l.kind === "err"
                        ? "text-destructive"
                        : "text-muted-foreground"
                }
              >
                <span className="mr-2 uppercase tracking-[0.3em] text-muted-foreground">
                  {l.kind === "in"
                    ? "> вы"
                    : l.kind === "out"
                      ? "[щупальце]"
                      : l.kind === "err"
                        ? "[ошибка]"
                        : "[канал]"}
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
            {busy ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="shrink-0 border border-destructive/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-destructive transition-colors hover:bg-destructive/10"
              >
                стоп
              </button>
            ) : (
              <button
                type="submit"
                className="shrink-0 border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
              >
                пуск
              </button>
            )}
          </form>
        </>
      )}

      {tab === "коннект" && (
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <Section title="точки коннекта">
            <div className="divide-y divide-primary/10 border border-primary/20">
              {t.endpoints.map((e) => (
                <div key={e.path} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2">
                  <span className="w-12 font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                    {e.method}
                  </span>
                  <span className="font-mono text-[11px] text-foreground/85">{endpointUrl(e)}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                    {e.note}
                    {e.stream ? " · SSE" : ""}
                  </span>
                </div>
              ))}
            </div>
          </Section>
          <Section title="инструменты головы">
            <div className="flex flex-wrap gap-1.5">
              {t.tools.map((tool) => (
                <span
                  key={tool}
                  className="border border-primary/20 px-2 py-1 font-mono text-[9px] text-primary/80"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Section>
          <Section title="требования окна">
            <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
              {t.ui.map((u) => (
                <li key={u}>· {u}</li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {tab === "контракт" && (
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {specRows.map(([label, obj]) => (
            <Section key={label} title={label}>
              <div className="divide-y divide-primary/10 border border-primary/20 font-mono text-[11px]">
                {Object.entries(obj).map(([k, v]) => (
                  <div key={k} className="flex gap-3 px-3 py-1.5">
                    <span className="w-40 shrink-0 text-primary/80">{k}</span>
                    <span className="text-muted-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          ))}
          <Section title="контракт стрима">
            <pre className="overflow-x-auto border border-primary/20 p-3 font-mono text-[10px] text-muted-foreground">
{`data: {"type":"progress","step":1,"total":5}
data: {"type":"tokens","total":120}
data: {"type":"result","data":{...}}
data: {"type":"done","status":"ok"}`}
            </pre>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.34em] text-primary/70">
        {title}
      </div>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2">
      <div className="text-muted-foreground/70">{label}</div>
      <div className="mt-0.5 truncate text-primary">{value}</div>
    </div>
  );
}
