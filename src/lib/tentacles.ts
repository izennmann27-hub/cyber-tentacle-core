export interface TentacleDef {
  id: string;
  glyph: string;
  name: string;
  model: string;
  role: string;
  size: string;
  category: "система" | "код" | "медиа" | "сеть" | "данные";
  installed: boolean;
}

export const TENTACLE_CATEGORIES = ["все", "система", "код", "медиа", "сеть", "данные"] as const;
export type TentacleCategory = (typeof TENTACLE_CATEGORIES)[number];

export const TENTACLES: TentacleDef[] = [
  {
    id: "shell",
    glyph: "⌘",
    name: "shell-щупальце",
    model: "qwen2.5-coder:7b",
    role: "исполняет команды в локальной оболочке, читает вывод",
    size: "4.4 ГБ",
    category: "система",
    installed: true,
  },
  {
    id: "swe",
    glyph: "⟠",
    name: "swe-щупальце",
    model: "deepseek-coder:6.7b",
    role: "правит репозитории, пишет патчи и тесты",
    size: "3.8 ГБ",
    category: "код",
    installed: true,
  },
  {
    id: "web",
    glyph: "◈",
    name: "web-щупальце",
    model: "playwright + llava",
    role: "открывает страницы, кликает, снимает DOM и скриншоты",
    size: "1.2 ГБ",
    category: "сеть",
    installed: true,
  },
  {
    id: "vision",
    glyph: "◉",
    name: "vision-щупальце",
    model: "llava:13b",
    role: "разбирает изображения, схемы и скриншоты",
    size: "8.0 ГБ",
    category: "медиа",
    installed: true,
  },
  {
    id: "voice",
    glyph: "≋",
    name: "voice-щупальце",
    model: "whisper-large-v3",
    role: "распознаёт речь и диктует ответы головы",
    size: "1.6 ГБ",
    category: "медиа",
    installed: false,
  },
  {
    id: "rag",
    glyph: "▤",
    name: "память-щупальце",
    model: "nomic-embed-text",
    role: "индексирует локальные документы, отдаёт контекст голове",
    size: "0.3 ГБ",
    category: "данные",
    installed: true,
  },
  {
    id: "sql",
    glyph: "⊞",
    name: "sql-щупальце",
    model: "sqlcoder:7b",
    role: "строит и выполняет запросы к локальным базам",
    size: "4.1 ГБ",
    category: "данные",
    installed: false,
  },
  {
    id: "image",
    glyph: "✳",
    name: "рендер-щупальце",
    model: "sdxl-turbo",
    role: "генерирует изображения по заданию головы",
    size: "6.9 ГБ",
    category: "медиа",
    installed: false,
  },
  {
    id: "net",
    glyph: "⇄",
    name: "скан-щупальце",
    model: "nmap-bridge",
    role: "смотрит локальную сеть, порты и сервисы",
    size: "0.1 ГБ",
    category: "сеть",
    installed: false,
  },
  {
    id: "files",
    glyph: "▦",
    name: "файл-щупальце",
    model: "native-fs",
    role: "ищет, читает и переносит файлы на машине",
    size: "0.0 ГБ",
    category: "система",
    installed: true,
  },
];