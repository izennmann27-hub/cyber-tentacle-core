import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { applyTheme } from "@/lib/themes";
import krakenSkull from "@/assets/kraken-skull.png.asset.json";

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

function GlitchBackdrop() {
  const lines = useMemo(() => glitchLines(70, 20260814), []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[min(760px,86vh)] w-[min(1100px,92vw)] -translate-x-1/2 -translate-y-1/2 animate-breathe"
        style={{
          backgroundImage: `url(${krakenSkull.url})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
          filter: "grayscale(1) brightness(0.9)",
          maskImage: "radial-gradient(56% 52% at 50% 48%, #000 40%, transparent 76%)",
          WebkitMaskImage: "radial-gradient(56% 52% at 50% 48%, #000 40%, transparent 76%)",
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
  const idRef = useRef(1);

  useEffect(() => {
    applyTheme("octo");
    if (typeof window !== "undefined") window.localStorage.setItem("kraken.theme", "octo");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    const id = idRef.current++;
    setLog((prev) => [
      ...prev.slice(-4),
      { id, role: "operator", text: q },
      {
        id: id + 1000,
        role: "head",
        text: "голова разбирает запрос · подбираю щупальца · ожидание локального ответа",
      },
    ]);
    setValue("");
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GlitchBackdrop />

      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        <header className="flex items-start justify-between px-7 pt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="text-primary/70">ОСЬМИНОГ - 0</span>
          <span>ВЕРСИЯ 26</span>
        </header>

        <section className="flex flex-1 flex-col justify-end px-6 pb-[24vh]">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="mb-6 text-center font-display text-2xl uppercase text-foreground/90 sm:text-3xl">
              локальная голова готова
            </h1>

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

            <form
              onSubmit={submit}
              className="group flex items-center gap-3 border border-primary/30 bg-background/40 px-4 py-3 backdrop-blur-sm transition-colors focus-within:border-primary/70"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary/60">
                ▌
              </span>
              <input
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
                placeholder="опишите задачу — голова выберет щупальца"
                aria-label="Запрос к голове"
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
              >
                отправить
              </button>
            </form>

            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
              <span>щупальца: 8 подключено</span>
              <span>режим: автономный</span>
              <span>100% локально</span>
            </div>
          </div>
        </section>

        <footer className="flex items-end justify-between px-7 pb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>низкоинтеллектуальные разработки</span>
          <span className="text-primary/70">online</span>
        </footer>
      </div>
    </main>
  );
}
