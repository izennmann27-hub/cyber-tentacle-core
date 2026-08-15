import { useMemo, useState } from "react";
import {
  TENTACLES,
  TENTACLE_CATEGORIES,
  type TentacleCategory,
  type TentacleDef,
} from "@/lib/tentacles";
import { TentacleWorkspace } from "@/components/tentacle-workspace";

interface TSettings {
  auto: boolean;
  confirm: boolean;
  priority: number;
  limit: number;
}

const DEFAULT_SETTINGS: TSettings = { auto: true, confirm: false, priority: 2, limit: 60 };

export function TentaclesMenu({ onClose }: { onClose: () => void }) {
  const [cat, setCat] = useState<TentacleCategory>("все");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TENTACLES.map((t) => [t.id, t.installed])),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, TSettings>>({});

  const getSettings = (id: string) => settings[id] ?? DEFAULT_SETTINGS;
  const patchSettings = (id: string, p: Partial<TSettings>) =>
    setSettings((prev) => ({ ...prev, [id]: { ...(prev[id] ?? DEFAULT_SETTINGS), ...p } }));

  const list = useMemo(
    () =>
      TENTACLES.filter(
        (t) =>
          (cat === "все" || t.category === cat) &&
          (query.trim() === "" ||
            `${t.name} ${t.model} ${t.role}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [cat, query],
  );

  const active = Object.values(state).filter(Boolean).length;
  const opened = TENTACLES.find((t) => t.id === openId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <button
        type="button"
        aria-label="Закрыть меню щупалец"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {opened && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <TentacleWorkspace
            t={opened}
            on={state[opened.id]}
            onBack={() => setOpenId(null)}
            onOpenSettings={() => {
              setOpenId(null);
              setSettingsId(opened.id);
            }}
          />
        </div>
      )}

      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-primary/30 bg-popover/95">
        <>
        <div className="flex items-center justify-between border-b border-primary/20 px-5 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">
              щупальца
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              микропрограммы · подключено {active} / {TENTACLES.length}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-primary/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            esc
          </button>
        </div>

        <div className="space-y-3 border-b border-primary/15 px-5 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="поиск щупальца…"
            aria-label="Поиск щупальца"
            className="w-full border border-primary/25 bg-background/50 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {TENTACLE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
                  c === cat
                    ? "border-primary/70 bg-primary/10 text-primary"
                    : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 divide-y divide-primary/10 overflow-y-auto">
          {list.map((t) => (
            <Row
              key={t.id}
              t={t}
              on={state[t.id]}
              settingsOpen={settingsId === t.id}
              settings={getSettings(t.id)}
              onPatch={(p) => patchSettings(t.id, p)}
              onToggleSettings={() => setSettingsId(settingsId === t.id ? null : t.id)}
              onOpen={() => setOpenId(t.id)}
              onToggle={() => setState((p) => ({ ...p, [t.id]: !p[t.id] }))}
            />
          ))}
          {list.length === 0 && (
            <div className="px-5 py-8 text-center font-mono text-[11px] text-muted-foreground">
              ничего не найдено
            </div>
          )}
        </div>

        <div className="border-t border-primary/20 px-5 py-3">
          <button
            type="button"
            className="w-full border border-primary/40 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/10"
          >
            + подключить щупальце из сети
          </button>
        </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({
  t,
  on,
  onToggle,
  onOpen,
  settingsOpen,
  onToggleSettings,
  settings,
  onPatch,
}: {
  t: TentacleDef;
  on: boolean;
  onToggle: () => void;
  onOpen: () => void;
  settingsOpen: boolean;
  onToggleSettings: () => void;
  settings: TSettings;
  onPatch: (p: Partial<TSettings>) => void;
}) {
  return (
    <div className="px-5 py-3 transition-colors hover:bg-primary/5">
      <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
      >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center border font-display text-base ${
          on ? "border-primary/60 text-primary" : "border-border/60 text-muted-foreground"
        }`}
      >
        {t.glyph}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-display text-sm uppercase tracking-[0.12em] text-foreground">
            {t.name}
          </span>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">
            {t.size}
          </span>
        </div>
        <div className="font-mono text-[10px] text-primary/70">{t.model}</div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{t.role}</p>
        <span className="mt-1 inline-block font-mono text-[9px] uppercase tracking-[0.28em] text-primary/60">
          открыть окно →
        </span>
      </div>
      </button>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        aria-label={`${on ? "Отключить" : "Подключить"} ${t.name}`}
        className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] transition-colors ${
          on
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
        }`}
      >
        {on ? "● вкл" : "○ выкл"}
      </button>
      <button
        type="button"
        onClick={onToggleSettings}
        aria-expanded={settingsOpen}
        aria-label={`Настройки ${t.name}`}
        className={`grid h-7 w-7 place-items-center border transition-colors ${
          settingsOpen
            ? "border-primary/70 bg-primary/10 text-primary"
            : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
        </svg>
      </button>
      </div>
      </div>

      {settingsOpen && (
        <div className="mt-3 space-y-3 border border-primary/25 bg-background/40 p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.34em] text-primary/70">
            настройки щупальца
          </div>
          <Switch
            label="автозапуск головой"
            on={settings.auto}
            onToggle={() => onPatch({ auto: !settings.auto })}
          />
          <Switch
            label="спрашивать подтверждение"
            on={settings.confirm}
            onToggle={() => onPatch({ confirm: !settings.confirm })}
          />
          <Slider
            label="приоритет"
            value={settings.priority}
            min={1}
            max={5}
            suffix=""
            onChange={(v) => onPatch({ priority: v })}
          />
          <Slider
            label="таймаут"
            value={settings.limit}
            min={10}
            max={300}
            suffix=" с"
            onChange={(v) => onPatch({ limit: v })}
          />
        </div>
      )}
    </div>
  );
}

function Switch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        aria-label={label}
        className={`h-5 w-10 border transition-colors ${
          on ? "border-primary/60 bg-primary/20" : "border-border/60 bg-background/60"
        }`}
      >
        <span
          className={`block h-full w-1/2 transition-transform ${
            on ? "translate-x-full bg-primary" : "bg-muted-foreground/50"
          }`}
        />
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1 w-full appearance-none bg-primary/20 accent-primary"
      />
    </div>
  );
}