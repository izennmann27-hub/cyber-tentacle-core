import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { THEMES, type ThemeSlug } from "@/lib/themes";
import { Settings, X } from "lucide-react";
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

type Status = "linked" | "syncing" | "idle" | "offline";

interface TentacleItem {
  id: string;
  label: string;
  glyph: string;
  model: string;
  status: Status;
  load: number;
}

const STATUS_COLOR: Record<Status, string> = {
  linked: "text-primary",
  syncing: "text-accent",
  idle: "text-muted-foreground",
  offline: "text-destructive",
};

const TENTACLES: TentacleItem[] = [
  { id: "octopus",   label: "Осьминог",     glyph: "⚚", model: "head-local-70b", status: "linked",  load: 74 },
  { id: "home",      label: "HOME",          glyph: "⌂", model: "router-mini",     status: "linked",  load: 21 },
  { id: "analysis",  label: "АНАЛИЗ",        glyph: "◎", model: "analyst-v3",      status: "syncing", load: 58 },
  { id: "generator", label: "ГЕНЕРАТОР",     glyph: "✦", model: "gen-xl",          status: "linked",  load: 66 },
  { id: "coder",     label: "ПРОГРАММИСТ",   glyph: "⌗", model: "swe-coder-32b",   status: "linked",  load: 82 },
  { id: "extract",   label: "ИЗВЛЕЧЕНИЕ",    glyph: "🔬", model: "extract-ocr",     status: "idle",    load: 8 },
  { id: "circuit",   label: "СХЕМОТЕХНИК",   glyph: "⌁", model: "circuit-net",     status: "idle",    load: 12 },
  { id: "clone",     label: "КОПИЯ ЛИЧНОСТИ", glyph: "☍", model: "persona-clone",  status: "offline", load: 0 },
  { id: "memory",    label: "ПАМЯТЬ",        glyph: "🧠", model: "vector-core",     status: "linked",  load: 44 },
  { id: "webgen",    label: "ВЕБ-ГЕНЕРАТОР", glyph: "◇", model: "webgen-2",        status: "syncing", load: 37 },
  { id: "chat",      label: "ЧАТ",           glyph: "▣", model: "chat-flesh",      status: "linked",  load: 29 },
  { id: "webedit",   label: "ВЕБ-РЕДАКТОР",  glyph: "✎", model: "web-edit",        status: "idle",    load: 5 },
  { id: "slides",    label: "ПРЕЗЕНТАЦИИ",   glyph: "▤", model: "deckforge",       status: "idle",    load: 3 },
  { id: "officecli", label: "OFFICECLI",     glyph: "💾", model: "office-cli",      status: "linked",  load: 18 },
  { id: "media",     label: "МЕДИА",         glyph: "📼", model: "media-mux",       status: "idle",    load: 9 },
  { id: "diffusers", label: "DIFFUSERS",     glyph: "✧", model: "sdxl-turbo",       status: "syncing", load: 51 },
];

const PANE_LOGS: Record<string, string[]> = {
  "MACOS-BASH": ["$ ~ kraken attach --shell", "> mounting /flesh/bus0", "> ok · 12ms"],
  SWE: ["$ repo scan 412 files", "> patching tentacle/coder", "> tests 38/38 green"],
  TERMINAL: ["$ head dispatch --auto", "> tentacles awake: 9", "> waiting for will"],
  WEB: ["$ fetch agentworld/index", "> dom parsed 1.2mb", "> selectors cached"],
};

const CHAT = [
  { from: "head", text: "Голова онлайн. Щупальца 9/16 в связке." },
  { from: "op", text: "Собери отчёт по извлечению и отдай программисту." },
  { from: "head", text: "Маршрут: ИЗВЛЕЧЕНИЕ → АНАЛИЗ → ПРОГРАММИСТ. Запускаю." },
];

const MARKET = [
  { name: "VOICE-WEAVER", vendor: "flesh.labs", size: "2.1 GB", price: "FREE", tag: "audio" },
  { name: "GRAPH-SEER",   vendor: "copper.co",  size: "890 MB", price: "12 ¤",  tag: "vision" },
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [clock, setClock] = useState("00:00:00");
  const active = TENTACLES.filter((t) => t.status !== "offline").length;
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
        <div className="relative flex h-16 w-[240px] shrink-0 items-center gap-3 overflow-hidden border-2 border-primary/70 holo glow-edge px-4 glitch-clip">
          <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
          <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-primary/25 blur-2xl" />
          <span className="relative animate-flicker font-display text-3xl neon-text">⚚</span>
          <div className="relative leading-tight">
            <div className="font-display text-sm font-black uppercase tracking-[0.22em] neon-text">KRAKEN.OS</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">ОСЬМИНОГ-1</div>
          </div>
        </div>
        {/* Status strip */}
        <div className="relative flex flex-1 items-center gap-2 overflow-hidden border-2 border-primary/70 holo px-4">
          <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <StatCell label="РЕЖИМ" value="АВТОНОМНЫЙ" />
          <Divider />
          <StatCell label="СТАТУС" value="РАБОТА" />
          <Divider />
          <StatCell label="ЩУПАЛЬЦА" value={`${active}/${TENTACLES.length}`} />
          <Divider />
          <StatCell label="ВРЕМЯ" value={clock} mono />
        </div>
        {/* Head status */}
        <div className="relative hidden md:flex h-16 w-[220px] shrink-0 flex-col justify-center overflow-hidden border-2 border-primary/70 holo px-4">
          <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            head online // local
          </span>
          <span className="mt-0.5 font-display text-sm font-bold uppercase tracking-widest neon-text">Осьминог</span>
        </div>
        {/* Settings */}
        <button
          aria-label="настройки"
          title="Настройки"
          onClick={() => setSettingsOpen(true)}
          className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-primary/70 holo font-display text-2xl neon-text transition hover:bg-primary/15 hover:shadow-[0_0_26px_var(--glow)]"
        >
          <Settings className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
        </button>
      </div>

      {settingsOpen && (
        <SettingsOverlay
          theme={theme}
          setTheme={setTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* WORKSPACE */}
      <div className="relative z-10 grid flex-1 min-h-0 grid-cols-[240px_1fr_360px] gap-2 px-2 pb-2">
        {/* LEFT: tentacles */}
        <aside className="relative flex flex-col overflow-hidden border-2 border-primary/70 holo">
          <div className="relative flex items-center justify-between border-b-2 border-primary/70 bg-primary/10 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.32em] neon-text">
            ЩУПАЛЬЦА
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">{active}/{TENTACLES.length}</span>
          </div>
          <ul className="flex-1 overflow-y-auto p-2 space-y-2">
            {TENTACLES.map((t) => {
              const isActive = selected === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSelected(t.id)}
                    className={`group relative block w-full overflow-hidden border-2 px-3 py-2 text-left transition-all duration-200 hover:translate-x-0.5 ${
                      isActive
                        ? "border-primary bg-primary/20 shadow-[0_0_22px_var(--glow)]"
                        : "border-primary/40 holo hover:border-primary/80 hover:shadow-[0_0_16px_color-mix(in_oklab,var(--glow)_35%,transparent)]"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
                    {isActive && (
                      <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-primary shadow-[0_0_12px_var(--glow)]" />
                    )}
                    <div className="relative flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-primary/50 bg-background/60 font-display text-xs neon-text">
                        {t.glyph}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[11px] font-bold uppercase tracking-widest text-primary">
                          {t.label}
                        </span>
                        <span className="block truncate font-mono text-[9px] text-muted-foreground">{t.model}</span>
                      </span>
                      <span className={`font-mono text-[9px] uppercase ${STATUS_COLOR[t.status]}`}>●</span>
                    </div>
                    <div className="relative mt-2 h-1 w-full overflow-hidden border border-border/50 bg-background/60">
                      <div
                        className="h-full bg-gradient-to-r from-accent via-primary to-primary transition-all duration-700"
                        style={{
                          width: `${t.load}%`,
                          boxShadow: "0 0 10px color-mix(in oklab, var(--glow) 70%, transparent)",
                        }}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="relative m-2 shrink-0 overflow-hidden glitch-clip border-2 border-accent/60 bg-accent/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-accent transition hover:bg-accent/25">
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] hazard opacity-60" />
            ▾ скачать щупальце
          </button>
        </aside>

        {/* CENTER */}
        <section className="relative flex flex-col overflow-hidden border-2 border-primary/70 holo">
          {/* Skull backdrop — hero of the first design, now the core of the deck */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[70%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[90px]" />
            <img
              src={krakenSkull}
              alt=""
              aria-hidden
              className="relative h-full w-full animate-breathe object-contain mix-blend-screen"
              style={{ maskImage: "radial-gradient(ellipse at center, black 45%, transparent 78%)" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 cyber-grid animate-drift opacity-25" />
          <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70" />

          {/* header */}
          <div className="relative z-10 flex items-center justify-between border-b-2 border-primary/70 bg-background/70 px-4 py-2">
            <span className="flex items-center gap-3">
              <span className="h-4 w-1 bg-primary shadow-[0_0_12px_var(--glow)]" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.32em] neon-text">
                {TENTACLES.find((t) => t.id === selected)?.label ?? "ОСЬМИНОГ"}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                {TENTACLES.find((t) => t.id === selected)?.model}
              </span>
            </span>
            <div className="flex items-center gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 border-2 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-widest transition ${
                    tab === t
                      ? "border-primary bg-primary/20 neon-text shadow-[0_0_18px_var(--glow)]"
                      : "border-primary/50 holo text-primary/80 hover:border-primary hover:text-primary"
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
          <div className="relative z-10 flex items-center gap-6 border-t-2 border-primary/70 bg-background/70 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-widest">
            {QUICK.map((q) => (
              <button key={q.label} className="group flex items-center gap-2 text-primary/80 transition hover:text-primary">
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[9px] transition group-hover:shadow-[0_0_12px_var(--glow)] ${
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
        <aside className="flex flex-col overflow-hidden border-2 border-primary/70 holo">
          <div className="relative flex items-center gap-2 border-b-2 border-primary/70 bg-background/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-primary neon-text">ONLINE</span>
            <span className="text-muted-foreground">agentworld</span>
          </div>
          <div className="relative flex-1 overflow-y-auto bg-background/60 p-3">
            <img
              src={krakenSkull}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-screen"
            />
            <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
            <div className="relative space-y-2">
              {CHAT.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[90%] glitch-clip border px-3 py-2 font-mono text-[11px] ${
                    m.from === "head"
                      ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_14px_color-mix(in_oklab,var(--glow)_18%,transparent)]"
                      : "ml-auto border-accent/50 bg-accent/10 text-accent"
                  }`}
                >
                  <div className="mb-1 text-[9px] uppercase tracking-[0.24em] opacity-70">
                    {m.from === "head" ? "голова" : "оператор"}
                  </div>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="relative mt-4">
              <div className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                маркет щупалец
              </div>
              <div className="space-y-2">
                {MARKET.map((m) => (
                  <div key={m.name} className="group relative holo glitch-clip overflow-hidden p-3 transition hover:shadow-[0_0_20px_color-mix(in_oklab,var(--glow)_30%,transparent)]">
                    <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
                    <div className="relative flex items-center justify-between">
                      <span className="bg-accent/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-accent">
                        {m.tag}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">{m.size}</span>
                    </div>
                    <div className="relative mt-2 flex items-end justify-between">
                      <div>
                        <div className="font-display text-[11px] font-bold uppercase tracking-widest text-primary">
                          {m.name}
                        </div>
                        <div className="font-mono text-[9px] text-muted-foreground">by {m.vendor}</div>
                      </div>
                      <span className="font-display text-xs font-bold neon-text">{m.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 border-t-2 border-primary/70 bg-background/70 p-2"
          >
            <input
              placeholder="Спросить AgentWorld router"
              className="flex-1 border-2 border-primary/70 bg-background/60 px-3 py-2 font-mono text-[12px] text-primary placeholder:text-primary/50 outline-none focus:border-primary"
            />
            <button
              aria-label="отправить"
              className="flex h-10 w-10 items-center justify-center border-2 border-primary/70 holo font-display text-lg neon-text transition hover:bg-primary/15 hover:shadow-[0_0_20px_var(--glow)]"
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

function SettingsOverlay({
  theme,
  setTheme,
  onClose,
}: {
  theme: ThemeSlug;
  setTheme: (s: ThemeSlug) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden border-2 border-primary/70 holo glow-edge">
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
        <div className="relative flex items-center justify-between border-b-2 border-primary/70 bg-primary/10 px-4 py-3">
          <div>
            <h2 className="font-display text-sm font-black uppercase tracking-[0.3em] neon-text">
              НАСТРОЙКИ // ОБОЛОЧКА
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              10 скинов · цвет, геометрия и шрифты
            </p>
          </div>
          <button
            aria-label="закрыть"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-primary/60 neon-text transition hover:bg-primary/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative grid flex-1 gap-2 overflow-y-auto p-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const isActive = theme === t.slug;
            return (
              <button
                key={t.slug}
                onClick={() => setTheme(t.slug)}
                className={`group relative overflow-hidden border-2 p-3 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/15 shadow-[0_0_24px_var(--glow)]"
                    : "border-primary/40 hover:border-primary/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {t.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="h-5 w-3 rounded-sm ring-1 ring-black/40"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  {isActive && (
                    <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                      активна
                    </span>
                  )}
                </div>
                <div className="mt-2 font-display text-[12px] font-black uppercase tracking-[0.18em] neon-text">
                  {t.name}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{t.tagline}</div>
                <div className="mt-2 border-t border-primary/25 pt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary/70">
                  {t.fonts}
                </div>
                <div className="mt-1 font-mono text-[9px] lowercase tracking-[0.06em] text-muted-foreground">
                  {t.shape}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative border-t-2 border-primary/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          выбор сохраняется локально · перезапуск не требуется
        </div>
      </div>
    </div>
  );
}

function WorkPane({ title }: { title: string }) {
  return (
    <div className="group relative flex min-h-0 flex-col overflow-hidden border-2 border-primary/70 holo p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_0_28px_color-mix(in_oklab,var(--glow)_32%,transparent)]">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
      <div className="pointer-events-none absolute inset-1.5 brackets opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-sweep bg-gradient-to-b from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <h2 className="animate-flicker font-display text-2xl font-black uppercase tracking-widest neon-text lg:text-3xl">
          {title}
        </h2>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-primary/70">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-primary/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          IDLE
        </span>
      </div>
      <div className="relative mt-2 h-px w-full bg-gradient-to-r from-primary/70 via-primary/20 to-transparent" />
      <div className="relative mt-2 flex-1 overflow-hidden border border-primary/40 bg-background/70 p-2 font-mono text-[10px] leading-relaxed text-primary/80 shadow-[inset_0_0_30px_color-mix(in_oklab,var(--primary)_8%,transparent)]">
        {(PANE_LOGS[title] ?? ["_"]).map((l, i) => (
          <div key={i} className={i === 0 ? "text-primary" : "text-muted-foreground"}>
            {l}
          </div>
        ))}
        <div className="mt-1 animate-flicker text-primary">▍</div>
      </div>
    </div>
  );
}
