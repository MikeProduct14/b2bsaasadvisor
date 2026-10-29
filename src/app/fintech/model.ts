import { market } from "./segments";

// Дата последней сверки фактов и оценок карты.
export const SNAPSHOT = "2026-10-29";
export const SNAPSHOT_RU = "29.10.2026";
// Дата публикации страницы /fintech-map/ на сайте, для schema.org.
export const PUBLISHED = "2026-10-29";

export type Confidence = "h" | "m" | "l";
export type Verdict = "open" | "wedge" | "closed";
export type Lens = "w" | "h" | "b" | "m";
export type View = "tiles" | "matrix" | "rank";

export interface Segment {
  id: string;
  /** Полное название */
  n: string;
  /** Короткое название для матрицы и списков */
  s: string;
  d: string;
  /** Перегрев 1–5: 1 — игроков почти нет, 5 — рынок поделён, ценовая война */
  h?: number;
  /** Барьер входа 1–5: 1 — без лицензии и капитала, 5 — лицензия ЦБ, капитал, аккредитация */
  b?: number;
  /** Деньги 1–5: выручка, которую новый игрок реально возьмёт за 2–3 года */
  m?: number;
  /** Регуляторный ветер: 1 — создаёт спрос, 0 — нейтрально, −1 — сжимает рынок */
  w?: -1 | 0 | 1;
  conf?: Confidence;
  money?: string;
  entry?: string;
  players?: string;
  risk?: string;
  reg?: string[];
  cis?: { country: string; text: string }[];
  c?: Segment[];
}

/** Узел карты с вычисленными полями: оценки обязательны, есть родитель. */
export interface ScoredSegment extends Segment {
  h: number;
  b: number;
  m: number;
  w: -1 | 0 | 1;
  conf: Confidence;
  parent: Segment;
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  open: "Открыто",
  wedge: "Нужен клин",
  closed: "Закрыто",
};
export const WIND: Record<string, [string, string]> = {
  "1": ["↑", "попутный"],
  "0": ["→", "нейтральный"],
  "-1": ["↓", "встречный"],
};
export const CONFIDENCE_LABEL: Record<Confidence, string> = { h: "высокая", m: "средняя", l: "низкая" };
export const LENS_LABEL: Record<Lens, string> = { w: "Окно входа", h: "Перегрев", b: "Барьер", m: "Деньги" };

export { market };

const parents = new Map<string, Segment>();
const byId = new Map<string, Segment>();
(function index(node: Segment, parent: Segment | null) {
  byId.set(node.id, node);
  if (parent) parents.set(node.id, parent);
  (node.c ?? []).forEach((child) => index(child, node));
})(market, null);

export const getSegment = (id: string) => byId.get(id);
export const parentOf = (node: Segment) => parents.get(node.id) ?? null;
export const isRoot = (node: Segment) => node === market;

export function descendants(node: Segment): ScoredSegment[] {
  const out: ScoredSegment[] = [];
  (function rec(x: Segment) {
    (x.c ?? []).forEach((child) => {
      out.push(child as ScoredSegment);
      rec(child);
    });
  })(node);
  return out;
}

export const allSegments = descendants(market);

/** Окно входа = Деньги × (12 − Перегрев − Барьер) / 10 + 0,3 × Ветер, в пределах 0–5. */
export function score(n: Segment): number {
  if (n.h == null || n.b == null || n.m == null) return 0;
  const raw = (n.m * (12 - n.h - n.b)) / 10 + 0.3 * (n.w ?? 0);
  return Math.max(0, Math.min(5, Math.round(raw * 10) / 10));
}

export const verdict = (w: number): Verdict => (w >= 2.4 ? "open" : w >= 1.6 ? "wedge" : "closed");

export function lensVerdict(n: ScoredSegment, lens: Lens): Verdict {
  if (lens === "w") return verdict(score(n));
  const v = n[lens];
  if (lens === "m") return v >= 4 ? "open" : v >= 3 ? "wedge" : "closed";
  return v <= 2 ? "open" : v <= 3 ? "wedge" : "closed";
}

export function reason(n: ScoredSegment): string {
  const r: string[] = [];
  if (n.m <= 2) r.push("мало денег");
  if (n.h >= 4) r.push("перегрето");
  if (n.b >= 4) r.push("высокий барьер");
  if (!r.length) {
    if (n.w > 0) r.push("попутная регуляторика");
    else if (n.h <= 2) r.push("мало конкурентов");
    else r.push("баланс рисков");
  }
  return r.slice(0, 2).join(", ");
}

export function pathOf(n: Segment): Segment[] {
  const path: Segment[] = [];
  let x: Segment | null = n;
  while (x) {
    path.unshift(x);
    x = parentOf(x);
  }
  return path;
}

/** Путь без корня и самого узла: «Платежи › Онлайн-эквайринг». */
export const pathText = (n: Segment) =>
  pathOf(n)
    .slice(1, -1)
    .map((x) => x.s || x.n)
    .join(" › ");

export function bestInside(n: Segment): ScoredSegment | null {
  const list = descendants(n);
  if (!list.length) return null;
  return list.reduce((a, b) => (score(b) > score(a) ? b : a));
}

export const byScore = (list: ScoredSegment[]) => [...list].sort((a, b) => score(b) - score(a) || a.h - b.h);

export function countByVerdict(list: ScoredSegment[]): Record<Verdict, number> {
  const count = { open: 0, wedge: 0, closed: 0 };
  list.forEach((n) => count[verdict(score(n))]++);
  return count;
}

export const fmtScore = (x: number) => x.toFixed(1).replace(".", ",");
export const fmtValue = (v: number) => String(v).replace(".", ",");

export function researchPrompt(n: Segment): string {
  const path = pathOf(n)
    .slice(1)
    .map((x) => x.n)
    .join(" › ");
  return `Ты — аналитик финтех-рынка РФ и СНГ. Обнови ветку карты рынка: «${path}».

Текущая оценка (срез ${SNAPSHOT_RU}): перегрев ${fmtValue(n.h ?? 0)}/5, барьер входа ${fmtValue(n.b ?? 0)}/5, деньги ${fmtValue(n.m ?? 0)}/5, регуляторный ветер — ${WIND[String(n.w ?? 0)][1]}.
Что известно сейчас:
${(n.reg ?? []).map((r) => "- " + r).join("\n")}
Игроки: ${n.players ?? "—"}
Гипотеза окна: ${n.entry ?? "—"}

Задача:
1. Найди изменения регуляторики и рынка по этой ветке после ${SNAPSHOT_RU}.
2. Используй только проверяемые источники: cbr.ru, pravo.gov.ru, sozd.duma.gov.ru, nalog.gov.ru, fedsfm.ru, сайты министерств, официальные релизы компаний. СМИ — только как подсказка, факт подтверждай первоисточником.
3. Для каждого изменения дай дату, ссылку на первоисточник, что меняется, на кого влияет и как это сдвигает оценки перегрева, барьера и денег.
4. Отдельно перечисли, что подтвердить не удалось.
5. В конце дай обновлённые оценки 1–5 и одну фразу о том, где сейчас окно для входа.
Пиши сухо, без маркетинга, свои оценки помечай как оценки.`;
}
