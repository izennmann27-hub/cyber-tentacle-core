import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { THEMES } from "@/lib/themes";
import krakenSkullAsset from "@/assets/kraken-skull.png.asset.json";
const krakenSkull = krakenSkullAsset.url;
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRAKEN.OS // Neural Ops Deck" },
      {
        name: "description",
        content:
          "Cyberpunk web-app deck: local head-model dispatches downloadable neural tentacles across a 2×2 workspace.",
      },
      { property: "og:title", content: "KRAKEN.OS // Neural Ops Deck" },
      {
        property: "og:description",
        content:
          "Web-app control deck with tentacle rail, 2×2 workspace, AgentWorld chat and 10 cyber skins.",
      },
    ],
  }),
  component: Index,
});

type Status = "linked" | "idle" | "syncing" | "offline";
type Tentacle = { id: string; name: string; model: string; status: Status; load: number; glyph: string };

const TENTACLES: Tentacle[] = [
  { id: "1", name: "Kraken-Vision",  model: "llava-next-34b",   status: "linked",  load: 74, glyph: "◉" },
  { id: "2", name: "Ink-Sable",      model: "sdxl-turbo",       status: "syncing", load: 58, glyph: "✦" },
  { id: "3", name: "Deep-Scribe",    model: "gpt-oss-70b",      status: "linked",  load: 41, glyph: "✎" },
  { id: "4", name: "Sonar",          model: "whisper-large-v3", status: "idle",    load: 12, glyph: "♒" },
  { id: "5", name: "Wraith-Coder",   model: "qwen3-coder-32b",  status: "linked",  load: 88, glyph: "⌘" },
  { id: "6", name: "Oracle",         model: "embed-mxbai-v2",   status: "syncing", load: 33, glyph: "⌬" },
  { id: "7", name: "Voxbind",        model: "xtts-v2",          status: "linked",  load: 26, glyph: "◊" },
  { id: "8", name: "Rift-Broker",    model: "mistral-8x22b",    status: "offline", load: 0,  glyph: "☍" },
];

const STATUS_DOT: Record<Status, string> = {
  linked: "bg-primary",
  syncing: "bg-accent",
  idle: "bg-muted-foreground",
  offline: "bg-destructive",
};

type Pane = { id: string; title: string; kind: string; lines: string[] };
const PANES: Pane[] = [
  {
    id: "bash",
    title: "MACOS-BASH",
    kind: "shell",
    lines: [
      "$ kraken link --tentacle vision",
      "» handshake ok · 74% load",
      "$ ./scan ./screenshots",
      "» 12 frames parsed",
    ],
  },
  {
    id: "swe",
    title: "SWE",
    kind: "agent",
    lines: [
      "> wraith-coder :: task=refactor",
      "  · touched 14 files",
      "  · tests 218/218 passed",
      "  · pushing branch feat/ink",
    ],
  },
  {
    id: "term",
    title: "TERMINAL",
    kind: "log",
    lines: [
      "[net] socket ▸ 127.0.0.1:9987",
      "[bus] tick 0x8A3 · 22ms",
      "[gpu] vram 18.4 / 24.0 GB",
      "[bus] tick 0x8A4 · 21ms",
    ],
  },
  {
    id: "web",
    title: "WEB",
    kind: "browser",
    lines: [
      "◈ https://cortex.exchange/feed",
      "· necro-face 3.4GB ★★★★★",
      "· splicer 1.1GB ★★★★☆",
      "· astral-ear 780MB ★★★★★",
    ],
  },
];

const CHAT: { who: "head" | "user"; text: string }[] = [
  { who: "head", text: "AgentWorld на связи. Голова слушает." },
  { who: "user", text: "Собери отчёт по скринам и озвучь." },
  { who: "head", text: "Дёргаю Kraken-Vision → Deep-Scribe → Voxbind. 3 щупальца в ритуале." },
  { who: "user", text: "Погнали." },
  { who: "head", text: "Готово через ~42s. Стрим в TERMINAL." },
];

function Index() {
  const { theme, setTheme } = useTheme();
  const active = TENTACLES.filter((t) => t.status !== "offline").length;
  const [selected, setSelected] = useState("1");
  const [clock, setClock] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="cyber-surface relative h-screen overflow-hidden flex flex-col">
      <h1 className="sr-only">KRAKEN.OS — Neural Ops Deck</h1>
      <div className="pointer-events-none fixed inset-0 cyber-grid animate-drift opacity-25" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center gap-4 border-b border-border/60 bg-background/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm neon-border bg-background font-display text-sm neon-text">⌾</span>
          <span className="font-display text-xs font-black uppercase tracking-[0.28em]">KRAKEN<span className="text-accent">.</span>OS</span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          mode: ritual · node local · head stable
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">▮ {active}/{TENTACLES.length} live</span>
          <span className="font-mono text-[10px] text-muted-foreground">{clock} UTC</span>
          <div className="flex items-center gap-1">
            {THEMES.map((t) => (
              <button
                key={t.slug}
                title={t.name}
                onClick={() => setTheme(t.slug)}
                aria-label={t.name}
                className={`h-3 w-3 rounded-full border border-border/70 transition ${theme === t.slug ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"}`}
                style={{ background: t.swatch?.[0] ?? "var(--primary)" }}
              />
            ))}
          </div>
          <button className="border border-destructive/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-destructive hover:bg-destructive/10">
            power
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="relative z-10 grid flex-1 min-h-0 grid-cols-[240px_1fr_320px] gap-2 p-2">
        {/* LEFT: tentacles */}
        <aside className="panel glitch-clip flex flex-col overflow-hidden">
          <div className="border-b border-border/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            // tentacles
          </div>
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {TENTACLES.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelected(t.id)}
                  className={`group flex w-full items-center gap-2 border px-2 py-1.5 text-left transition ${
                    selected === t.id
                      ? "border-primary/70 bg-primary/10 text-foreground"
                      : "border-border/50 bg-background/40 hover:border-primary/40"
                  }`}
                >
                  <span className="font-display text-sm neon-text w-4 text-center">{t.glyph}</span>
                  <span className="flex-1">
                    <span className="block font-display text-[11px] font-bold uppercase tracking-widest">{t.name}</span>
                    <span className="block font-mono text-[9px] text-muted-foreground">{t.model}</span>
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                  <span className="font-mono text-[9px] text-muted-foreground w-6 text-right">{t.load}%</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-border/50 p-2">
            <button className="w-full border border-primary/40 bg-primary/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/20">
              + download tentacle
            </button>
          </div>
        </aside>

        {/* CENTER: 2x2 workspace with skull bg */}
        <section className="panel glitch-clip relative overflow-hidden">
          <img
            src={krakenSkull}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-20 mix-blend-luminosity animate-tentacle"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70" />
          <div className="relative grid h-full grid-cols-2 grid-rows-2 gap-2 p-2">
            {PANES.map((p) => (
              <WorkPane key={p.id} pane={p} />
            ))}
          </div>
        </section>

        {/* RIGHT: AgentWorld chat */}
        <aside className="panel glitch-clip flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">// agentworld</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary">● online</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {CHAT.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] border px-2 py-1.5 font-mono text-[11px] ${
                  m.who === "head"
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "ml-auto border-border/60 bg-background/50 text-muted-foreground"
                }`}
              >
                <div className="mb-0.5 font-display text-[9px] uppercase tracking-widest text-accent">
                  {m.who === "head" ? "kraken.head" : "operator"}
                </div>
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-1 border-t border-border/50 p-2"
          >
            <input
              placeholder="> command the head..."
              className="flex-1 border border-border/60 bg-background/60 px-2 py-1.5 font-mono text-[11px] outline-none focus:border-primary"
            />
            <button className="border border-primary/50 bg-primary/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/20">
              send
            </button>
          </form>
        </aside>
      </div>

      {/* STATUS BAR */}
      <div className="relative z-10 flex items-center gap-4 border-t border-border/60 bg-background/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground backdrop-blur">
        <span className="text-primary">● signal ok</span>
        <span>skin: {THEMES.find((t) => t.slug === theme)?.name}</span>
        <span>gpu 18.4/24.0 GB</span>
        <span>net 127.0.0.1:9987</span>
        <span className="ml-auto">no gods · no admins</span>
      </div>
    </main>
  );
}

function WorkPane({ pane }: { pane: Pane }) {
  return (
    <div className="flex min-h-0 flex-col border border-primary/30 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between border-b border-primary/30 bg-background/80 px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive/80" />
            <span className="h-2 w-2 rounded-full bg-accent/80" />
            <span className="h-2 w-2 rounded-full bg-primary/80" />
          </span>
          <span className="font-display text-[10px] font-bold uppercase tracking-widest neon-text">
            {pane.title}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {pane.kind}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-2 font-mono text-[11px] leading-relaxed text-foreground/90">
        {pane.lines.map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
        <span className="inline-block h-3 w-2 translate-y-0.5 bg-primary animate-flicker" />
      </div>
    </div>
  );
}
