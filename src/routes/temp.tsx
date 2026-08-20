import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heatmap, HeatmapLegend } from "@/components/temp/heatmap";
import { useTempStore } from "@/lib/temp-store";
import {
  STATUS_META,
  STATUS_ORDER,
  initialsOf,
  money,
  orgStats,
  personStats,
  pipelineStats,
  today,
  uid,
  type Deal,
  type Task,
  type TaskStatus,
} from "@/lib/temp-data";
import krakenSkull from "@/assets/kraken-skull.png.asset.json";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { THEMES, type ThemeSlug } from "@/lib/themes";

export const Route = createFileRoute("/temp")({
  head: () => ({
    meta: [
      { title: "ТЕМП // модуль управления командой" },
      {
        name: "description",
        content:
          "ТЕМП — трекер задач, heatmap продуктивности, лёгкий CRM и оргсхема для команды 2–20 человек в интерфейсе Осьминога.",
      },
      { property: "og:title", content: "ТЕМП // модуль управления командой" },
      {
        property: "og:description",
        content: "Задачи, тепловые карты активности, воронка сделок и оргсхема — в одном киберпанк-модуле.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TempModule,
});

const TABS = ["задачи", "люди", "crm", "оргсхема", "команда"] as const;
type Tab = (typeof TABS)[number];

function TempModule() {
  const { state, setState, reset } = useTempStore();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("задачи");
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [openDeal, setOpenDeal] = useState<Deal | null>(null);

  const personById = useMemo(
    () => Object.fromEntries(state.persons.map((p) => [p.id, p])),
    [state.persons],
  );

  const patchTask = (id: string, patch: Partial<Task>) =>
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const patchDeal = (id: string, patch: Partial<Deal>) =>
    setState((s) => ({ ...s, deals: s.deals.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `url(${krakenSkull.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
          filter: "grayscale(1)",
          maskImage: "radial-gradient(ellipse at 50% 40%, #000 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 20%, transparent 80%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition hover:text-primary"
          >
            ← осьминог
          </Link>
          <h1 className="font-display text-lg font-black uppercase tracking-[0.2em]">
            <span className="neon-text">ТЕМП</span>
            <span className="ml-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              модуль управления
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {state.teamName} · {state.persons.length} чел · {state.tasks.length} задач
          </div>
          <select
            aria-label="Тема"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeSlug)}
            className="border border-border/60 bg-card/45 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] outline-none backdrop-blur-md"
          >
            {THEMES.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

      </header>

      <nav className="relative z-10 flex gap-1 overflow-x-auto border-b border-border/40 px-4 md:px-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "glitch-clip px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] transition",
              tab === t
                ? "bg-primary/15 text-primary neon-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="relative z-10 px-4 py-6 md:px-8">
        {tab === "задачи" && (
          <TasksBoard
            state={state}
            onOpen={setOpenTask}
            onMove={(id, status) =>
              patchTask(id, {
                status,
                completedAt: status === "done" ? today() : undefined,
              })
            }
            onCreate={(title, assigneeId) =>
              setState((s) => ({
                ...s,
                tasks: [
                  {
                    id: uid(),
                    title,
                    assigneeId,
                    status: "todo",
                    priority: "med",
                    startDate: today(),
                    createdAt: today(),
                  },
                  ...s.tasks,
                ],
              }))
            }
          />
        )}

        {tab === "люди" && <PeopleBoard state={state} />}

        {tab === "crm" && (
          <CrmBoard
            state={state}
            onOpen={setOpenDeal}
            onMove={(id, stageId) => patchDeal(id, { stageId })}
          />
        )}

        {tab === "оргсхема" && <OrgBoard state={state} />}

        {tab === "команда" && (
          <TeamSettings
            state={state}
            onAdd={(name, role) =>
              setState((s) => ({
                ...s,
                persons: [...s.persons, { id: uid(), name, role, initials: initialsOf(name) }],
              }))
            }
            onRemove={(id) =>
              setState((s) => ({ ...s, persons: s.persons.filter((p) => p.id !== id) }))
            }
            onRename={(teamName) => setState((s) => ({ ...s, teamName }))}
            onReset={reset}
          />
        )}
      </main>

      {openTask && (
        <TaskModal
          task={state.tasks.find((t) => t.id === openTask.id) ?? openTask}
          personName={personById[openTask.assigneeId]?.name ?? "не назначен"}
          dealTitle={state.deals.find((d) => d.id === openTask.dealId)?.title}
          onClose={() => setOpenTask(null)}
          onStatus={(status) =>
            patchTask(openTask.id, {
              status,
              completedAt: status === "done" ? today() : undefined,
            })
          }
          onDelete={() => {
            setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== openTask.id) }));
            setOpenTask(null);
          }}
        />
      )}

      {openDeal && (
        <DealModal
          deal={state.deals.find((d) => d.id === openDeal.id) ?? openDeal}
          clientName={state.clients.find((c) => c.id === openDeal.clientId)?.name ?? "—"}
          managerName={personById[openDeal.managerId]?.name ?? "—"}
          stageName={state.stages.find((s) => s.id === openDeal.stageId)?.name ?? "—"}
          relatedTasks={state.tasks.filter((t) => t.dealId === openDeal.id)}
          onProbability={(probability) => patchDeal(openDeal.id, { probability })}
          onClose={() => setOpenDeal(null)}
        />
      )}
    </div>
  );
}

/* ── Задачи ── */

function TasksBoard({
  state,
  onOpen,
  onMove,
  onCreate,
}: {
  state: ReturnType<typeof useTempStore>["state"];
  onOpen: (t: Task) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onCreate: (title: string, assigneeId: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState(state.persons[0]?.id ?? "");

  const tasks = state.tasks.filter((t) => filter === "all" || t.assigneeId === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          все
        </FilterChip>
        {state.persons.map((p) => (
          <FilterChip key={p.id} active={filter === p.id} onClick={() => setFilter(p.id)}>
            {p.name}
          </FilterChip>
        ))}
      </div>

      <form
        className="panel flex flex-wrap items-center gap-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !assignee) return;
          onCreate(title.trim(), assignee);
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="новая задача…"
          className="min-w-[200px] flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
        />
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="border border-border/60 bg-card/45 backdrop-blur-md px-2 py-1 font-mono text-[11px]"
        >
          {state.persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="glitch-clip neon-border bg-primary/90 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary-foreground">
          + добавить
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {STATUS_ORDER.map((status) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/task");
                if (id) onMove(id, status);
              }}
              className="panel min-h-[220px] p-3"
            >
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
                <span className={STATUS_META[status].hue}>{STATUS_META[status].label}</span>
                <span className="text-muted-foreground">{col.length}</span>
              </div>
              <div className="space-y-2">
                {col.map((t) => (
                  <article
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/task", t.id)}
                    onClick={() => onOpen(t)}
                    className="cursor-pointer border border-border/60 bg-card/45 backdrop-blur-md p-2 transition hover:border-primary/60"
                  >
                    <div className="font-mono text-xs leading-snug">{t.title}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="text-primary">
                        {state.persons.find((p) => p.id === t.assigneeId)?.name ?? "—"}
                      </span>
                      <span
                        className={cn(
                          t.priority === "high" && "text-destructive",
                          t.priority === "med" && "text-accent",
                        )}
                      >
                        {t.priority}
                      </span>
                      {t.dueDate && <span>до {t.dueDate.slice(5)}</span>}
                      {t.dealId && <span className="text-accent">сделка</span>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Люди ── */

function PeopleBoard({ state }: { state: ReturnType<typeof useTempStore>["state"] }) {
  return (
    <div className="space-y-3">
      <HeatmapLegend />
      {state.persons.map((p) => {
        const st = personStats(state.tasks, p.id);
        return (
          <section key={p.id} className="panel p-4">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-primary/50 bg-primary/10 font-display text-sm font-bold text-primary">
                {p.initials}
              </span>
              <div>
                <div className="font-display text-sm font-bold uppercase tracking-[0.18em]">{p.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {p.role ?? "—"} {p.department ? `· ${p.department}` : ""}
                </div>
              </div>
              <div className="ml-auto grid grid-cols-4 gap-2 font-mono text-[10px] uppercase">
                <Stat label="в работе" value={st.inProgress} />
                <Stat label="ждёт" value={st.awaiting} />
                <Stat label="принято" value={st.done} />
                <Stat label="откл." value={st.rejected} />
              </div>
            </div>
            <Heatmap tasks={state.tasks} personId={p.id} />
          </section>
        );
      })}
    </div>
  );
}

/* ── CRM ── */

function CrmBoard({
  state,
  onOpen,
  onMove,
}: {
  state: ReturnType<typeof useTempStore>["state"];
  onOpen: (d: Deal) => void;
  onMove: (id: string, stageId: string) => void;
}) {
  const stats = pipelineStats(state.deals, state.stages);
  const won = state.stages.find((s) => s.isWon);
  const wonSum = state.deals.filter((d) => d.stageId === won?.id).reduce((s, d) => s + d.amount, 0);
  const inWork = state.deals
    .filter((d) => d.stageId !== won?.id && !state.stages.find((s) => s.id === d.stageId)?.isLost)
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-4">
      <div className="panel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        сводка: {state.deals.length} сделок · <span className="text-accent">{money(inWork)}</span> в работе ·{" "}
        <span className="text-primary">{money(wonSum)}</span> won
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {stats.map(({ stage, count, totalAmount, weightedAmount }) => (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/deal");
              if (id) onMove(id, stage.id);
            }}
            className="panel min-h-[240px] w-[230px] shrink-0 p-3"
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {stage.name}
            </div>
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {count} · {money(totalAmount)} · вес {money(Math.round(weightedAmount))}
            </div>
            <div className="space-y-2">
              {state.deals
                .filter((d) => d.stageId === stage.id)
                .map((d) => (
                  <article
                    key={d.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/deal", d.id)}
                    onClick={() => onOpen(d)}
                    className="cursor-pointer border border-border/60 bg-card/45 backdrop-blur-md p-2 transition hover:border-primary/60"
                  >
                    <div className="font-mono text-xs leading-snug">{d.title}</div>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="text-primary">{money(d.amount)}</span> · {d.probability}% ·{" "}
                      {state.persons.find((p) => p.id === d.managerId)?.name ?? "—"}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>

      <section className="panel p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          клиенты
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {state.clients.map((c) => (
            <div key={c.id} className="border border-border/60 bg-card/45 backdrop-blur-md p-3">
              <div className="font-display text-sm font-bold">{c.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {c.industry ?? "—"} · {c.contact ?? "без контакта"}
              </div>
              <div className="mt-2 font-mono text-[10px] text-primary">
                {state.deals.filter((d) => d.clientId === c.id).length} сделок
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Оргсхема ── */

function OrgBoard({ state }: { state: ReturnType<typeof useTempStore>["state"] }) {
  const st = orgStats(state.roles);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <Stat label="роли" value={st.totalRoles} />
        <Stat label="занято" value={st.filled} />
        <Stat label="вакансии" value={st.vacancy} />
        <Stat label="частично" value={st.partial} />
        <Stat label="ставки" value={st.totalFte} />
        <Stat label="фот, т₽" value={st.totalSalaryK} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {state.directions.map((dir) => {
          const roles = state.roles.filter((r) => r.directionId === dir.id);
          const roots = roles.filter((r) => !r.reportsTo);
          const renderRole = (roleId: string, depth: number): React.ReactNode => {
            const role = roles.find((r) => r.id === roleId)!;
            const person = state.persons.find((p) => p.id === role.personId);
            const kids = roles.filter((r) => r.reportsTo === role.id);
            return (
              <div key={role.id} style={{ marginLeft: depth * 16 }} className="space-y-2">
                <div
                  className={cn(
                    "border bg-card/45 backdrop-blur-md p-2",
                    role.status === "vacancy"
                      ? "border-dashed border-destructive/60"
                      : "border-border/60",
                  )}
                  title={role.responsibility}
                >
                  <div className="font-mono text-xs text-primary">{role.title}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    {person ? person.name : "вакансия"} · ставка {role.rate ?? 0} ·{" "}
                    {role.salary ? `${role.salary} т₽` : "—"}
                  </div>
                </div>
                {kids.map((k) => renderRole(k.id, depth + 1))}
              </div>
            );
          };
          return (
            <section key={dir.id} className="panel p-4">
              <div className="mb-1 font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
                {dir.name}
              </div>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {dir.goal ?? "—"}
              </div>
              <div className="space-y-2">{roots.map((r) => renderRole(r.id, 0))}</div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ── Команда ── */

function TeamSettings({
  state,
  onAdd,
  onRemove,
  onRename,
  onReset,
}: {
  state: ReturnType<typeof useTempStore>["state"];
  onAdd: (name: string, role: string) => void;
  onRemove: (id: string) => void;
  onRename: (name: string) => void;
  onReset: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "temp-team.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <section className="panel p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          команда
        </div>
        <input
          value={state.teamName}
          onChange={(e) => onRename(e.target.value)}
          className="w-full border border-border/60 bg-card/45 backdrop-blur-md px-3 py-2 font-mono text-sm outline-none focus:border-primary/60"
        />
        <div className="mt-4 space-y-2">
          {state.persons.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border border-border/50 bg-card/45 backdrop-blur-md px-3 py-2">
              <span className="font-mono text-xs text-primary">{p.initials}</span>
              <span className="font-mono text-xs">{p.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {p.role ?? "—"}
              </span>
              <button
                onClick={() => onRemove(p.id)}
                className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-destructive hover:underline"
              >
                удалить
              </button>
            </div>
          ))}
        </div>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onAdd(name.trim(), role.trim());
            setName("");
            setRole("");
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="имя"
            className="flex-1 border border-border/60 bg-card/45 backdrop-blur-md px-3 py-2 font-mono text-xs outline-none"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="роль"
            className="flex-1 border border-border/60 bg-card/45 backdrop-blur-md px-3 py-2 font-mono text-xs outline-none"
          />
          <button className="glitch-clip neon-border bg-primary/90 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary-foreground">
            + участник
          </button>
        </form>
      </section>

      <section className="panel p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          данные
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          MVP хранит всё локально в браузере (localStorage). Синхронизация с облаком — фаза 2.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={exportJson}
            className="border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-accent"
          >
            экспорт json
          </button>
          <button
            onClick={onReset}
            className="border border-destructive/60 bg-destructive/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-destructive"
          >
            сбросить демо-данные
          </button>
        </div>
      </section>
    </div>
  );
}

/* ── модалки и мелочи ── */

function TaskModal({
  task,
  personName,
  dealTitle,
  onClose,
  onStatus,
  onDelete,
}: {
  task: Task;
  personName: string;
  dealTitle?: string;
  onClose: () => void;
  onStatus: (s: TaskStatus) => void;
  onDelete: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.26em]">
        <span className={STATUS_META[task.status].hue}>
          ● {STATUS_META[task.status].label} · {task.priority}
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
      <h2 className="font-display text-xl font-bold">{task.title}</h2>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {personName} · старт {task.startDate}
        {task.dueDate ? ` · до ${task.dueDate}` : ""}
        {dealTitle ? ` · сделка «${dealTitle}»` : ""}
      </div>
      {task.description && (
        <p className="mt-4 font-mono text-sm text-muted-foreground">{task.description}</p>
      )}
      {task.rejectionReason && (
        <p className="mt-4 font-mono text-xs text-destructive">причина: {task.rejectionReason}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => onStatus(s)}
            className={cn(
              "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition",
              task.status === s
                ? "border-primary/70 bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {STATUS_META[s].label}
          </button>
        ))}
        <button
          onClick={onDelete}
          className="ml-auto border border-destructive/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-destructive"
        >
          удалить
        </button>
      </div>
    </Overlay>
  );
}

function DealModal({
  deal,
  clientName,
  managerName,
  stageName,
  relatedTasks,
  onProbability,
  onClose,
}: {
  deal: Deal;
  clientName: string;
  managerName: string;
  stageName: string;
  relatedTasks: Task[];
  onProbability: (p: number) => void;
  onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-primary">
        <span>● {stageName}</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
      <h2 className="font-display text-xl font-bold">{deal.title}</h2>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {clientName} · менеджер {managerName} · {money(deal.amount)} · источник {deal.source ?? "—"}
      </div>
      <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        вероятность: <span className="text-primary">{deal.probability}%</span> · взвешенно{" "}
        {money(Math.round((deal.amount * deal.probability) / 100))}
      </label>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={deal.probability}
        onChange={(e) => onProbability(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--primary)]"
      />
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        связанные задачи ({relatedTasks.length})
      </div>
      <div className="mt-2 space-y-1">
        {relatedTasks.map((t) => (
          <div key={t.id} className="border border-border/50 bg-card/45 backdrop-blur-md px-3 py-2 font-mono text-xs">
            {t.title}{" "}
            <span className="text-muted-foreground">· {STATUS_META[t.status].label}</span>
          </div>
        ))}
        {relatedTasks.length === 0 && (
          <div className="font-mono text-xs text-muted-foreground">нет связанных задач</div>
        )}
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel glitch-clip max-h-[85vh] w-full max-w-xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-border/50 bg-card/45 backdrop-blur-md px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-bold text-primary">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition",
        active ? "border-primary/70 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}