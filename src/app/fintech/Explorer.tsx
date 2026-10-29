import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONFIDENCE_LABEL,
  LENS_LABEL,
  SNAPSHOT_RU,
  VERDICT_LABEL,
  WIND,
  allSegments,
  bestInside,
  byScore,
  countByVerdict,
  descendants,
  fmtScore,
  fmtValue,
  getSegment,
  isRoot,
  lensVerdict,
  market,
  parentOf,
  pathOf,
  pathText,
  reason,
  researchPrompt,
  score,
  verdict,
  type Lens,
  type ScoredSegment,
  type Segment,
  type View,
} from "./model";

const LENSES: Lens[] = ["w", "h", "b", "m"];
const VIEWS: { id: View; label: string }[] = [
  { id: "tiles", label: "Плитки" },
  { id: "matrix", label: "Матрица" },
  { id: "rank", label: "Рейтинг" },
];
const STORAGE_KEY = "fintech-map-v02";

const LEGEND: Record<Lens, [string, string, string]> = {
  w: ["≥ 2,4 открыто", "1,6–2,4 нужен клин", "< 1,6 закрыто"],
  h: ["1–2 мало конкурентов", "2,5–3 умеренно", "3,5–5 перегрето"],
  b: ["1–2 без лицензии и капитала", "2,5–3 средний", "3,5–5 лицензия, капитал"],
  m: ["4–5 много денег", "3–3,5 средне", "1–2,5 мало денег"],
};

const scored = (n: Segment) => n as ScoredSegment;

function Dots({ value }: { value: number }) {
  return (
    <span className="fm-dots" role="img" aria-label={`${fmtValue(value)} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={value >= i ? "on" : value >= i - 0.5 ? "half" : undefined} />
      ))}
    </span>
  );
}

function windText(n: ScoredSegment) {
  return WIND[String(n.w)];
}

/** Обновляет #код-сегмента в адресе, не трогая состояние роутера. */
function setHash(id: string | null) {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", id ? `${pathname}${search}#${id}` : `${pathname}${search}`);
}

export function Explorer() {
  const [curId, setCurId] = useState(market.id);
  const [selId, setSelId] = useState(market.id);
  const [lens, setLens] = useState<Lens>("w");
  const [view, setView] = useState<View>("tiles");
  const [deep, setDeep] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptText, setPromptText] = useState<string | null>(null);
  // Прокрутка «к карте» показывает и переключатели над ней.
  const mapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const cur = getSegment(curId) ?? market;
  const sel = getSegment(selId) ?? market;

  const narrow = () => window.matchMedia("(max-width: 1023px)").matches;
  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  // Вид и слой — удобство одного зрителя, поэтому в localStorage.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      if (LENSES.includes(saved.lens)) setLens(saved.lens);
      if (VIEWS.some((v) => v.id === saved.view)) setView(saved.view);
    } catch {
      // Хранилище недоступно: остаются значения по умолчанию.
    }
  }, []);
  const savePrefs = (next: { lens: Lens; view: View }) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Без хранилища выбор просто не запомнится.
    }
  };

  const resetPrompt = () => {
    setPromptText(null);
    setCopied(false);
  };

  const select = (id: string) => {
    const n = getSegment(id);
    if (!n) return;
    setSelId(n.id);
    resetPrompt();
    setHash(isRoot(n) ? null : n.id);
    if (narrow()) panelRef.current?.scrollIntoView({ behavior: behavior(), block: "start" });
  };

  const go = useCallback((id: string, scroll: "if-above" | "always" = "if-above") => {
    const n = getSegment(id);
    if (!n) return;
    const hasKids = Boolean(n.c?.length);
    setCurId(hasKids ? n.id : (parentOf(n) ?? market).id);
    setSelId(n.id);
    setPromptText(null);
    setCopied(false);
    if (!hasKids) setView((v) => (v === "rank" ? "tiles" : v));
    setHash(isRoot(n) ? null : n.id);
    const top = mapRef.current?.getBoundingClientRect().top ?? 0;
    if (scroll === "always" || top < 0) {
      mapRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }
  }, []);

  const show = (id: string) => {
    const n = getSegment(id);
    if (!n) return;
    setCurId((parentOf(n) ?? market).id);
    setSelId(n.id);
    resetPrompt();
    setHash(n.id);
    if (narrow()) panelRef.current?.scrollIntoView({ behavior: behavior(), block: "start" });
  };

  // Ссылка вида /fintech-map/#kyc.crypto открывает сегмент на карте.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && getSegment(id)) go(id, "always");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [go]);

  const chooseLens = (next: Lens) => {
    setLens(next);
    savePrefs({ lens: next, view });
  };
  const chooseView = (next: View) => {
    setView(next);
    savePrefs({ lens, view: next });
  };

  const copyPrompt = (n: Segment) => {
    const text = researchPrompt(n);
    const fallback = () => setPromptText(text);
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }, fallback);
    } catch {
      fallback();
    }
  };

  const children = (cur.c ?? []).map(scored);
  const summaryList = view === "rank" || (view === "matrix" && deep) ? descendants(cur) : children;

  return (
    <div className="fm" ref={mapRef}>
      <div className="fm-toolbar">
        <div className="fm-seg" role="group" aria-label="Вид карты">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => chooseView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="fm-seg" role="group" aria-label="Цвет по">
          <span className="fm-seg-label">Цвет по</span>
          {LENSES.map((l) => (
            <button key={l} type="button" aria-pressed={lens === l} onClick={() => chooseLens(l)}>
              {LENS_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="fm-layout">
        <div className="fm-map">
          <Crumbs cur={cur} go={go} />
          <Summary list={summaryList} select={select} />

          {view === "tiles" && (
            <div className="fm-tiles">
              {children.map((n) => (
                <Tile key={n.id} n={n} lens={lens} selected={sel === n} select={select} go={go} />
              ))}
            </div>
          )}
          {view === "matrix" && (
            <div className="fm-card">
              <div className="fm-matrix-top">
                <span>По горизонтали — перегрев, по вертикали — деньги. Размер точки — барьер входа.</span>
                <label>
                  <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} /> все уровни ниже
                </label>
              </div>
              <div className="fm-scroll-x">
                <Matrix nodes={deep ? descendants(cur) : children} lens={lens} deep={deep} sel={sel} select={select} />
              </div>
            </div>
          )}
          {view === "rank" && <Rank list={byScore(descendants(cur))} sel={sel} select={select} />}

          <div className="fm-legend">
            <span>Цвет: {LENS_LABEL[lens].toLowerCase()}</span>
            {(["open", "wedge", "closed"] as const).map((k, i) => (
              <span key={k} className={`fm-sw fm-${k}`}>
                <i />
                {LEGEND[lens][i]}
              </span>
            ))}
            <span>Ветер: ↑ попутный, → нейтральный, ↓ встречный</span>
          </div>
        </div>

        <aside className="fm-panel" ref={panelRef} aria-live="polite">
          {isRoot(sel) ? (
            <RootPanel show={show} />
          ) : (
            <NodePanel
              n={scored(sel)}
              cur={cur}
              go={go}
              back={() => mapRef.current?.scrollIntoView({ behavior: behavior(), block: "start" })}
              copyPrompt={copyPrompt}
              copied={copied}
              promptText={promptText}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function Crumbs({ cur, go }: { cur: Segment; go: (id: string) => void }) {
  const path = pathOf(cur);
  const parent = parentOf(cur);
  return (
    <nav className="fm-crumbs" aria-label="Уровень карты">
      {path.map((x, i) =>
        i === path.length - 1 ? (
          <span key={x.id} className="here">
            {isRoot(x) ? "Весь рынок" : x.n}
          </span>
        ) : (
          <span key={x.id} className="fm-crumb">
            <button type="button" onClick={() => go(x.id)}>
              {isRoot(x) ? "Весь рынок" : x.n}
            </button>
            <span aria-hidden="true">›</span>
          </span>
        ),
      )}
      {parent && (
        <button type="button" className="up" onClick={() => go(parent.id)}>
          ↑ Уровень выше
        </button>
      )}
    </nav>
  );
}

function Summary({ list, select }: { list: ScoredSegment[]; select: (id: string) => void }) {
  if (!list.length) return null;
  const count = countByVerdict(list);
  const best = list.reduce((a, b) => (score(b) > score(a) ? b : a));
  const hot = list.reduce((a, b) => (b.h > a.h || (b.h === a.h && score(b) < score(a)) ? b : a));
  return (
    <div className="fm-summary">
      {(["open", "wedge", "closed"] as const).map((k) => (
        <span key={k} className={`fm-count fm-${k}`}>
          <b>{count[k]}</b> {VERDICT_LABEL[k].toLowerCase()}
        </span>
      ))}
      <span>
        Лучшее окно:{" "}
        <button type="button" className="fm-link" onClick={() => select(best.id)}>
          {best.s || best.n}
        </button>{" "}
        {fmtScore(score(best))}
      </span>
      <span>
        Самое перегретое:{" "}
        <button type="button" className="fm-link" onClick={() => select(hot.id)}>
          {hot.s || hot.n}
        </button>
      </span>
    </div>
  );
}

function Tile({
  n,
  lens,
  selected,
  select,
  go,
}: {
  n: ScoredSegment;
  lens: Lens;
  selected: boolean;
  select: (id: string) => void;
  go: (id: string) => void;
}) {
  const w = score(n);
  const vc = verdict(w);
  const kids = n.c?.length ?? 0;
  const best = bestInside(n);
  const [arrow, windName] = windText(n);
  const meter = (label: string, value: number, key: Lens) => (
    <div className={`fm-meter${lens === key ? " is-lens" : ""}`}>
      <span>{label}</span>
      <Dots value={value} />
    </div>
  );
  return (
    <div className={`fm-tile fm-${lensVerdict(n, lens)}${selected ? " is-sel" : ""}`}>
      <button type="button" className="fm-tile-name" aria-pressed={selected} onClick={() => select(n.id)}>
        {n.n}
      </button>
      <p className="fm-tile-desc">{n.d}</p>
      <div className="fm-meters">
        {meter("Перегрев", n.h, "h")}
        {meter("Барьер", n.b, "b")}
        {meter("Деньги", n.m, "m")}
      </div>
      <div className="fm-tile-foot">
        <span className={`fm-badge fm-${vc}`}>
          {VERDICT_LABEL[vc]} · {reason(n)}
        </span>
        <span className="fm-wind" title={`Регуляторный ветер: ${windName}`}>
          {arrow}
        </span>
        <span className={`fm-score fm-${vc}`} title="Окно входа, из 5">
          {fmtScore(w)}
        </span>
      </div>
      {best && (
        <div className="fm-tile-best">
          Лучшее внутри: <b>{best.s || best.n}</b> · {fmtScore(score(best))}
        </div>
      )}
      {kids > 0 && (
        <button type="button" className="fm-drill" onClick={() => go(n.id)}>
          Внутрь · {kids} →
        </button>
      )}
    </div>
  );
}

function Matrix({
  nodes,
  lens,
  deep,
  sel,
  select,
}: {
  nodes: ScoredSegment[];
  lens: Lens;
  deep: boolean;
  sel: Segment;
  select: (id: string) => void;
}) {
  const W = 720;
  const H = 470;
  const L = 60;
  const R = 24;
  const T = 18;
  const B = 52;
  const sx = (h: number) => L + ((h - 0.5) / 5) * (W - L - R);
  const sy = (m: number) => T + ((5.5 - m) / 5) * (H - T - B);
  const mx = sx(3);
  const my = sy(3);

  // Сегменты с одинаковыми оценками раскладываем по кругу, чтобы точки не слипались.
  const groups = new Map<string, ScoredSegment[]>();
  nodes.forEach((n) => {
    const key = `${n.h}|${n.m}`;
    groups.set(key, [...(groups.get(key) ?? []), n]);
  });
  const points = nodes.map((n) => {
    const group = groups.get(`${n.h}|${n.m}`)!;
    const i = group.indexOf(n);
    const k = group.length;
    let dx = 0;
    let dy = 0;
    if (k > 1) {
      const angle = (i / k) * Math.PI * 2 - Math.PI / 2;
      const radius = 12 + k * 3;
      dx = Math.cos(angle) * radius;
      dy = Math.sin(angle) * radius;
    }
    return { n, x: sx(n.h) + dx, y: sy(n.m) + dy, dx };
  });

  return (
    <svg className="fm-matrix" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Матрица: перегрев против денег">
      <rect className="q-good" x={L} y={T} width={mx - L} height={my - T} />
      <rect className="q-bad" x={mx} y={my} width={W - R - mx} height={H - B - my} />
      {[1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line className="grid" x1={sx(i)} y1={T} x2={sx(i)} y2={H - B} />
          <text className="axis-t" x={sx(i)} y={H - B + 16} textAnchor="middle">
            {i}
          </text>
          <line className="grid" x1={L} y1={sy(i)} x2={W - R} y2={sy(i)} />
          <text className="axis-t" x={L - 10} y={sy(i) + 4} textAnchor="end">
            {i}
          </text>
        </g>
      ))}
      <text className="axis-l" x={(L + W - R) / 2} y={H - 12} textAnchor="middle">
        ПЕРЕГРЕВ →
      </text>
      <text className="axis-l" transform={`translate(16 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">
        ДЕНЬГИ →
      </text>
      <text className="q-l" x={L + 8} y={T + 16}>
        ОКНО: ДЕНЬГИ ЕСТЬ, ТЕСНО НЕ ОЧЕНЬ
      </text>
      <text className="q-l" x={W - R - 8} y={T + 16} textAnchor="end">
        КРАСНЫЙ ОКЕАН
      </text>
      <text className="q-l" x={L + 8} y={H - B - 8}>
        ТИХИЕ НИШИ
      </text>
      <text className="q-l" x={W - R - 8} y={H - B - 8} textAnchor="end">
        БОЛОТО
      </text>
      {points.map(({ n, x, y, dx }) => {
        const r = 4 + n.b * 1.5;
        const selected = sel === n;
        const showLabel = !deep || selected || verdict(score(n)) === "open";
        const left = dx < -1 || x > W - R - 150;
        return (
          <g
            key={n.id}
            className={`fm-pt fm-${lensVerdict(n, lens)}${selected ? " is-sel" : ""}`}
            tabIndex={0}
            role="button"
            aria-label={`${n.n}: окно ${fmtScore(score(n))}`}
            onClick={() => select(n.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                select(n.id);
              }
            }}
          >
            <title>{`${n.n} · окно ${fmtScore(score(n))}`}</title>
            <circle cx={x} cy={y} r={r} />
            {showLabel && (
              <text x={left ? x - r - 5 : x + r + 5} y={y + 4} textAnchor={left ? "end" : "start"}>
                {n.s || n.n}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Rank({ list, sel, select }: { list: ScoredSegment[]; sel: Segment; select: (id: string) => void }) {
  return (
    <div className="fm-scroll-x">
      <table className="fm-rank">
        <thead>
          <tr>
            <th className="num">#</th>
            <th>Сегмент</th>
            <th className="num">Окно</th>
            <th className="num">Перегрев</th>
            <th className="num">Барьер</th>
            <th className="num">Деньги</th>
            <th className="num">Ветер</th>
            <th>Достоверность</th>
          </tr>
        </thead>
        <tbody>
          {list.map((n, i) => {
            const w = score(n);
            const [arrow, windName] = windText(n);
            return (
              <tr key={n.id} className={sel === n ? "is-sel" : undefined}>
                <td className="num">{i + 1}</td>
                <td>
                  <button type="button" className="nm" onClick={() => select(n.id)}>
                    {n.n}
                  </button>
                  <span className="pth">{pathText(n) || "—"}</span>
                </td>
                <td className="num">
                  <span className={`fm-pill fm-${verdict(w)}`}>{fmtScore(w)}</span>
                </td>
                <td className="num">{fmtValue(n.h)}</td>
                <td className="num">{fmtValue(n.b)}</td>
                <td className="num">{fmtValue(n.m)}</td>
                <td className="num" title={windName}>
                  {arrow}
                </td>
                <td>{CONFIDENCE_LABEL[n.conf]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TopItem({ n, show }: { n: ScoredSegment; show: (id: string) => void }) {
  return (
    <li>
      <button type="button" onClick={() => show(n.id)}>
        {n.n}
        <span className="sub">{pathText(n)}</span>
      </button>
      <span className={`fm-pill fm-${verdict(score(n))}`}>{fmtScore(score(n))}</span>
    </li>
  );
}

function RootPanel({ show }: { show: (id: string) => void }) {
  const top = byScore(allSegments).slice(0, 6);
  const hot = allSegments
    .filter((n) => n.h >= 5)
    .sort((a, b) => b.m - a.m)
    .slice(0, 6);
  return (
    <>
      <div className="fm-p-path">Обзор</div>
      <h3 className="fm-p-title">Весь рынок</h3>
      <p className="fm-p-desc">
        5 доменов, {allSegments.length} сегментов. Оценки сделаны с позиции нового игрока без банковской лицензии. Явных
        голубых океанов нет: почти все открытые окна создаёт новая регуляторика.
      </p>
      <section>
        <h4>Где окна</h4>
        <ol className="fm-toplist">
          {top.map((n) => (
            <TopItem key={n.id} n={n} show={show} />
          ))}
        </ol>
      </section>
      <section>
        <h4>Где перегрето</h4>
        <ol className="fm-toplist">
          {hot.map((n) => (
            <TopItem key={n.id} n={n} show={show} />
          ))}
        </ol>
      </section>
      <section>
        <h4>Как пользоваться</h4>
        <ul>
          <li>Нажмите на плитку, чтобы увидеть разбор сегмента.</li>
          <li>«Внутрь» открывает подсегменты.</li>
          <li>«Цвет по» переключает слой: окно входа, перегрев, барьер, деньги.</li>
          <li>«Матрица» раскладывает сегменты по осям «перегрев × деньги», «Рейтинг» сортирует их по окну входа.</li>
        </ul>
      </section>
    </>
  );
}

function NodePanel({
  n,
  cur,
  go,
  back,
  copyPrompt,
  copied,
  promptText,
}: {
  n: ScoredSegment;
  cur: Segment;
  go: (id: string) => void;
  back: () => void;
  copyPrompt: (n: Segment) => void;
  copied: boolean;
  promptText: string | null;
}) {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    promptRef.current?.focus();
    promptRef.current?.select();
  }, [promptText]);
  const w = score(n);
  const vc = verdict(w);
  const kids = n.c?.length ?? 0;
  const inView = cur === parentOf(n) || cur === n;
  const [arrow, windName] = windText(n);
  const block = (title: string, body?: string) =>
    body ? (
      <section>
        <h4>{title}</h4>
        <p>{body}</p>
      </section>
    ) : null;

  return (
    <>
      <div className="fm-p-top">
        <div>
          <div className="fm-p-path">{pathText(n) || "Домен"}</div>
          <h3 className="fm-p-title">{n.n}</h3>
        </div>
        <button type="button" className="fm-p-back" onClick={back}>
          ↑ К карте
        </button>
      </div>
      <p className="fm-p-desc">{n.d}</p>
      <div className={`fm-verdict fm-${vc}`}>
        <div className="big">
          {fmtScore(w)}
          <small>/5</small>
        </div>
        <div className="vt">{VERDICT_LABEL[vc]}</div>
        <div className="vr">{reason(n)} · окно входа</div>
      </div>
      <dl className="fm-scores">
        <div>
          <dt>Перегрев</dt>
          <dd>{fmtValue(n.h)}/5</dd>
        </div>
        <div>
          <dt>Барьер</dt>
          <dd>{fmtValue(n.b)}/5</dd>
        </div>
        <div>
          <dt>Деньги</dt>
          <dd>{fmtValue(n.m)}/5</dd>
        </div>
        <div>
          <dt>Ветер</dt>
          <dd>
            {arrow} {windName}
          </dd>
        </div>
      </dl>
      {block("Деньги", n.money)}
      {block("Где окно", n.entry)}
      {n.reg?.length ? (
        <section>
          <h4>Регуляторика и факты</h4>
          <ul>
            {n.reg.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {block("Игроки", n.players)}
      {block("Риски", n.risk)}
      {n.cis?.length ? (
        <section>
          <h4>СНГ</h4>
          <ul>
            {n.cis.map((row) => (
              <li key={row.country}>
                <b>{row.country}.</b> {row.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="fm-conf">
        Достоверность оценки: {CONFIDENCE_LABEL[n.conf]} · срез {SNAPSHOT_RU}
      </p>
      <div className="fm-p-actions">
        {kids > 0 && cur !== n && (
          <button type="button" className="fm-btn" onClick={() => go(n.id)}>
            Открыть подсегменты · {kids}
          </button>
        )}
        {!inView && (
          <button type="button" className="fm-btn ghost" onClick={() => go(n.id)}>
            Показать на карте
          </button>
        )}
        <button type="button" className="fm-btn ghost" onClick={() => copyPrompt(n)}>
          {copied ? "Промпт скопирован" : "Промпт для ИИ-ресерча ветки"}
        </button>
      </div>
      {promptText && (
        <>
          <label htmlFor="fm-prompt" className="fm-conf">
            Скопируйте текст вручную:
          </label>
          <textarea id="fm-prompt" className="fm-prompt" readOnly value={promptText} ref={promptRef} />
        </>
      )}
    </>
  );
}
