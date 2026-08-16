import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { THEMES, type ThemeSlug } from "@/lib/themes";
import {
  LOCAL_MODELS,
  CLOUD_MODELS,
  REMOTE_MODELS,
  type LocalModel,
  type CloudModel,
  type RemoteModel,
} from "@/lib/models";
import { useTheme } from "@/hooks/use-theme";
import krakenSkull from "@/assets/kraken-skull.png.asset.json";
import { TentaclesMenu } from "@/components/tentacles-menu";
import { TENTACLES } from "@/lib/tentacles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ОСЬМИНОГ - 0 // нейро-терминал" },
      {
        name: "description",
        content:
          "Терминал Осьминога: локальная голова-модель принимает запрос и сама выбирает щупальца-инструменты.",
      },
      { property: "og:title", content: "ОСЬМИНОГ - 0 // нейро-терминал" },
      {
        property: "og:description",
        content: "Одна строка ввода. Локальная нейросеть распределяет задачи по щупальцам.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OctoTerminal,
});

/* Deterministic pseudo-random so SSR and client render identical glitch noise. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const GLYPHS =
  "侬伫供川田人人付侚丁严侢仡佷亭丢丐仞фβηδραωμ↯↺●0123456789ABCDEFxXЖЦЙабвгдеж_-·:/";
const TAGS = [
  "kernel",
  "substr",
  "lance",
  "probe",
  "sync",
  "neural",
  "mesh",
  "auth",
  "субстрат",
  "tentacle",
  "router",
];

function glitchLines(count: number, seed: number) {
  const rnd = seeded(seed);
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    const tag = TAGS[Math.floor(rnd() * TAGS.length)];
    const len = 34 + Math.floor(rnd() * 46);
    let body = "";
    for (let j = 0; j < len; j++) body += GLYPHS[Math.floor(rnd() * GLYPHS.length)];
    lines.push(`[${tag}] ${body}`);
  }
  return lines;
}

function GlitchBackdrop({ thinking = false }: { thinking?: boolean }) {
  const lines = useMemo(() => glitchLines(70, 20260814), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={thinking ? "absolute inset-0 animate-tentacle" : "absolute inset-0"}
        style={{
          backgroundImage: `url(${krakenSkull.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: thinking ? 0.34 : 0.22,
          transition: "opacity 600ms ease",
          filter: "grayscale(1) brightness(0.85) contrast(1.05)",
          maskImage: "radial-gradient(ellipse at 50% 55%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 55%, #000 30%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--primary) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--primary) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px, 56px 56px",
          maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 80%)",
        }}
      />
      <div className="absolute inset-0 animate-streamUp">
        {[0, 1].map((k) => (
          <div key={k} className="px-6">
            {lines.map((l, i) => (
              <div
                key={`${k}-${i}`}
                className="truncate font-mono text-[11px] leading-[1.9] text-primary/20 animate-glitchShift"
                style={{ animationDelay: `${(i % 7) * 0.4}s` }}
              >
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 scanlines" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 68%, transparent 0%, color-mix(in oklab, var(--background) 88%, transparent) 100%)",
        }}
      />
    </div>
  );
}

interface Entry {
  id: number;
  role: "operator" | "head";
  text: string;
}

function OctoTerminal() {
  const [value, setValue] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const [thinking, setThinking] = useState(false);
  const idRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tentaclesOpen, setTentaclesOpen] = useState(false);
  const [tentacleState, setTentacleState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TENTACLES.map((t) => [t.id, t.installed])),
  );
  const [local, setLocal] = useState(() => LOCAL_MODELS.map((m) => ({ ...m })));
  const [cloud, setCloud] = useState(() => CLOUD_MODELS.map((m) => ({ ...m })));
  const [remote, setRemote] = useState(() => REMOTE_MODELS.map((m) => ({ ...m })));
  const { theme, setTheme } = useTheme();

  const connected = Object.values(tentacleState).filter(Boolean).length;
  const cloudOn = cloud.some((m) => m.enabled);
  const remoteOn = remote.some((m) => m.online);
  const link = cloudOn ? "выход в сеть" : remoteOn ? "подключение к серверу" : "режим: автономный";

  useEffect(() => {
    if (!settingsOpen && !tentaclesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setTentaclesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen, tentaclesOpen]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || thinking) return;
    const id = idRef.current++;
    setLog((prev) => [
      ...prev.slice(-4),
      { id, role: "operator", text: q },
    ]);
    setValue("");
    setThinking(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setThinking(false);
      setLog((prev) => [
        ...prev.slice(-4),
        {
          id: id + 1000,
          role: "head",
          text: "голова разобрала запрос · щупальца подобраны · ожидание локального ответа",
        },
      ]);
    }, 2600);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GlitchBackdrop thinking={thinking} />

      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        <header className="flex items-start justify-between px-7 pt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="text-primary/70">ВЕРСИЯ 26</span>
          <span className="text-primary/70">{link}</span>
        </header>

        <section className="flex flex-1 flex-col justify-end px-6 pb-[24vh]">
          <div className="mx-auto w-full max-w-3xl">
            {log.length > 0 && (
              <div className="mb-5 space-y-1.5 font-mono text-[11px]">
                {log.map((e) => (
                  <div
                    key={e.id}
                    className={
                      e.role === "operator"
                        ? "text-foreground/85"
                        : "text-primary/70"
                    }
                  >
                    <span className="mr-2 uppercase tracking-[0.3em] text-muted-foreground">
                      {e.role === "operator" ? "> вы" : "[голова]"}
                    </span>
                    {e.text}
                  </div>
                ))}
              </div>
            )}

            {thinking && (
              <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-primary/80">
                <span className="relative grid h-4 w-4 place-items-center">
                  <span className="absolute h-4 w-4 animate-pulseRing rounded-full bg-primary/40" />
                  <span className="h-4 w-4 animate-spin rounded-full border border-primary/30 border-t-primary" />
                </span>
                <span className="animate-flicker">голова размышляет</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1 w-1 animate-pulseRing rounded-full bg-primary"
                      style={{ animationDelay: `${d * 0.28}s` }}
                    />
                  ))}
                </span>
              </div>
            )}

            {!tentaclesOpen && (
            <form
              onSubmit={submit}
              className="group flex items-center gap-3 border border-primary/30 bg-background/40 px-4 py-3 backdrop-blur-sm transition-colors focus-within:border-primary/70"
            >
              {thinking ? (
                <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-primary/30 border-t-primary" />
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary/60">
                  ▌
                </span>
              )}
              <input
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
                placeholder={thinking ? "голова размышляет…" : "опишите задачу — голова выберет щупальца"}
                aria-label="Запрос к голове"
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="submit"
                disabled={thinking}
                className="shrink-0 border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
              >
                {thinking ? "думает" : "отправить"}
              </button>
            </form>
            )}

            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
              <span>{cloudOn || remoteOn ? "гибридный контур" : "100% локально"}</span>
            </div>
          </div>
        </section>

        <footer className="flex items-end justify-between px-7 pb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <button
            type="button"
            onClick={() => setTentaclesOpen(true)}
            className="uppercase tracking-[0.4em] transition-colors hover:text-primary"
          >
            щупальца: {connected} подключено
          </button>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setTentaclesOpen(true)}
              className="border border-primary/30 px-2 py-1 text-[10px] tracking-[0.3em] text-primary/80 transition-colors hover:border-primary/70 hover:bg-primary/10"
            >
              щупальца
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Настройки"
              className="grid h-8 w-8 place-items-center border border-primary/30 text-primary/80 transition-colors hover:border-primary/70 hover:bg-primary/10"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
              </svg>
            </button>
          </div>
        </footer>
      </div>

      {settingsOpen && (
        <SettingsOverlay
          theme={theme}
          onPick={setTheme}
          local={local}
          setLocal={setLocal}
          cloud={cloud}
          setCloud={setCloud}
          remote={remote}
          setRemote={setRemote}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {tentaclesOpen && (
        <TentaclesMenu
          onClose={() => setTentaclesOpen(false)}
          state={tentacleState}
          onStateChange={setTentacleState}
        />
      )}
    </main>
  );
}

type SettingsTab = "вид" | "локальные" | "облачные" | "сервер";

const SETTINGS_TABS: SettingsTab[] = ["вид", "локальные", "облачные", "сервер"];

function SettingsOverlay({
  theme,
  onPick,
  onClose,
  local,
  setLocal,
  cloud,
  setCloud,
  remote,
  setRemote,
}: {
  theme: ThemeSlug;
  onPick: (slug: ThemeSlug) => void;
  onClose: () => void;
  local: LocalModel[];
  setLocal: React.Dispatch<React.SetStateAction<LocalModel[]>>;
  cloud: CloudModel[];
  setCloud: React.Dispatch<React.SetStateAction<CloudModel[]>>;
  remote: RemoteModel[];
  setRemote: React.Dispatch<React.SetStateAction<RemoteModel[]>>;
}) {
  const [tab, setTab] = useState<SettingsTab>("вид");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть настройки"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[86vh] w-full max-w-3xl flex-col border border-primary/30 bg-popover/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary/20 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">
            настройки · {tab}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="border border-primary/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            esc
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-primary/15 px-5 py-3">
          {SETTINGS_TABS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTab(s)}
              className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
                s === tab
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {tab !== "вид" && (
          <div className="overflow-y-auto p-5">
            <div className="space-y-2">
              {tab === "локальные" &&
                local.map((m) => (
                  <ModelRow
                    key={m.id}
                    title={m.name}
                    meta={`${m.size} · ${m.quant} · локально`}
                    role={m.role}
                    state={m.running ? "запущена" : "остановлена"}
                    stateOn={m.running}
                    action={m.running ? "стоп" : "запуск"}
                    onAction={() =>
                      setLocal((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, running: !x.running } : x)),
                      )
                    }
                  />
                ))}
              {tab === "облачные" &&
                cloud.map((m) => (
                  <ModelRow
                    key={m.id}
                    title={m.name}
                    meta={`${m.vendor} · ключ ${m.keyHint}`}
                    role={m.role}
                    state={m.enabled ? "подключена" : "выключена"}
                    stateOn={m.enabled}
                    action={m.enabled ? "выкл" : "вкл"}
                    onAction={() =>
                      setCloud((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, enabled: !x.enabled } : x)),
                      )
                    }
                  />
                ))}
              {tab === "сервер" &&
                remote.map((m) => (
                  <ModelRow
                    key={m.id}
                    title={m.name}
                    meta={`${m.host} · ${m.gpu}`}
                    role={m.role}
                    state={m.online ? "канал открыт" : "нет связи"}
                    stateOn={m.online}
                    action={m.online ? "отключить" : "подключить"}
                    onAction={() =>
                      setRemote((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, online: !x.online } : x)),
                      )
                    }
                  />
                ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full border border-primary/40 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
            >
              +{" "}
              {tab === "локальные"
                ? "скачать модель локально"
                : tab === "облачные"
                  ? "добавить облачного провайдера"
                  : "добавить удалённый сервер"}
            </button>
          </div>
        )}

        {tab === "вид" && (
        <div className="grid gap-2 overflow-y-auto p-5 sm:grid-cols-2">
          {THEMES.map((t) => {
            const active = t.slug === theme;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => onPick(t.slug)}
                className={`flex flex-col gap-2 border p-3 text-left transition-colors ${
                  active
                    ? "border-primary/70 bg-primary/10"
                    : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm uppercase tracking-[0.14em] text-foreground">
                    {t.name}
                  </span>
                  <span className="flex gap-1">
                    {t.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="h-3 w-3 border border-foreground/20"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{t.tagline}</span>
                <span className="font-mono text-[10px] text-muted-foreground/70">
                  {t.fonts} · {t.shape}
                </span>
                {active && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-primary">
                    активна
                  </span>
                )}
              </button>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

function ModelRow({
  title,
  meta,
  role,
  state,
  stateOn,
  action,
  onAction,
}: {
  title: string;
  meta: string;
  role: string;
  state: string;
  stateOn: boolean;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-start gap-3 border border-primary/20 bg-background/40 p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-sm uppercase tracking-[0.12em] text-foreground">
            {title}
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.28em] ${
              stateOn ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {stateOn ? "●" : "○"} {state}
          </span>
        </div>
        <div className="font-mono text-[10px] text-primary/70">{meta}</div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{role}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className={`shrink-0 border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
          stateOn
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-primary"
        }`}
      >
        {action}
      </button>
    </div>
  );
}
