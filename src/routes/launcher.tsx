import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlitchBackdrop } from "@/components/glitch-backdrop";
import { cn } from "@/lib/utils";
import krakenSkull from "@/assets/kraken-skull.png.asset.json";
import wallAbyss from "@/assets/wall-abyss.jpg";
import wallGrid from "@/assets/wall-grid.jpg";

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

const WALLPAPERS = [
  { id: "skull", name: "Осьминог-череп", url: krakenSkull.url },
  { id: "abyss", name: "Бездна", url: wallAbyss },
  { id: "grid", name: "Сетка", url: wallGrid },
] as const;

type WallId = (typeof WALLPAPERS)[number]["id"];

const GRIDS = ["4 x 5", "4 x 6", "5 x 5", "5 x 6"] as const;
type GridId = (typeof GRIDS)[number];

interface LauncherPrefs {
  accent: string;
  hue: number;
  home: WallId;
  lock: WallId;
  grid: GridId;
}

const PREFS_KEY = "kraken.launcher.prefs";
const DEFAULT_PREFS: LauncherPrefs = {
  accent: DEFAULT_ACCENT,
  hue: 222,
  home: "skull",
  lock: "skull",
  grid: "4 x 5",
};

function wallUrl(id: WallId) {
  return (WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0]).url;
}

function usePrefs() {
  const [prefs, setPrefs] = useState<LauncherPrefs>(DEFAULT_PREFS);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<LauncherPrefs>) });
      else {
        const legacy = window.localStorage.getItem(ACCENT_KEY);
        if (legacy) setPrefs({ ...DEFAULT_PREFS, accent: legacy });
      }
    } catch {
      /* ignore corrupt prefs */
    }
  }, []);
  const update = (patch: Partial<LauncherPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };
  return { prefs, update };
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

const DOCK_APPS = [
  { glyph: "◉", label: "Голова" },
  { glyph: "≋", label: "Щупальца" },
  { glyph: "⌘", label: "Терминал" },
  { glyph: "◫", label: "Файлы" },
  { glyph: "✉", label: "Почта" },
];

function Dock({ wide }: { wide?: boolean }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "mx-auto flex w-full max-w-[520px] items-center justify-between gap-2 rounded-[32px] border border-primary/20 bg-background/45 px-4 py-3 backdrop-blur-md",
        wide && "max-w-[560px]",
      )}
    >
      {DOCK_APPS.map((a) => (
        <button
          key={a.label}
          type="button"
          aria-label={a.label}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-primary/30 bg-primary/10 font-display text-lg text-primary transition-colors hover:bg-primary/20">
            {a.glyph}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            {a.label}
          </span>
        </button>
      ))}
    </div>
  );
}

const WEATHER_CODES: Record<number, string> = {
  0: "ясно", 1: "почти ясно", 2: "переменная облачность", 3: "облачно",
  45: "туман", 48: "изморозь", 51: "морось", 53: "морось", 55: "морось",
  61: "дождь", 63: "дождь", 65: "ливень", 71: "снег", 73: "снег", 75: "снег",
  80: "ливни", 81: "ливни", 82: "ливни", 95: "гроза", 96: "гроза", 99: "гроза",
};

interface Weather {
  temp: number;
  wind: number;
  code: number;
  hours: { h: string; t: number }[];
}

async function fetchWeather(): Promise<Weather> {
  const r = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m&forecast_days=2&timezone=Europe%2FMoscow",
  );
  if (!r.ok) throw new Error("weather unavailable");
  const j = (await r.json()) as {
    current: { temperature_2m: number; wind_speed_10m: number; weather_code: number };
    hourly: { time: string[]; temperature_2m: number[] };
  };
  const now = Date.now();
  const hours = j.hourly.time
    .map((t, i) => ({ ts: new Date(t).getTime(), t: j.hourly.temperature_2m[i] }))
    .filter((x) => x.ts > now)
    .slice(0, 8)
    .filter((_, i) => i % 2 === 0)
    .map((x) => ({
      h: new Date(x.ts).toLocaleTimeString("ru-RU", { hour: "2-digit" }).replace(":00", ""),
      t: Math.round(x.t),
    }));
  return {
    temp: Math.round(j.current.temperature_2m),
    wind: Math.round(j.current.wind_speed_10m / 3.6),
    code: j.current.weather_code,
    hours,
  };
}

function WeatherWidget({ wide }: { wide?: boolean }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weather", "moscow"],
    queryFn: fetchWeather,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void refetch();
      }}
      className={cn(
        "w-full rounded-[28px] border border-primary/25 bg-background/40 p-5 text-left backdrop-blur-md transition-colors hover:border-primary/45",
        wide && "flex items-center justify-between gap-6",
      )}
    >
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          москва · сейчас
        </div>
        <div className="mt-1 flex items-end gap-3">
          <span className="font-display text-4xl leading-none text-foreground/90">
            {data ? `${data.temp > 0 ? "+" : ""}${data.temp}°` : isError ? "--°" : "···"}
          </span>
          <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
            {data
              ? `${WEATHER_CODES[data.code] ?? "погода"} · ветер ${data.wind} м/с`
              : isError
                ? "нет связи · тап для повтора"
                : isPending
                  ? "загрузка"
                  : ""}
          </span>
        </div>
      </div>
      <div className={cn("mt-4 flex gap-4", wide && "mt-0")}>
        {(data?.hours ?? []).map((x) => (
          <div key={x.h} className="text-center font-mono text-[10px] text-muted-foreground">
            <div className="tracking-[0.2em]">{x.h}</div>
            <div className="mt-1 text-foreground/85">{`${x.t > 0 ? "+" : ""}${x.t}°`}</div>
          </div>
        ))}
      </div>
    </button>
  );
}

interface Task {
  id: number;
  text: string;
}

function PromptBar({ compact }: { compact?: boolean }) {
  const [value, setValue] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const idRef = useRef(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    idRef.current += 1;
    setTasks((prev) => [{ id: idRef.current, text }, ...prev].slice(0, 3));
    setValue("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {tasks.length ? (
        <div className="mb-3 space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="rounded-[20px] border border-primary/20 bg-background/45 px-4 py-2 backdrop-blur-md"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-primary/70">
                голова · принято
              </div>
              <div className="mt-1 truncate font-mono text-[11px] text-foreground/90">{t.text}</div>
            </div>
          ))}
        </div>
      ) : null}
      <form
        onSubmit={submit}
        className="flex items-center gap-3 rounded-full border border-primary/30 bg-background/45 px-5 py-3 backdrop-blur-md transition-colors focus-within:border-primary/70"
      >
        <span className="font-mono text-[10px] text-primary/60">▌</span>
        <input
          aria-label="Задача или вопрос голове"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          enterKeyHint="send"
          placeholder={compact ? "задача или вопрос" : "опишите задачу или задайте вопрос голове"}
          className="w-full bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Отправить голове"
          className="shrink-0 rounded-full border border-primary/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10"
        >
          ↵
        </button>
      </form>
    </div>
  );
}

function LockContent({ time, date }: { time: string; date: string }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="px-7 pt-24 text-center">
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
      <div className={cn("px-6 pt-14", wide && "px-12 pt-20")}>
        <WeatherWidget wide={wide} />
      </div>
      <div className={cn("mt-auto px-6 pb-4", wide && "px-12")}>
        <PromptBar compact={!wide} />
        <div className="mt-4">
          <Dock wide={wide} />
        </div>
      </div>
    </div>
  );
}

function SettingsOverlay({
  prefs,
  update,
  onClose,
}: {
  prefs: LauncherPrefs;
  update: (patch: Partial<LauncherPrefs>) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col bg-background/95 backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Назад"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          осьминог · лаунчер
        </span>
        <span className="h-10 w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <h2 className="pb-5 pt-2 font-display text-[34px] leading-tight text-foreground/95">Настройки</h2>

        <OneUiSection title="Обои">
          <WallpaperRow
            label="Рабочий стол"
            value={prefs.home}
            onChange={(home) => update({ home })}
          />
          <div className="h-px bg-foreground/10" />
          <WallpaperRow
            label="Экран блокировки"
            value={prefs.lock}
            onChange={(lock) => update({ lock })}
          />
        </OneUiSection>

        <OneUiSection title="Главный экран">
          <div className="px-5 py-4">
            <div className="text-[14px] text-foreground/90">Сетка приложений</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {prefs.grid}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {GRIDS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update({ grid: g })}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] transition-colors",
                    prefs.grid === g
                      ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                      : "bg-foreground/8 text-foreground/70 hover:bg-foreground/15",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
            <GridPreview grid={prefs.grid} />
          </div>
        </OneUiSection>

        <OneUiSection title="Цвет">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="text-[14px] text-foreground/90">Акцентный цвет</div>
              <span
                className="h-7 w-7 rounded-full ring-1 ring-foreground/25"
                style={{ background: prefs.accent }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={prefs.hue}
              aria-label="Оттенок акцентного цвета"
              onChange={(e) => {
                const hue = Number(e.target.value);
                update({ hue, accent: `hsl(${hue} 78% 70%)` });
              }}
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--primary)]"
              style={{
                background:
                  "linear-gradient(90deg, hsl(0 78% 70%), hsl(60 78% 70%), hsl(120 78% 70%), hsl(180 78% 70%), hsl(240 78% 70%), hsl(300 78% 70%), hsl(360 78% 70%))",
              }}
            />
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Акцент ${c}`}
                  onClick={() => update({ accent: c })}
                  className={cn(
                    "h-8 w-8 rounded-full ring-1 transition-transform",
                    prefs.accent.toLowerCase() === c.toLowerCase()
                      ? "scale-110 ring-foreground/70"
                      : "ring-foreground/20 hover:scale-105",
                  )}
                  style={{ background: c }}
                />
              ))}
              <label className="ml-1 flex items-center gap-2 text-[12px] text-muted-foreground">
                свой
                <input
                  type="color"
                  value={prefs.accent.startsWith("#") ? prefs.accent : DEFAULT_ACCENT}
                  onChange={(e) => update({ accent: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded-full border border-foreground/20 bg-transparent"
                />
              </label>
            </div>
          </div>
        </OneUiSection>
      </div>
    </div>
  );
}

function OneUiSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 px-2 text-[13px] text-primary/85">{title}</h3>
      <div className="overflow-hidden rounded-[26px] bg-foreground/[0.07] ring-1 ring-foreground/10">
        {children}
      </div>
    </section>
  );
}

function WallpaperRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: WallId;
  onChange: (v: WallId) => void;
}) {
  return (
    <div className="px-5 py-4">
      <div className="text-[14px] text-foreground/90">{label}</div>
      <div className="mt-3 flex gap-3">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onChange(w.id)}
            aria-label={`${label}: ${w.name}`}
            className={cn(
              "h-28 w-[68px] shrink-0 overflow-hidden rounded-[18px] bg-cover bg-center ring-1 transition-transform",
              value === w.id ? "scale-[1.03] ring-2 ring-primary" : "ring-foreground/15 hover:scale-[1.02]",
            )}
            style={{ backgroundImage: `url(${w.url})` }}
          />
        ))}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {WALLPAPERS.find((w) => w.id === value)?.name}
      </div>
    </div>
  );
}

function GridPreview({ grid }: { grid: GridId }) {
  const [cols, rows] = grid.split(" x ").map(Number);
  return (
    <div
      className="mt-4 grid w-[132px] gap-1.5 rounded-[18px] bg-foreground/[0.06] p-3 ring-1 ring-foreground/10"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span key={i} className="aspect-square rounded-[6px] bg-primary/35" />
      ))}
    </div>
  );
}

function LauncherPrototype() {
  const { time, date } = useClock();
  const [wide, setWide] = useState(true);
  const [locked, setLocked] = useState(false);
  const [settings, setSettings] = useState(false);
  const { prefs, update } = usePrefs();
  const accent = prefs.accent;

  useEffect(() => {
    setLocked(new URLSearchParams(window.location.search).has("lock"));
    const mq = window.matchMedia("(min-width: 700px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <main
      data-theme="octo"
      onClick={() => setSettings(true)}
      className="relative h-screen w-full overflow-hidden bg-background"
      style={
        {
          "--primary": accent,
          "--accent": accent,
          "--glow": accent,
          "--color-primary": accent,
          "--color-accent": accent,
        } as React.CSSProperties
      }
    >
      <GlitchBackdrop
        animated={locked}
        wallpaper={wallUrl(locked ? prefs.lock : prefs.home)}
        seed={wide ? 20260815 : 7311}
        lineCount={wide ? 58 : 46}
        lineLength={wide ? 30 : 12}
        skullOpacity={locked ? 0.2 : 0.34}
      />
      {locked ? <LockContent time={time} date={date} /> : <HomeContent time={time} wide={wide} />}
      {settings ? (
        <SettingsOverlay prefs={prefs} update={update} onClose={() => setSettings(false)} />
      ) : null}
    </main>
  );
}
