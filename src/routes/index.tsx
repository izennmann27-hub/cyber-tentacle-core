import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { KrakenHead } from "@/components/kraken-head";
import { TentacleCard, type Tentacle } from "@/components/tentacle-card";
import { MarketplaceCard, type MarketTentacle } from "@/components/marketplace-card";
import { THEMES } from "@/lib/themes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRAKEN // Neural Tentacle Orchestrator" },
      {
        name: "description",
        content:
          "Cyberpunk control deck for a local head-model that dispatches downloadable neural tentacles.",
      },
      { property: "og:title", content: "KRAKEN // Neural Tentacle Orchestrator" },
      {
        property: "og:description",
        content:
          "Local head-model orchestrates downloadable neural tentacles. 10 cyberpunk themes.",
      },
    ],
  }),
  component: Index,
});

const TENTACLES: Tentacle[] = [
  { id: "1", name: "Kraken-Vision",  model: "llava-next-34b",  role: "Мультимодальное зрение и разбор скриншотов",              status: "linked",  load: 74, glyph: "◉" },
  { id: "2", name: "Ink-Sable",      model: "sdxl-turbo",      role: "Генерация изображений и текстур высокого разрешения",     status: "syncing", load: 58, glyph: "✦" },
  { id: "3", name: "Deep-Scribe",    model: "gpt-oss-70b",     role: "Длинный анализ, ресёрч и синтез технических отчётов",     status: "linked",  load: 41, glyph: "✎" },
  { id: "4", name: "Sonar",          model: "whisper-large-v3",role: "Распознавание речи, диаризация и субтитры в реалтайме",   status: "idle",    load: 12, glyph: "♒" },
  { id: "5", name: "Wraith-Coder",   model: "qwen3-coder-32b", role: "Автономный агент для генерации и рефакторинга кода",      status: "linked",  load: 88, glyph: "⌘" },
  { id: "6", name: "Oracle",         model: "embed-mxbai-v2",  role: "Векторные эмбеддинги, семантический поиск, RAG-цепи",     status: "syncing", load: 33, glyph: "⌬" },
  { id: "7", name: "Voxbind",        model: "xtts-v2",         role: "Синтез речи, клонирование голоса, эмоциональный тон",     status: "linked",  load: 26, glyph: "◊" },
  { id: "8", name: "Rift-Broker",    model: "mistral-8x22b",   role: "Локальный оркестратор инструментов и function calling",   status: "offline", load: 0,  glyph: "☍" },
];

const MARKET: MarketTentacle[] = [
  { id: "m1", name: "Necro-Face",       vendor: "cortex.exchange", size: "3.4 GB", rating: 5, price: "12₡",  tag: "vision"  },
  { id: "m2", name: "Splicer",          vendor: "rot.industries",  size: "1.1 GB", rating: 4, price: "free", tag: "codegen" },
  { id: "m3", name: "Astral-Ear",       vendor: "hollowsound.dev", size: "780 MB", rating: 5, price: "8₡",   tag: "audio"   },
  { id: "m4", name: "Chrono-Sight",     vendor: "ninefold.ai",     size: "6.2 GB", rating: 4, price: "24₡",  tag: "video"   },
  { id: "m5", name: "Bone-Cartographer",vendor: "meridian-9",      size: "2.0 GB", rating: 5, price: "16₡",  tag: "geo"     },
  { id: "m6", name: "Glitch-Poet",      vendor: "static.church",   size: "540 MB", rating: 3, price: "free", tag: "text"    },
];

function Index() {
  const { theme, setTheme } = useTheme();
  const active = TENTACLES.filter((t) => t.status !== "offline").length;

  return (
    <main className="cyber-surface relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 cyber-grid animate-drift opacity-40" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm neon-border bg-background font-display text-xl neon-text">
              ⌾
            </div>
            <div>
              <div className="font-display text-lg font-black uppercase tracking-[0.28em]">
                KRAKEN<span className="text-accent">.</span>OS
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                v0.1.7 // node // {theme}
              </div>
            </div>
          </div>
          <nav className="hidden gap-6 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:flex">
            <a className="hover:text-primary" href="#head">head</a>
            <a className="hover:text-primary" href="#tentacles">tentacles</a>
            <a className="hover:text-primary" href="#market">market</a>
            <a className="hover:text-primary" href="#themes">themes</a>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            ▮ {TENTACLES.length} linked ▮ {active} live
          </div>
        </header>

        <section id="head">
          <KrakenHead status="stable" active={active} total={TENTACLES.length} />
        </section>

        <section id="tentacles" className="mt-14">
          <SectionTitle
            eyebrow="// subordinates"
            title="TENTACLES"
            description="Каждое щупальце — отдельная нейросеть, подключённая к голове по локальному каналу."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TENTACLES.map((t) => (
              <TentacleCard key={t.id} t={t} />
            ))}
          </div>
        </section>

        <section id="market" className="mt-14">
          <SectionTitle
            eyebrow="// black market"
            title="TENTACLE FEED"
            description="Скачивай новые щупальца и подключай к голове одним ритуалом."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MARKET.map((m) => (
              <MarketplaceCard key={m.id} item={m} />
            ))}
          </div>
        </section>

        <section id="themes" className="mt-14">
          <SectionTitle
            eyebrow="// skins"
            title="10 CYBER SKINS"
            description={`Активная тема: ${THEMES.find((t) => t.slug === theme)?.name}. Переключай мгновенно.`}
          />
          <div className="mt-6">
            <ThemeSwitcher value={theme} onChange={setTheme} />
          </div>
        </section>

        <footer className="mt-16 border-t border-border/50 pt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          kraken.os // no gods, no admins // signal ok
        </footer>
      </div>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl font-black uppercase tracking-widest neon-text md:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl font-mono text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
