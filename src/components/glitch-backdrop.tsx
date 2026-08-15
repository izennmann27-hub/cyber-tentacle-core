import { useMemo } from "react";
import krakenSkull from "@/assets/kraken-skull.png.asset.json";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const GLYPHS =
  "侬伫供川田人人付侚丁严侢仡佷亭丢丐仞фβηδραωμ↯↺●0123456789ABCDEFxXЖЦЙабвгдеж_-·:/";
const TAGS = ["kernel", "substr", "probe", "sync", "neural", "mesh", "субстрат", "tentacle"];

function glitchLines(count: number, seed: number, len: number) {
  const rnd = seeded(seed);
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    const tag = TAGS[Math.floor(rnd() * TAGS.length)];
    const n = len + Math.floor(rnd() * 20);
    let body = "";
    for (let j = 0; j < n; j++) body += GLYPHS[Math.floor(rnd() * GLYPHS.length)];
    lines.push(`[${tag}] ${body}`);
  }
  return lines;
}

export function GlitchBackdrop({
  seed = 20260815,
  lineCount = 60,
  lineLength = 18,
  skullOpacity = 0.16,
}: {
  seed?: number;
  lineCount?: number;
  lineLength?: number;
  skullOpacity?: number;
}) {
  const lines = useMemo(() => glitchLines(lineCount, seed, lineLength), [lineCount, seed, lineLength]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[70%] w-[110%] -translate-x-1/2 -translate-y-1/2 animate-breathe"
        style={{
          backgroundImage: `url(${krakenSkull.url})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: skullOpacity,
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
          backgroundSize: "40px 40px, 40px 40px",
          maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 82%)",
        }}
      />
      <div className="absolute inset-0 animate-streamUp">
        {[0, 1].map((k) => (
          <div key={k} className="px-3">
            {lines.map((l, i) => (
              <div
                key={`${k}-${i}`}
                className="truncate font-mono text-[9px] leading-[1.9] text-primary/20 animate-glitchShift"
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
            "radial-gradient(70% 60% at 50% 68%, transparent 0%, color-mix(in oklab, var(--background) 86%, transparent) 100%)",
        }}
      />
    </div>
  );
}