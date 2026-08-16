export type TaskStatus =
  | "todo"
  | "in-progress"
  | "awaiting-acceptance"
  | "done"
  | "rejected";

export const STATUS_META: Record<TaskStatus, { label: string; hue: string }> = {
  todo: { label: "в очереди", hue: "text-muted-foreground" },
  "in-progress": { label: "в работе", hue: "text-primary" },
  "awaiting-acceptance": { label: "ждёт приёмки", hue: "text-accent" },
  done: { label: "принято", hue: "text-primary" },
  rejected: { label: "отклонено", hue: "text-destructive" },
};

export const STATUS_ORDER: TaskStatus[] = [
  "todo",
  "in-progress",
  "awaiting-acceptance",
  "done",
  "rejected",
];

export type Priority = "low" | "med" | "high";

export interface Person {
  id: string;
  name: string;
  role?: string;
  department?: string;
  initials: string;
  archived?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  priority: Priority;
  startDate: string;
  dueDate?: string;
  completedAt?: string;
  rejectionReason?: string;
  tags?: string[];
  dealId?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  type: "company" | "ip" | "person";
  industry?: string;
  contact?: string;
  phone?: string;
  notes?: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  isWon?: boolean;
  isLost?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  stageId: string;
  managerId: string;
  amount: number;
  probability: number;
  expectedCloseDate?: string;
  source?: string;
  notes?: string;
  createdAt: string;
}

export interface Direction {
  id: string;
  name: string;
  goal?: string;
  order: number;
}

export interface Role {
  id: string;
  directionId: string;
  title: string;
  personId?: string;
  status: "filled" | "vacancy" | "partial";
  rate?: number;
  salary?: number;
  reportsTo?: string;
  responsibility?: string;
}

export interface TempState {
  teamName: string;
  persons: Person[];
  tasks: Task[];
  clients: Client[];
  stages: Stage[];
  deals: Deal[];
  directions: Direction[];
  roles: Role[];
}

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const today = () => iso(new Date());
export const uid = () => Math.random().toString(36).slice(2, 10);
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

function shift(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return iso(d);
}

export const DEFAULT_STAGES: Stage[] = [
  { id: "s0", name: "Новый лид", order: 0 },
  { id: "s1", name: "Первый контакт", order: 1 },
  { id: "s2", name: "КП отправлено", order: 2 },
  { id: "s3", name: "Презентация", order: 3 },
  { id: "s4", name: "Переговоры", order: 4 },
  { id: "s5", name: "Договор", order: 5 },
  { id: "s6", name: "Оплата", order: 6, isWon: true },
  { id: "s7", name: "Закрыто", order: 7, isLost: true },
];

export function seedState(): TempState {
  const persons: Person[] = [
    { id: "p1", name: "Аня", role: "дизайнер", department: "Дизайн", initials: "А" },
    { id: "p2", name: "Михаил", role: "тимлид", department: "Бэкенд", initials: "М" },
    { id: "p3", name: "Олег", role: "фронтенд", department: "Фронт", initials: "О" },
    { id: "p4", name: "Маша", role: "менеджер", department: "Продажи", initials: "МА" },
  ];

  const tasks: Task[] = [
    {
      id: "t1",
      title: "Лендинг для проекта ЭЗС",
      description: "Одностраничник: hero, блок фич, CTA.",
      assigneeId: "p1",
      status: "in-progress",
      priority: "high",
      startDate: shift(3),
      dueDate: shift(-4),
      tags: ["дизайн", "лендинг"],
      dealId: "d1",
      createdAt: shift(6),
    },
    {
      id: "t2",
      title: "API приёмки телеметрии",
      assigneeId: "p2",
      status: "awaiting-acceptance",
      priority: "med",
      startDate: shift(9),
      completedAt: shift(1),
      tags: ["backend"],
      createdAt: shift(12),
    },
    {
      id: "t3",
      title: "Сборка дашборда станций",
      assigneeId: "p3",
      status: "todo",
      priority: "low",
      startDate: today(),
      tags: ["frontend"],
      createdAt: shift(1),
    },
    {
      id: "t4",
      title: "КП для «Ромашки»",
      assigneeId: "p4",
      status: "done",
      priority: "high",
      startDate: shift(14),
      completedAt: shift(8),
      dealId: "d1",
      createdAt: shift(15),
    },
    {
      id: "t5",
      title: "Гайд по бренд-цветам",
      assigneeId: "p1",
      status: "done",
      priority: "med",
      startDate: shift(30),
      completedAt: shift(24),
      createdAt: shift(32),
    },
    {
      id: "t6",
      title: "Миграция базы на pg16",
      assigneeId: "p2",
      status: "rejected",
      priority: "med",
      startDate: shift(20),
      rejectionReason: "Отложено до релиза",
      createdAt: shift(22),
    },
  ];

  const clients: Client[] = [
    { id: "c1", name: "ООО Ромашка", type: "company", industry: "Розница", contact: "Иван Петров", phone: "+7 900 000-00-01" },
    { id: "c2", name: "ИП Мечта", type: "ip", industry: "Услуги", contact: "Ольга М." },
    { id: "c3", name: "ООО Заря", type: "company", industry: "Производство", contact: "Сергей К." },
  ];

  const deals: Deal[] = [
    { id: "d1", title: "Поставка ЭЗС 500 для Ромашки", clientId: "c1", stageId: "s2", managerId: "p4", amount: 500000, probability: 60, expectedCloseDate: shift(-14), source: "Сайт", createdAt: shift(20) },
    { id: "d2", title: "Сеть станций Мечта", clientId: "c2", stageId: "s1", managerId: "p4", amount: 300000, probability: 40, source: "Звонок", createdAt: shift(9) },
    { id: "d3", title: "Модернизация линии Заря", clientId: "c3", stageId: "s4", managerId: "p2", amount: 800000, probability: 70, source: "Рекомендация", createdAt: shift(30) },
    { id: "d4", title: "Сервисный контракт Ромашка", clientId: "c1", stageId: "s6", managerId: "p4", amount: 1100000, probability: 100, source: "Тендер", createdAt: shift(60) },
  ];

  const directions: Direction[] = [
    { id: "dir1", name: "Сеть ЭЗС", goal: "Прибыльная сеть станций", order: 0 },
    { id: "dir2", name: "Продукт", goal: "Платформа управления", order: 1 },
  ];

  const roles: Role[] = [
    { id: "r1", directionId: "dir1", title: "Лидер направления", personId: "p2", status: "filled", rate: 1, salary: 250, responsibility: "Стратегия сети, P&L" },
    { id: "r2", directionId: "dir1", title: "Менеджер продаж", personId: "p4", status: "filled", rate: 1, salary: 140, reportsTo: "r1", responsibility: "Воронка, сделки" },
    { id: "r3", directionId: "dir1", title: "Инженер монтажа", status: "vacancy", rate: 1, salary: 120, reportsTo: "r1" },
    { id: "r4", directionId: "dir2", title: "Продукт-лид", personId: "p2", status: "partial", rate: 0.5, salary: 120, responsibility: "Роадмап платформы" },
    { id: "r5", directionId: "dir2", title: "Дизайнер", personId: "p1", status: "filled", rate: 1, salary: 130, reportsTo: "r4" },
    { id: "r6", directionId: "dir2", title: "Фронтенд", personId: "p3", status: "filled", rate: 1, salary: 150, reportsTo: "r4" },
  ];

  return { teamName: "Команда «ТЕМП»", persons, tasks, clients, stages: DEFAULT_STAGES, deals, directions, roles };
}

/* ── аналитика ── */

export function heatmapCells(tasks: Task[], personId: string, weeks = 26) {
  const map = new Map<string, { active: number; done: number }>();
  for (const t of tasks) {
    if (t.assigneeId !== personId) continue;
    const a = map.get(t.startDate) ?? { active: 0, done: 0 };
    a.active += 1;
    map.set(t.startDate, a);
    if (t.completedAt) {
      const d = map.get(t.completedAt) ?? { active: 0, done: 0 };
      d.done += 1;
      map.set(t.completedAt, d);
    }
  }
  const end = new Date();
  end.setDate(end.getDate() + (6 - end.getDay()));
  const cells: { date: string; active: number; done: number; future: boolean }[] = [];
  const total = weeks * 7;
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const key = iso(d);
    const v = map.get(key) ?? { active: 0, done: 0 };
    cells.push({ date: key, active: v.active, done: v.done, future: key > today() });
  }
  return cells;
}

export function personStats(tasks: Task[], personId: string) {
  const mine = tasks.filter((t) => t.assigneeId === personId);
  return {
    inProgress: mine.filter((t) => t.status === "in-progress").length,
    awaiting: mine.filter((t) => t.status === "awaiting-acceptance").length,
    done: mine.filter((t) => t.status === "done").length,
    rejected: mine.filter((t) => t.status === "rejected").length,
  };
}

export function pipelineStats(deals: Deal[], stages: Stage[]) {
  return stages.map((stage) => {
    const inStage = deals.filter((d) => d.stageId === stage.id);
    return {
      stage,
      count: inStage.length,
      totalAmount: inStage.reduce((s, d) => s + d.amount, 0),
      weightedAmount: inStage.reduce((s, d) => s + (d.amount * d.probability) / 100, 0),
    };
  });
}

export function orgStats(roles: Role[]) {
  const filled = roles.filter((r) => r.status === "filled").length;
  return {
    totalRoles: roles.length,
    filled,
    vacancy: roles.filter((r) => r.status === "vacancy").length,
    partial: roles.filter((r) => r.status === "partial").length,
    totalFte: roles.reduce((s, r) => s + (r.rate ?? 0), 0),
    totalSalaryK: roles.reduce((s, r) => s + (r.salary ?? 0), 0),
  };
}

export function money(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М ₽`;
  if (n >= 1000) return `${Math.round(n / 1000)}K ₽`;
  return `${n} ₽`;
}