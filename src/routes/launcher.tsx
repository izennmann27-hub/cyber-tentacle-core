import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlitchBackdrop } from "@/components/glitch-backdrop";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/launcher")({
  head: () => ({
    meta: [
      { title: "ОСЬМИНОГ // лаунчер Z Fold 6" },
      {
        name: "description",
        content:
          "Прототип киберпанк-лаунчера Осьминога для Samsung Galaxy Z Fold 6: экран блокировки с анимацией и главный экран с виджетом погоды и строкой к голове.",
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

const ACCENT_KEY = "kraken.launcher.accent";
const DEFAULT_ACCENT = "#8fb4ff";
const ACCENTS = ["#8fb4ff", "#6f5cff", "#4fd8c4", "#00ff62", "#fcee0a", "#ff7a45", "#ff5ca8", "#e6e9f2"];

function useAccent() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  useEffect(() => {
    const v = window.localStorage.getItem(ACCENT_KEY);
    if (v) setAccent(v);
  }, []);
  const update = (v: string) => {
    setAccent(v);
    window.localStorage.setItem(ACCENT_KEY, v);
  };
  return { accent, setAccent: update };
}

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

function LockContent({ time, date }: { time: string; date: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <StatusBar time={time} />
      <div className="px-7 pt-16 text-center">
        <div className="font-display text-6xl leading-none tracking-[0.08em] text-foreground/92">{time}</div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/70">{date}</div>
      </div>
      <div className="mt-auto px-7 pb-10 text-center font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground">
        голова активна · 8 щупалец
      </div>
    </div>
  );
}

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

function GearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Настройки лаунчера"
      onClick={onClick}
      className="absolute right-4 top-3 z-20 rounded-full border border-primary/25 bg-background/40 p-2 text-primary/70 backdrop-blur-md transition-colors hover:text-primary"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
      </svg>
    </button>
  );
}

function SettingsOverlay({
  accent,
  onAccent,
  folded,
  onFolded,
  locked,
  onLocked,
  onClose,
}: {
  accent: string;
  onAccent: (v: string) => void;
  folded: boolean;
  onFolded: (v: boolean) => void;
  locked: boolean;
  onLocked: (v: boolean) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-background/70 backdrop-blur-md">
      <div className="w-full rounded-t-[28px] border-t border-primary/25 bg-background/85 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm uppercase tracking-[0.24em] text-foreground/90">настройки</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-primary/30 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-primary"
          >
            закрыть
          </button>
        </div>

        <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          акцентный цвет
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Акцент ${c}`}
              onClick={() => onAccent(c)}
              className={cn(
                "h-7 w-7 rounded-full ring-1 transition-transform",
                accent.toLowerCase() === c.toLowerCase()
                  ? "scale-110 ring-foreground/70"
                  : "ring-foreground/20 hover:scale-105",
              )}
              style={{ background: c }}
            />
          ))}
          <label className="ml-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            свой
            <input
              type="color"
              value={accent}
              onChange={(e) => onAccent(e.target.value)}
              className="h-7 w-9 cursor-pointer rounded-md border border-primary/30 bg-transparent"
            />
          </label>
        </div>

        <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          режим прототипа
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { on: !folded, label: "раскрыт", act: () => onFolded(false) },
            { on: folded, label: "сложен", act: () => onFolded(true) },
            { on: locked, label: "блокировка", act: () => onLocked(!locked) },
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
      </div>
    </div>
  );
}

function LauncherPrototype() {
  const { time, date } = useClock();
  const [folded, setFolded] = useState(false);
  const [locked, setLocked] = useState(false);
  const [settings, setSettings] = useState(false);
  const { accent, setAccent } = useAccent();

  return (
    <main
      data-theme="octo"
      className="relative h-screen w-full overflow-hidden bg-background"
      style={
        {
          "--primary": accent,
          "--accent": accent,
          "--glow": accent,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative mx-auto h-full overflow-hidden bg-background",
          folded ? "max-w-[420px]" : "max-w-[900px]",
        )}
      >
        <GlitchBackdrop
          animated={locked}
          seed={folded ? 7311 : 20260815}
          lineCount={folded ? 46 : 58}
          lineLength={folded ? 12 : 30}
          skullOpacity={locked ? 0.2 : 0.34}
        />
        <GearButton onClick={() => setSettings(true)} />
        {locked ? <LockContent time={time} date={date} /> : <HomeContent time={time} wide={!folded} />}
        {settings ? (
          <SettingsOverlay
            accent={accent}
            onAccent={setAccent}
            folded={folded}
            onFolded={setFolded}
            locked={locked}
            onLocked={setLocked}
            onClose={() => setSettings(false)}
          />
        ) : null}
      </div>
    </main>
  );
}
