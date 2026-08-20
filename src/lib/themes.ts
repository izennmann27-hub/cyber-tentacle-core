export type ThemeSlug =
  | "nightcity"
  | "macos"
  | "win95"
  | "vscode"
  | "discord"
  | "notion"
  | "dracula"
  | "nord"
  | "ubuntu"
  | "matrix"
  | "octo"
  | "violet";


export interface ThemeDef {
  slug: ThemeSlug;
  name: string;
  tagline: string;
  fonts: string;
  shape: string;
  swatch: string[]; // preview swatches (bg, primary, accent, glow)
}

export const THEMES: ThemeDef[] = [
  { slug: "nightcity", name: "NIGHT CITY",  tagline: "Cyberpunk 2077 HUD // жёлтый глитч",  fonts: "Rajdhani / JetBrains Mono",      shape: "срезанные углы · без радиуса · сильное свечение", swatch: ["#0a0b0d", "#fcee0a", "#00f0ff", "#fcee0a"] },
  { slug: "macos",     name: "AQUA GLASS",  tagline: "macOS Sonoma // матовое стекло",      fonts: "Space Grotesk / IBM Plex Mono",  shape: "радиус 16px · blur 22px · мягкая тень",           swatch: ["#1c1c1e", "#0a84ff", "#30d158", "#0a84ff"] },
  { slug: "win95",     name: "RETRO 95",    tagline: "Windows 95 // серый пластик",         fonts: "VT323 / IBM Plex Mono",          shape: "прямые углы · жёсткая рамка · без свечения",      swatch: ["#008080", "#c0c0c0", "#000080", "#800080"] },
  { slug: "vscode",    name: "CODE DARK+",  tagline: "VS Code // редактор кода",            fonts: "Space Grotesk / JetBrains Mono", shape: "радиус 4px · плоские панели",                     swatch: ["#1e1e1e", "#4fc1ff", "#c586c0", "#007acc"] },
  { slug: "discord",   name: "BLURPLE",     tagline: "Discord // мессенджер",               fonts: "Space Grotesk / IBM Plex Mono",  shape: "радиус 18px · пухлые блоки",                      swatch: ["#1e1f22", "#5865f2", "#23a559", "#5865f2"] },
  { slug: "notion",    name: "PAPER DOC",   tagline: "Notion // светлый документ",          fonts: "Space Grotesk / IBM Plex Mono",  shape: "радиус 6px · тонкие линии · light",               swatch: ["#ffffff", "#37352f", "#d9730d", "#2383e2"] },
  { slug: "dracula",   name: "DRACULA",     tagline: "Dracula // фиолетовый терминал",      fonts: "Syne / JetBrains Mono",          shape: "радиус 10px · неон розовый",                      swatch: ["#282a36", "#bd93f9", "#ff79c6", "#50fa7b"] },
  { slug: "nord",      name: "NORD FROST",  tagline: "Nord // северный минимал",            fonts: "Chakra Petch / IBM Plex Mono",   shape: "радиус 8px · спокойные тени",                     swatch: ["#2e3440", "#88c0d0", "#a3be8c", "#ebcb8b"] },
  { slug: "ubuntu",    name: "UBUNTU TERM", tagline: "GNOME Terminal // баклажан + оранж",  fonts: "Share Tech Mono",                shape: "радиус 6px · скан-линии",                         swatch: ["#300a24", "#e95420", "#77bb41", "#e95420"] },
  { slug: "matrix",    name: "MATRIX CRT",  tagline: "Зелёный фосфор // ЭЛТ-терминал",      fonts: "Major Mono Display / Share Tech",shape: "прямые углы · CRT-скан · max glow",               swatch: ["#000b04", "#00ff62", "#b9ff3d", "#00ff62"] },
  { slug: "octo",      name: "OCTO NET",    tagline: "0ct0d3m0n // сине-фиолетовый глитч",   fonts: "Chakra Petch / IBM Plex Mono",    shape: "тонкие рамки · без радиуса · глитч-полосы",       swatch: ["#0b0d1c", "#8fb4ff", "#6f5cff", "#8fb4ff"] },
];

export const DEFAULT_THEME: ThemeSlug = "octo";

export function applyTheme(slug: ThemeSlug) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", slug);
}
