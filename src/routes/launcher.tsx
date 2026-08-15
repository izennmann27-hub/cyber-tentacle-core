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
          "Прототип киберпанк-лаунчера Осьминога для Samsung Galaxy Z Fold 6: экран блокировки с анимацией и чистый главный экран с виджетом погоды и строкой к голове.",
      },
      { property: "og:title", content: "ОСЬМИНОГ // лаунчер Z Fold 6" },
      {
        property: "og:description",
        content: "Складной лаунчер: обои-осьминог, виджет погоды и одна строка вопроса локальной голове.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LauncherPrototype,
});

function useClock() {
  const [t, setT] = useState({ time: "--:--", date: "" });
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT({
        time: d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        date: d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }),
      });
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
      <span className="text-primary/70">{time}</span>
      <span className="truncate">осьминог-0 · локально</span>
      <span>▮▮▮ 92%</span>
    </div>
  );
}

function WeatherWidget({ wide }: { wide?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-primary/25 bg-background/40 p-5 backdrop-blur-md",
        wide && "flex items-center justify-between gap-6",
      )}
    >
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          москва · сейчас
        </div>
        <div className="mt-1 flex items-end gap-3">
          <span className="font-display text-4xl leading-none text-foreground/90">+21°</span>
          <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
            туман · ветер 3 м/с
          </span>
        </div>
      </div>
      <div className={cn("mt-4 flex gap-4", wide && "mt-0")}>
        {[
          ["12", "+22°"],
          ["15", "+23°"],
          ["18", "+20°"],
          ["21", "+17°"],
        ].map(([h, v]) => (
          <div key={h} className="text-center font-mono text-[10px] text-muted-foreground">
            <div className="tracking-[0.2em]">{h}</div>
            <div className="mt-1 text-foreground/85">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptBar({ compact }: { compact?: boolean }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-3 rounded-full border border-primary/30 bg-background/45 px-5 py-3 backdrop-blur-md transition-colors focus-within:border-primary/70"
    >
      <span className="font-mono text-[10px] text-primary/60">▌</span>
      <input
        aria-label="Запрос к голове"
        placeholder={compact ? "спросить голову" : "опишите задачу — голова выберет щупальца"}
        className="w-full bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </form>
  );
}

/* ЭКРАН БЛОКИРОВКИ — анимированные обои */
function LockContent({ time, date }: { time: string; date: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <StatusBar time={time} />
      <div className="px-7 pt-16 text-center">
        <div className="font-display text-6xl leading-none tracking-[0.08em] text-foreground/92">
          {time}
        </div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/70">
          {date}
        </div>
      </div>
      <div className="mt-auto px-7 pb-10 text-center font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground">
        голова активна · 8 щупалец
      </div>
    </div>
  );
}

/* ГЛАВНЫЙ ЭКРАН — статичные обои, только погода + строка */
function HomeContent({ time, wide }: { time: string; wide?: boolean }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <StatusBar time={time} />
      <div className={cn("px-6 pt-10", wide && "px-12 pt-14")}>
        <WeatherWidget wide={wide} />
      </div>
      <div className={cn("mt-auto px-6 pb-[18%]", wide && "px-12 pb-[14%]")}>
        <PromptBar compact={!wide} />
        <div className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/80">
          100% локально
        </div>
      </div>
    </div>
  );
}

function Device({
  folded,
  children,
  animated,
}: {
  folded: boolean;
  animated: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-primary/30 bg-background shadow-2xl",
        folded ? "h-[820px] w-[332px] rounded-[38px]" : "h-[820px] w-[704px] rounded-[30px]",
      )}
    >
      <GlitchBackdrop
        animated={animated}
        seed={folded ? 7311 : 20260815}
        lineCount={folded ? 46 : 58}
        lineLength={folded ? 12 : 30}
        skullOpacity={animated ? 0.2 : 0.34}
      />
      {children}
    </div>
  );
}

function LauncherPrototype() {
  const { time, date } = useClock();
  const [folded, setFolded] = useState(false);
  const [locked, setLocked] = useState(false);
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
              обои в заполнении · анимация только на блокировке
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {[
              { on: !folded, label: "раскрыт", act: () => setFolded(false) },
              { on: folded, label: "сложен", act: () => setFolded(true) },
              { on: locked, label: "блокировка", act: () => setLocked(!locked) },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={b.act}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] transition-colors",
                  b.on
                    ? "border-primary/70 bg-primary/10 text-primary"
                    : "border-primary/25 text-muted-foreground hover:text-foreground",
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </header>

        <Device folded={folded} animated={locked}>
          {locked ? (
            <LockContent time={time} date={date} />
          ) : (
            <HomeContent time={time} wide={!folded} />
          )}
        </Device>

        <div className="flex w-full flex-wrap items-center justify-center gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setTheme(t.slug as ThemeSlug)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors",
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
