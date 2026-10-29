import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import { useModal } from "../context/ModalContext";
import { formatDate, postPath } from "../blog/posts";
import {
  MAP_CHECKED_AT,
  MAP_GUIDE_SLUG,
  criteria,
  depthOf,
  mapSources,
  mapTree,
  nodeById,
  parentOf,
  type CriterionKey,
  type MapNode,
} from "../aiPlatformMap";

const NARROW_QUERY = "(max-width: 1099px)";

const REQUEST_FLOW = [
  "Сотрудник",
  "Интерфейс + SSO",
  "DLP-проверка",
  "Шлюз: лимиты, маршрут",
  "Локальная или облачная модель",
];
const AGENT_FLOW = ["Агент", "MCP-сервер с OAuth сотрудника", "1С или CRM проверяет права"];

// Branches start collapsed except the platform layers, so the first screen shows the stack.
function defaultCollapsed(): Set<string> {
  return new Set(
    Object.keys(nodeById).filter(
      (id) => depthOf[id] >= 1 && id !== "layers" && nodeById[id].children?.length,
    ),
  );
}

function score(node: MapNode, key: CriterionKey): number | null {
  if (node.scores) return node.scores[criteria.findIndex((c) => c.key === key)];
  if (node.strengths?.includes(key)) return 3;
  return null;
}

function kickerFor(node: MapNode): string {
  if (node.kicker) return node.kicker;
  const depth = depthOf[node.id];
  if (depth === 1) return "Ветка карты";
  const parent = nodeById[parentOf[node.id] ?? ""];
  if (depth === 2) return parent.title;
  if (depth === 3) return `Инструмент · ${parent.title}`;
  return "";
}

function isNarrow(): boolean {
  return window.matchMedia(NARROW_QUERY).matches;
}

function Meter({ value }: { value: number }) {
  return (
    <span className="aimap-meter" data-s={value} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Flow({ items }: { items: string[] }) {
  return (
    <div className="aimap-flow">
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && <b aria-hidden="true">→</b>}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}

interface TreeProps {
  node: MapNode;
  collapsed: Set<string>;
  selected: string;
  crit: CriterionKey | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

function TreeNode({ node, collapsed, selected, crit, onSelect, onToggle }: TreeProps) {
  const depth = depthOf[node.id];
  const children = node.children ?? [];
  const isCollapsed = collapsed.has(node.id);
  const value = crit ? score(node, crit) : null;
  const classes = ["aimap-node"];
  if (node.index) classes.push("is-layer");
  if (selected === node.id) classes.push("is-sel");
  if (crit && depth > 1) {
    if (value === 3) classes.push("is-hl");
    else if (value === 1) classes.push("is-lo");
    else if (value === null) classes.push("is-mute");
  }

  return (
    <div className={`aimap-nw aimap-d${depth}${isCollapsed ? " is-collapsed" : ""}`}>
      <div className="aimap-row">
        <button
          type="button"
          id={`n-${node.id}`}
          className={classes.join(" ")}
          aria-current={selected === node.id ? "true" : undefined}
          onClick={() => onSelect(node.id)}
        >
          {node.index && <span className="aimap-idx">{node.index}</span>}
          <span className="aimap-lbl">{node.title}</span>
          {node.scores && value !== null && <Meter value={value} />}
        </button>
        {children.length > 0 && depth > 0 && (
          <button
            type="button"
            className="aimap-tog"
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? "Развернуть" : "Свернуть"}: ${node.title}`}
            onClick={() => onToggle(node.id)}
          >
            {isCollapsed ? `+${children.length}` : "−"}
          </button>
        )}
      </div>
      {children.length > 0 && (
        <div className="aimap-kids" role="group">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              collapsed={collapsed}
              selected={selected}
              crit={crit}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RelatedChips({ ids, onSelect }: { ids: string[]; onSelect: (id: string) => void }) {
  return (
    <div className="aimap-rels">
      {ids
        .filter((id) => nodeById[id])
        .map((id) => (
          <button key={id} type="button" className="aimap-rel" onClick={() => onSelect(id)}>
            {nodeById[id].title}
          </button>
        ))}
    </div>
  );
}

interface PanelProps {
  id: string;
  crit: CriterionKey | null;
  open: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function DetailPanel({ id, crit, open, onSelect, onClose }: PanelProps) {
  const node = nodeById[id];
  const children = node.children ?? [];

  return (
    <aside
      className={`aimap-panel${open ? " is-open" : ""}`}
      aria-live="polite"
      aria-labelledby="aimap-panel-title"
    >
      <div className="aimap-panel-head">
        <div>
          <div className="aimap-kicker">{kickerFor(node)}</div>
          <h2 id="aimap-panel-title">{node.title}</h2>
        </div>
        <button type="button" className="aimap-close" aria-label="Закрыть описание" onClick={onClose}>
          ×
        </button>
      </div>
      {node.license && <span className="aimap-lic">{node.license}</span>}
      {node.summary && <p className="aimap-sum">{node.summary}</p>}

      {node.scores && (
        <div className="aimap-crit">
          {criteria.map((c, i) => (
            <div key={c.key} className="aimap-crit-row">
              <span style={{ fontWeight: crit === c.key ? 600 : 400 }}>{c.label}</span>
              <Meter value={node.scores![i]} />
            </div>
          ))}
          <div className="aimap-crit-note">Экспертная оценка 1–3 для сравнения внутри слоя</div>
        </div>
      )}

      {node.flow && (
        <>
          <div className="aimap-sec">
            <h3>Путь запроса сотрудника</h3>
            <Flow items={REQUEST_FLOW} />
          </div>
          <div className="aimap-sec">
            <h3>Путь задачи агента</h3>
            <Flow items={AGENT_FLOW} />
          </div>
        </>
      )}

      {node.sections?.map((section) => (
        <div key={section.title} className="aimap-sec">
          <h3>{section.title}</h3>
          {section.text && <p>{section.text}</p>}
          {section.items && (
            <ul className="aimap-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {children.length > 0 && (
        <div className="aimap-sec">
          <h3>{depthOf[id] === 2 ? "Инструменты" : "Внутри"}</h3>
          <RelatedChips ids={children.map((c) => c.id)} onSelect={onSelect} />
        </div>
      )}

      {node.related && node.related.length > 0 && (
        <div className="aimap-sec">
          <h3>Связано</h3>
          <RelatedChips ids={node.related} onSelect={onSelect} />
        </div>
      )}

      {node.sources && node.sources.length > 0 && (
        <div className="aimap-sec">
          <h3>Источники</h3>
          <ul className="aimap-src">
            {node.sources.map((key) => {
              const source = mapSources[key];
              return (
                <li key={key}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}

export function AiPlatformMap() {
  const { openModal } = useModal();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [selected, setSelected] = useState("root");
  const [crit, setCrit] = useState<CriterionKey | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reveal, setReveal] = useState<string | null>(null);

  function select(id: string, options: { fromUser?: boolean; scroll?: boolean } = {}) {
    if (!nodeById[id]) return;
    setSelected(id);
    setCollapsed((prev) => {
      const next = new Set(prev);
      for (let p = parentOf[id]; p; p = parentOf[p]) next.delete(p);
      return next;
    });
    if (isNarrow()) setSheetOpen(true);
    else if (options.scroll) setReveal(id);
    // The hash makes every node linkable without adding history entries or router navigations.
    if (options.fromUser && window.location.hash.slice(1) !== id) {
      window.history.replaceState(window.history.state, "", `#${id}`);
    }
  }

  function onNodeClick(id: string) {
    if (collapsed.has(id)) toggle(id, false);
    select(id, { fromUser: true });
  }

  function toggle(id: string, collapse = !collapsed.has(id)) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (collapse) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function pickCriterion(key: CriterionKey) {
    const next = crit === key ? null : key;
    setCrit(next);
    if (next) {
      setCollapsed((prev) => {
        const opened = new Set(prev);
        ["layers", ...(nodeById.layers.children ?? []).map((l) => l.id)].forEach((id) =>
          opened.delete(id),
        );
        return opened;
      });
    }
  }

  // Deep links like /ai-platform-map/#reg-shadow open that node.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (nodeById[id]) select(id, { scroll: true });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    if (!reveal) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(`n-${reveal}`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
    setReveal(null);
  }, [reveal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const guidePath = postPath(MAP_GUIDE_SLUG);

  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      <section className="pt-20 pb-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <nav
            aria-label="Хлебные крошки"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginBottom: "28px" }}
          >
            <Link to="/" style={{ color: "#717182", textDecoration: "none" }}>
              Главная
            </Link>
            {" / "}
            <Link to={guidePath} style={{ color: "#717182", textDecoration: "none" }}>
              Гайд по AI-платформе
            </Link>
          </nav>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0F2356",
              marginBottom: "20px",
            }}
          >
            Интерактивная карта · внедрение ИИ
          </div>
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 4.6vw, 56px)",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              lineHeight: "1.08",
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            Корпоративная AI-платформа для компаний от 100 сотрудников
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(16px, 1.4vw, 18px)",
              color: "#717182",
              lineHeight: "1.6",
              maxWidth: "720px",
            }}
          >
            Из каких слоёв собирают ИИ для сотен сотрудников, какие open-source и российские
            решения берут на каждый слой, сколько это стоит и где ловушки. Нажмите на узел карты,
            чтобы открыть описание.
          </p>
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginTop: "24px" }}
          >
            <span>
              Разбор видео @TINROI, дополнено и проверено{" "}
              <time dateTime={MAP_CHECKED_AT}>{formatDate(MAP_CHECKED_AT)}</time>
            </span>
            <Link
              to={guidePath}
              style={{
                color: "#0F2356",
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Пошаговый гайд по внедрению →
            </Link>
          </div>
        </div>
      </section>

      <section className={`aimap pb-20${crit ? " has-crit" : ""}`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="aimap-controls">
            <span className="aimap-label">Подсветить по требованию</span>
            <div className="aimap-chips" role="group" aria-label="Требования компании">
              {criteria.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className="aimap-chip"
                  aria-pressed={crit === c.key}
                  onClick={() => pickCriterion(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="aimap-acts">
              <button type="button" className="aimap-act" onClick={() => setCollapsed(new Set())}>
                Развернуть всё
              </button>
              <button
                type="button"
                className="aimap-act"
                onClick={() =>
                  setCollapsed(
                    new Set(Object.keys(nodeById).filter((id) => depthOf[id] >= 1 && nodeById[id].children)),
                  )
                }
              >
                Свернуть
              </button>
            </div>
          </div>
          {crit && (
            <div className="aimap-legend">
              <span>
                <Meter value={3} />
                сильная сторона
              </span>
              <span>
                <Meter value={2} />
                средне
              </span>
              <span>
                <Meter value={1} />
                слабое место
              </span>
              <span>Оценка экспертная, для сравнения инструментов внутри слоя</span>
            </div>
          )}
        </div>

        {/* The map is wider than the text column: the tree needs the room. */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="aimap-layout">
            <div className="aimap-box" aria-label="Интеллект-карта">
              <div className="aimap-scroll">
                <div className="aimap-tree">
                  <TreeNode
                    node={mapTree}
                    collapsed={collapsed}
                    selected={selected}
                    crit={crit}
                    onSelect={onNodeClick}
                    onToggle={(id) => toggle(id)}
                  />
                </div>
              </div>
            </div>
            <DetailPanel
              id={selected}
              crit={crit}
              open={sheetOpen}
              onSelect={(id) => select(id, { fromUser: true, scroll: true })}
              onClose={() => setSheetOpen(false)}
            />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="aimap-sources">
            <h2>Источники</h2>
            <ol>
              {Object.entries(mapSources).map(([key, source]) => (
                <li key={key}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </li>
              ))}
            </ol>
            <p>
              Цены, лицензии и версии проверены {formatDate(MAP_CHECKED_AT)} и быстро меняются: перед
              закупкой сверяйте с первоисточником. Оценки 1–3 по требованиям экспертные. Разделы
              о 152-ФЗ и ФСТЭК не заменяют консультацию юриста.
            </p>
          </div>
        </div>
        <div
          className={`aimap-scrim${sheetOpen ? " is-open" : ""}`}
          onClick={() => setSheetOpen(false)}
        />
      </section>

      <section className="py-24" style={{ background: "#0F2356" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8">
          <div style={{ maxWidth: "640px" }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 36px)",
                letterSpacing: "-0.02em",
                color: "#ffffff",
                lineHeight: "1.2",
              }}
            >
              Нужна такая платформа в вашей компании?
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: "1.6",
                marginTop: "12px",
              }}
            >
              Разберём, какие слои нужны именно вам, во что обойдётся пилот и с какого процесса
              начать.
            </p>
          </div>
          <button
            onClick={openModal}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#0F2356",
              background: "#ffffff",
              border: "none",
              padding: "16px 28px",
              cursor: "pointer",
            }}
          >
            Записаться на разбор
          </button>
        </div>
      </section>
    </div>
  );
}
