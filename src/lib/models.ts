export interface LocalModel {
  id: string;
  name: string;
  size: string;
  quant: string;
  role: string;
  running: boolean;
}

export interface CloudModel {
  id: string;
  name: string;
  vendor: string;
  role: string;
  keyHint: string;
  enabled: boolean;
}

export interface RemoteModel {
  id: string;
  name: string;
  host: string;
  gpu: string;
  role: string;
  online: boolean;
}

export const LOCAL_MODELS: LocalModel[] = [
  { id: "l1", name: "голова · qwen2.5:14b", size: "8.9 ГБ", quant: "Q4_K_M", role: "принимает решения, распределяет задачи по щупальцам", running: true },
  { id: "l2", name: "qwen2.5-coder:7b", size: "4.4 ГБ", quant: "Q4_K_M", role: "код и shell-команды", running: false },
  { id: "l3", name: "llava:13b", size: "8.0 ГБ", quant: "Q4_0", role: "зрение: кадры, схемы, скриншоты", running: false },
  { id: "l4", name: "whisper-large-v3", size: "1.6 ГБ", quant: "int8", role: "речь в текст", running: false },
  { id: "l5", name: "nomic-embed-text", size: "0.3 ГБ", quant: "F16", role: "векторная память", running: true },
];

export const CLOUD_MODELS: CloudModel[] = [
  { id: "c1", name: "gpt-5.1", vendor: "openai", role: "тяжёлое рассуждение по запросу головы", keyHint: "sk-··········", enabled: true },
  { id: "c2", name: "claude-sonnet-4.5", vendor: "anthropic", role: "длинный контекст, правки репозиториев", keyHint: "sk-ant-······", enabled: false },
  { id: "c3", name: "gemini-3-pro", vendor: "google", role: "мультимодальный разбор", keyHint: "AIza··········", enabled: false },
];

export const REMOTE_MODELS: RemoteModel[] = [
  { id: "r1", name: "deepseek-v3", host: "10.0.0.14:11434", gpu: "2× RTX 4090", role: "основной удалённый исполнитель", online: true },
  { id: "r2", name: "sdxl-turbo", host: "gpu-node.local:7860", gpu: "RTX 3090", role: "генерация изображений", online: false },
];
