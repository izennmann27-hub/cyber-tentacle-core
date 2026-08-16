/**
 * Осьминог-1 · карта точек коннекта (спецификация v1)
 * UI знает только два входа: AgentWorld Router (чат/RAG/tools) и tentacles_api (щупальца).
 */

export interface BackendDef {
  id: string;
  label: string;
  host: string;
  port: number;
  role: string;
}

export const BACKENDS: Record<string, BackendDef> = {
  proxy: {
    id: "proxy",
    label: "Tentacles Proxy",
    host: "127.0.0.1",
    port: 5180,
    role: "единый разъём · routing · fallback · quota",
  },
  router: {
    id: "router",
    label: "AgentWorld Router",
    host: "127.0.0.1",
    port: 5193,
    role: "chat · RAG · tools",
  },
  tentacles: {
    id: "tentacles",
    label: "tentacles_api",
    host: "127.0.0.1",
    port: 5175,
    role: "все 16 щупалец",
  },
  gateway: {
    id: "gateway",
    label: "octopus_gateway",
    host: "127.0.0.1",
    port: 18800,
    role: "legacy entrypoint",
  },
  mlx: {
    id: "mlx",
    label: "llama-server MLX",
    host: "127.0.0.1",
    port: 5177,
    role: "vision / diffusers backend",
  },
  ollama: {
    id: "ollama",
    label: "Ollama",
    host: "127.0.0.1",
    port: 11434,
    role: "qwen3.8:27b · vision models",
  },
};

export const baseUrl = (b: keyof typeof BACKENDS | string) => {
  const def = BACKENDS[b];
  return def ? `http://${def.host}:${def.port}` : "";
};

export interface EndpointDef {
  method: "GET" | "POST" | "DELETE";
  path: string;
  backend: keyof typeof BACKENDS;
  note: string;
  stream?: boolean;
}

/** Полная ссылка точки коннекта. */
export const endpointUrl = (e: EndpointDef) => `${baseUrl(e.backend)}${e.path}`;

/** Контракт SSE-кадра для длинных операций. */
export type StreamFrame =
  | { type: "start"; task_id?: string }
  | { type: "progress"; step: number; total: number }
  | { type: "tokens"; total: number }
  | { type: "result"; data: unknown }
  | { type: "done"; status: "ok" | "error" }
  | { type: "error"; code: string; message: string };

export interface OctoError {
  ok: false;
  code: string;
  message: string;
  status?: number;
}

const timeoutFor = (path: string) =>
  path.includes("/video") || path.includes("/music") ? 300_000 : 90_000;

/** Обычный JSON-вызов точки коннекта. */
export async function callEndpoint<T = unknown>(
  e: EndpointDef,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutFor(e.path));
  try {
    const res = await fetch(endpointUrl(e), {
      method: e.method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw { ok: false, status: res.status, code: errCode(res.status), message: text } as OctoError;
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const errCode = (status: number) =>
  status === 429 ? "rate_limit" : status === 402 ? "quota" : status >= 500 ? "backend" : "request";

/** SSE-стрим точки коннекта: отдаёт кадры контракта по мере поступления. */
export async function streamEndpoint(
  e: EndpointDef,
  body: unknown,
  onFrame: (f: StreamFrame) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(endpointUrl(e), {
    method: e.method,
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    throw {
      ok: false,
      status: res.status,
      code: errCode(res.status),
      message: await res.text().catch(() => ""),
    } as OctoError;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n");
    buf = parts.pop() ?? "";
    for (const line of parts) {
      const raw = line.trim();
      if (!raw.startsWith("data:")) continue;
      const payload = raw.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        onFrame(JSON.parse(payload) as StreamFrame);
      } catch {
        /* игнорируем частичный кадр */
      }
    }
  }
}

/** Проверка живости бэкенда (для индикаторов в UI). */
export async function pingBackend(b: keyof typeof BACKENDS): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl(b)}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
