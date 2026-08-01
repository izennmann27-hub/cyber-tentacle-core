export type ThemeSlug =
  | "toxic"
  | "magenta"
  | "matrix"
  | "blood"
  | "amber"
  | "ice"
  | "void"
  | "solar"
  | "ghost"
  | "abyss";

export interface ThemeDef {
  slug: ThemeSlug;
  name: string;
  tagline: string;
  fonts: string;
  swatch: string[]; // preview swatches (bg, primary, accent, glow)
}

export const THEMES: ThemeDef[] = [
  { slug: "toxic",   name: "TOXIC KRAKEN",   tagline: "Olive rot // reference protocol", fonts: "Orbitron / JetBrains Mono",       swatch: ["#2b2f14", "#9caf3a", "#e07a3c", "#c8d977"] },
  { slug: "magenta", name: "NEON FLESH",     tagline: "Magenta pulse // synth veins",    fonts: "Michroma / Space Mono",           swatch: ["#1a0a1f", "#ff4fd8", "#42e6ff", "#ff8be6"] },
  { slug: "matrix",  name: "GHOSTWIRE",      tagline: "Matrix green // signal bleed",    fonts: "Share Tech Mono",                 swatch: ["#061a10", "#39ff88", "#4bd7e6", "#7fffb2"] },
  { slug: "blood",   name: "IRONBLOOD",      tagline: "Rust red // industrial cortex",   fonts: "Bebas Neue / IBM Plex Mono",      swatch: ["#170707", "#ff3b3b", "#ffa04b", "#ff7a7a"] },
  { slug: "amber",   name: "AMBER TERMINAL", tagline: "CRT amber // 80s mainframe",      fonts: "VT323",                           swatch: ["#171008", "#ffb43b", "#ff7a2b", "#ffd97a"] },
  { slug: "ice",     name: "CRYO NET",       tagline: "Ice cyan // sub-zero uplink",     fonts: "Chakra Petch / IBM Plex Mono",    swatch: ["#0b1224", "#4ec3ff", "#7ff5ea", "#a9e0ff"] },
  { slug: "void",    name: "VOID HYMN",      tagline: "Purple abyss // deep protocol",   fonts: "Syne / Space Mono",               swatch: ["#0e0723", "#c56bff", "#ff6bd0", "#e39bff"] },
  { slug: "solar",   name: "SOLAR FLARE",    tagline: "Orange burn // plasma routing",   fonts: "Rajdhani / JetBrains Mono",       swatch: ["#1e0f04", "#ff8a2c", "#ffde5c", "#ffb463"] },
  { slug: "ghost",   name: "PORCELAIN",      tagline: "Light mode // clinical shell",    fonts: "Space Grotesk / IBM Plex Mono",   swatch: ["#f4f4f8", "#8a4dff", "#00c2b0", "#b47dff"] },
  { slug: "abyss",   name: "ABYSS TEAL",     tagline: "Deep sea // hydrothermic core",   fonts: "Major Mono Display / Share Tech", swatch: ["#06181c", "#3fdcd0", "#7dff9a", "#8ff2e8"] },
];

export const DEFAULT_THEME: ThemeSlug = "toxic";

export function applyTheme(slug: ThemeSlug) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", slug);
}