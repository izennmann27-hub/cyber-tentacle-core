import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { THEMES } from "@/lib/themes";
import krakenSkullAsset from "@/assets/kraken-skull.png.asset.json";
const krakenSkull = krakenSkullAsset.url;
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ОСЬМИНОГ-1 // Автономный комплекс" },
      {
        name: "description",
        content:
          "Автономный киберпанк-комплекс «ОСЬМИНОГ-1»: локальная модель-голова управляет щупальцами-инструментами.",
      },
      { property: "og:title", content: "ОСЬМИНОГ-1 // Автономный комплекс" },
      {
        property: "og:description",
        content:
          "Автономный комплекс: голова, щупальца, 2×2 рабочая зона и AgentWorld router.",
      },
    ],
  }),
  component: Index,
});

const TENTACLES: { id: string; label: string }[] = [
  { id: "octopus",       label: "Осьминог" },
  { id: "home",          label: "HOME" },
  { id: "analysis",      label: "АНАЛИЗ" },
  { id: "generator",     label: "ГЕНЕРАТОР" },
  { id: "coder",         label: "ПРОГРАММИСТ" },
  { id: "extract",       label: "🔬 ИЗВЛЕЧЕНИЕ" },
  { id: "circuit",       label: "СХЕМОТЕХНИК" },
  { id: "clone",         label: "КОПИРОВАНИЕ ЛИЧНОСТИ" },
  { id: "memory",        label: "Память" },
  { id: "webgen",        label: "Веб-генератор" },
  { id: "all",           label: "Все" },
  { id: "chat",          label: "Чат" },
  { id: "webedit",       label: "Веб-редактор" },
  { id: "slides",        label: "Презентации" },
  { id: "officecli",     label: "💾 OfficeCLI (.pptx/.docx/.xlsx)" },
  { id: "media",         label: "📼 МЕДИА" },
  { id: "diffusers",     label: "✎ DIFFUSERS" },
];

const TABS = ["SETTINGS", "LAUNCHER", "MEMORY"] as const;
const PANES = ["MACOS-BASH", "SWE", "TERMINAL", "WEB"] as const;
const QUICK = [
  { icon: "NEW", label: "OfficeCLI" },
  { icon: "▤",   label: "Презентации" },
  { icon: "◇",   label: "Веб-редактор" },
  { icon: "✎",   label: "Diffusers" },
];

function Index() {
  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState("octopus");
  const [tab, setTab] = useState<(typeof TABS)[number]>("LAUNCHER");
  const [clock, setClock] = useState("00:00:00");
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="cyber-surface relative h-screen overflow-hidden flex flex-col text-primary">
      <h1 className="sr-only">ОСЬМИНОГ-1 — автономный комплекс</h1>
      <div className="pointer-events-none fixed inset-0 cyber-grid animate-drift opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20" />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-stretch gap-2 p-2">
        {/* Logo box */}
        <div className="flex h-16 w-[240px] shrink-0 items-center justify-center border-2 border-primary/70 bg-background/60">
          <span className="font-display text-3xl neon-text">⚚</span>
        </div>
        {/* Status strip */}
        <div className="flex flex-1 items-center gap-2 border-2 border-primary/70 bg-background/60 px-4">
          <StatCell label="РЕЖИМ" value="АВТОНОМНЫЙ" />
          <Divider />
          <StatCell label="СТАТУС" value="РАБОТА" />
          <Divider />
          <StatCell label="ВРЕМЯ" value={clock} mono />
        </div>
        {/* Head status */}
        <div className="hidden md:flex h-16 w-[220px] shrink-0 flex-col justify-center border-2 border-primary/70 bg-background/60 px-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">СТАТУС</span>
          <span className="font-display text-sm font-bold uppercase tracking-widest neon-text">Осьминог</span>
        </div>
        {/* Theme dots */}
        <div className="flex h-16 items-center gap-2 border-2 border-primary/70 bg-background/60 px-4">
          {THEMES.map((t) => {
            const isActive = theme === t.slug;
            return (
              <button
                key={t.slug}
                title={t.name}
                aria-label={t.name}
                onClick={() => setTheme(t.slug)}
                className={`h-5 w-5 rounded-full border-2 transition ${isActive ? "border-primary scale-110" : "border-border/60 opacity-80 hover:opacity-100"}`}
                style={{ background: t.swatch?.[1] ?? "var(--primary)" }}
              />
            );
          })}
        </div>
        {/* Power */}
        <button
          aria-label="power"
          className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-primary/70 bg-background/60 font-display text-2xl neon-text hover:bg-primary/10"
        >
          ⏻
        </button>
      </div>

      {/* WORKSPACE */}
      <div className="relative z-10 grid flex-1 min-h-0 grid-cols-[240px_1fr_360px] gap-2 px-2 pb-2">
        {/* LEFT: tentacles */}
        <aside className="flex flex-col overflow-hidden border-2 border-primary/70 bg-background/40">
          <div className="border-b-2 border-primary/70 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.32em] neon-text">
            ЩУПАЛЬЦА
          </div>
          <ul className="flex-1 overflow-y-auto p-2 space-y-2">
            {TENTACLES.map((t) => {
              const active = selected === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSelected(t.id)}
                    className={`block w-full border-2 px-3 py-2.5 text-center font-display text-[11px] font-bold uppercase tracking-widest transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_18px_var(--glow)]"
                        : "border-primary/60 bg-background/40 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* CENTER */}
        <section className="relative flex flex-col overflow-hidden border-2 border-primary/70 bg-background/40">
          {/* Skull backdrop */}
          <img
            src={krakenSkull}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-screen"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />

          {/* header */}
          <div className="relative z-10 flex items-center justify-between border-b-2 border-primary/70 bg-background/60 px-4 py-2">
            <span className="font-display text-xs font-bold uppercase tracking-[0.32em] neon-text">
              {TENTACLES.find((t) => t.id === selected)?.label ?? "ОСЬМИНОГ"}
            </span>
            <div className="flex items-center gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 border-2 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-widest transition ${
                    tab === t
                      ? "border-primary bg-primary/20 neon-text"
                      : "border-primary/60 bg-background/40 text-primary hover:bg-primary/10"
                  }`}
                >
                  <span aria-hidden>{t === "SETTINGS" ? "⚙" : t === "LAUNCHER" ? "▤" : "🧠"}</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2x2 */}
          <div className="relative z-10 grid flex-1 grid-cols-2 grid-rows-2 gap-3 p-3">
            {PANES.map((title) => (
              <WorkPane key={title} title={title} />
            ))}
          </div>

          {/* Quick strip */}
          <div className="relative z-10 flex items-center gap-6 border-t-2 border-primary/70 bg-background/60 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-widest">
            {QUICK.map((q) => (
              <button key={q.label} className="flex items-center gap-2 text-primary/90 hover:text-primary">
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[9px] ${
                    q.icon === "NEW" ? "bg-primary text-primary-foreground" : "border border-primary/60 text-primary"
                  }`}
                >
                  {q.icon}
                </span>
                {q.label}
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: AgentWorld */}
        <aside className="flex flex-col overflow-hidden border-2 border-primary/70 bg-background/40">
          <div className="border-b-2 border-primary/70 bg-background/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em]">
            <span className="text-primary">ONLINE</span>{" "}
            <span className="text-muted-foreground">agentworld</span>
          </div>
          <div className="relative flex-1 overflow-hidden bg-background/70">
            <img
              src={krakenSkull}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.10] mix-blend-screen"
            />
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 border-t-2 border-primary/70 bg-background/60 p-2"
          >
            <input
              placeholder="Спросить AgentWorld router"
              className="flex-1 border-2 border-primary/70 bg-background/60 px-3 py-2 font-mono text-[12px] text-primary placeholder:text-primary/50 outline-none focus:border-primary"
            />
            <button
              aria-label="отправить"
              className="flex h-10 w-10 items-center justify-center border-2 border-primary/70 bg-background/60 font-display text-lg neon-text hover:bg-primary/10"
            >
              ▸
            </button>
          </form>
        </aside>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 flex items-center justify-between px-4 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>Автономный комплекс «ОСЬМИНОГ-1»</span>
        <span className="text-primary/80">100% ЛОКАЛЬНО • АВТОНОМНАЯ СИСТЕМА</span>
      </div>
    </main>
  );
}

function StatCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{label}</span>
      <span
        className={`${mono ? "font-mono" : "font-display"} text-sm font-bold uppercase tracking-[0.28em] neon-text`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <span className="h-8 w-px bg-primary/40" />;
}

function WorkPane({ title }: { title: string }) {
  return (
    <div className="relative flex min-h-0 flex-col border-2 border-primary/70 bg-background/40 p-3">
      <div className="flex items-start justify-between">
        <h2 className="font-display text-3xl font-black uppercase tracking-widest neon-text">{title}</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/70">IDLE</span>
      </div>
      <div className="mt-2 h-px w-full border-t border-dashed border-primary/50" />
      <div className="mt-2 font-mono text-xs text-primary/80">_</div>
      <div className="mt-3 flex-1 rounded-sm border border-primary/50 bg-background/40" />
    </div>
  );
}
