import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlitchBackdrop } from "@/components/glitch-backdrop";
import { useTheme } from "@/hooks/use-theme";
import { THEMES, type ThemeSlug } from "@/lib/themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/launcher")({
  head: () => ({
    meta: [
      { title: "ОСЬМИНОГ // лаунчер Z Fold 6" },
      {
        name: "description",
        content:
          "Прототип киберпанк-лаунчера Осьминога для Samsung Galaxy Z Fold 6: обложка и раскрытый экран, щупальца-инструменты, локальная голова-модель.",
      },
      { property: "og:title", content: "ОСЬМИНОГ // лаунчер Z Fold 6" },
      {
        property: "og:description",
        content: "Складной лаунчер: строка ввода к локальной голове и сетка щупалец-инструментов.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LauncherPrototype,
});

interface Tool {
  glyph: string;
  name: string;
  model: string;
  load: number;
}

const TOOLS: Tool[] = [
  { glyph: "亭", name: "TERMINAL", model: "bash-8b", load: 12 },
  { glyph: "侬", name: "SWE", model: "coder-14b", load: 61 },
  { glyph: "田", name: "WEB", model: "probe-3b", load: 24 },
  { glyph: "仞", name: "VISION", model: "clip-l", load: 8 },
  { glyph: "严", name: "ГОЛОС", model: "whisper-s", load: 0 },
  { glyph: "丐", name: "ПАМЯТЬ", model: "vec-mini", load: 39 },
  { glyph: "佷", name: "ФАЙЛЫ", model: "fs-agent", load: 4 },
  { glyph: "↯", name: "МАРКЕТ", model: "octo.net", load: 0 },
];

function useClock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
      <span className="text-primary/70">{time}</span>
      <span>осьминог-0 · локально</span>
      <span>▮▮▮ 92%</span>
    </div>
  );
}

function ToolTile({ t }: { t: Tool }) {
  return (
    <button className="group relative flex flex-col items-center gap-1.5 p-1">
      <span className="grid h-12 w-12 place-items-center border border-primary/30 bg-background/50 font-display text-lg text-primary/90 transition-colors group-hover:border-primary/70 group-hover:bg-primary/10">
        {t.glyph}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-foreground/80">
        {t.name}
      </span>
      <span className="h-px w-8 bg-primary/20">
        <span className="block h-px bg-primary/70" style={{ width: `${t.load}%` }} />
      </span>
    </button>
  );
}

function PromptBar({ compact }: { compact?: boolean }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2 border border-primary/30 bg-background/50 px-3 py-2 backdrop-blur-sm focus-within:border-primary/70"
    >
      <span className="font-mono text-[10px] text-primary/60">▌</span>
      <input
        aria-label="Запрос к голове"
        placeholder={compact ? "задача → голова" : "опишите задачу — голова выберет щупальца"}
        className="w-full bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </form>
  );
}

function Dock() {
  return (
    <div className="mx-4 mb-3 flex items-center justify-around border border-primary/20 bg-background/40 px-2 py-2 backdrop-blur-sm">
      {["亭", "侬", "田", "↯"].map((g) => (
        <span
          key={g}
          className="grid h-9 w-9 place-items-center border border-primary/25 font-display text-base text-primary/85"
        >
          {g}
        </span>
      ))}
    </div>
  );
}

/* Cover display: 968x2376 → 22.5:9 */
function CoverScreen({ time }: { time: string }) {
  return (
    <div className="relative h-[820px] w-[332px] overflow-hidden border border-primary/30 bg-background">
      <GlitchBackdrop seed={7311} lineCount={46} lineLength={12} skullOpacity={0.14} />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar time={time} />
        <div className="px-4 pt-8">
          <div className="font-display text-lg uppercase tracking-[0.24em] text-foreground/90">
            голова
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary/70">
            готова · 8 щупалец
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-1 px-3">
          {TOOLS.slice(0, 6).map((t) => (
            <ToolTile key={t.name} t={t} />
          ))}
        </div>
        <div className="mt-auto px-4 pb-3">
          <PromptBar compact />
        </div>
        <Dock />
      </div>
    </div>
  );
}

/* Main display: 1856x2160 */
function MainScreen({ time }: { time: string }) {
  return (
    <div className="relative h-[820px] w-[704px] overflow-hidden border border-primary/30 bg-background">
      <GlitchBackdrop seed={20260815} lineCount={58} lineLength={30} skullOpacity={0.18} />
      <div className="absolute inset-y-0 left-1/2 w-px bg-primary/10" />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar time={time} />
        <div className="flex items-baseline justify-between px-5 pt-6">
          <span className="font-display text-2xl uppercase tracking-[0.22em] text-foreground/90">
            ОСЬМИНОГ - 0
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-primary/70">
            автономный режим
          </span>
        </div>

        <div className="grid flex-1 grid-cols-[1fr_260px] gap-4 px-5 pt-6">
          <div>
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              щупальца
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TOOLS.map((t) => (
                <ToolTile key={t.name} t={t} />
              ))}
            </div>
            <div className="mt-6 border border-primary/20 bg-background/40 p-3 backdrop-blur-sm">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary/70">
                журнал головы
              </div>
              <div className="mt-2 space-y-1 font-mono text-[10px] text-muted-foreground">
                <div>[роутер] запрос разобран · 3 щупальца выбраны</div>
                <div>[swe] патч собран · ожидание подтверждения</div>
                <div className="text-primary/70">[голова] локальный ответ готов</div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col border border-primary/20 bg-background/40 backdrop-blur-sm">
            <div className="border-b border-primary/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-primary/70">
              online · agentworld
            </div>
            <div className="flex-1 space-y-2 overflow-hidden p-3 font-mono text-[10px]">
              <div className="text-foreground/85">&gt; собери отчёт по логам</div>
              <div className="text-primary/70">[голова] запускаю ФАЙЛЫ + ПАМЯТЬ</div>
              <div className="text-foreground/85">&gt; добавь график</div>
              <div className="text-primary/70">[голова] щупальце SWE активно</div>
            </div>
          </aside>
        </div>

        <div className="px-5 pb-4 pt-4">
          <PromptBar />
          <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/80">
            <span>щупальца: 8 подключено</span>
            <span>100% локально</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LauncherPrototype() {
  const time = useClock();
  const [folded, setFolded] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
        <header className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg uppercase tracking-[0.22em] text-foreground/90">
              лаунчер · z fold 6
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              прототип · обложка 968×2376 · экран 1856×2160
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {(["unfolded", "folded"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFolded(m === "folded")}
                className={cn(
                  "border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors",
                  (m === "folded") === folded
                    ? "border-primary/70 bg-primary/10 text-primary"
                    : "border-primary/25 text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "folded" ? "сложен" : "раскрыт"}
              </button>
            ))}
          </div>
        </header>

        <div className="relative">
          {folded ? <CoverScreen time={time} /> : <MainScreen time={time} />}
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setTheme(t.slug as ThemeSlug)}
              aria-label={t.name}
              className={cn(
                "border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors",
                theme === t.slug
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-primary/20 text-muted-foreground hover:text-foreground",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}