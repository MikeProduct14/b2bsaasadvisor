import type React from "react";
import { Link } from "react-router";
import { useModal } from "../context/ModalContext";
import { Explorer } from "../fintech/Explorer";
import { faq, sources, timeline } from "../fintech/content";
import {
  SNAPSHOT,
  SNAPSHOT_RU,
  VERDICT_LABEL,
  allSegments,
  byScore,
  countByVerdict,
  descendants,
  fmtScore,
  getSegment,
  market,
  pathText,
  score,
  verdict,
  type ScoredSegment,
  type Segment,
} from "../fintech/model";

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#0F2356",
};

const h2Style = {
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 800,
  fontSize: "clamp(26px, 3vw, 38px)",
  letterSpacing: "-0.03em",
  color: "#0a0a0a",
  lineHeight: "1.15",
  marginBottom: "16px",
  scrollMarginTop: "88px",
};

const h3Style = {
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 700,
  fontSize: "19px",
  letterSpacing: "-0.02em",
  color: "#0a0a0a",
  lineHeight: "1.3",
};

const leadStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "clamp(15px, 1.3vw, 17px)",
  color: "#717182",
  lineHeight: "1.65",
  maxWidth: "720px",
};

const bodyStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  color: "#3a3a3a",
  lineHeight: "1.6",
};

const COUNTRIES = ["Казахстан", "Узбекистан", "Армения", "Кыргызстан", "СНГ"];

const DEFINITIONS = [
  { term: "Перегрев 1–5", text: "1 — игроков почти нет. 5 — рынок поделён лидерами, идёт ценовая война." },
  { term: "Барьер 1–5", text: "1 — можно начать без лицензии и капитала. 5 — лицензия ЦБ, капитал, аккредитация." },
  {
    term: "Деньги 1–5",
    text: "Выручка, которую новый игрок реально возьмёт за 2–3 года: 1 — до 10 млн ₽ в год, 3 — десятки миллионов, 5 — сотни миллионов и больше.",
  },
  { term: "Ветер −1…+1", text: "↑ регуляторика создаёт спрос, ↓ сжимает рынок, → нейтрально." },
];

/** Ссылка #код-сегмента: открывает его на карте, даже если этот код уже в адресе. */
function SegmentLink({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${id}`}
      className={className}
      style={style}
      onClick={(e) => {
        if (window.location.hash === `#${id}`) {
          e.preventDefault();
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }
      }}
    >
      {children}
    </a>
  );
}

const segmentName = (id: string) => {
  const n = getSegment(id);
  return n ? n.s || n.n : id;
};

function Pill({ n }: { n: Segment }) {
  const w = score(n);
  return <span className={`fm-pill fm-${verdict(w)}`}>{fmtScore(w)}</span>;
}

function SegmentDetails({ n, domain }: { n: ScoredSegment; domain?: boolean }) {
  const path = domain ? "Домен целиком" : pathText(n);
  return (
    <details id={`seg-${n.id}`} className="fm-details">
      <summary>
        <span className="name">
          {n.n}
          {path && <span className="path">{path}</span>}
        </span>
        <span className="fm-verdict-word">{VERDICT_LABEL[verdict(score(n))]}</span>
        <Pill n={n} />
      </summary>
      <div className="fm-details-body">
        <p>{n.d}</p>
        <dl>
          {n.money && (
            <>
              <dt>Деньги</dt>
              <dd>{n.money}</dd>
            </>
          )}
          {n.entry && (
            <>
              <dt>Где окно</dt>
              <dd>{n.entry}</dd>
            </>
          )}
          {n.reg?.length ? (
            <>
              <dt>Регуляторика и факты</dt>
              <dd>
                <ul>
                  {n.reg.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
          {n.players && (
            <>
              <dt>Игроки</dt>
              <dd>{n.players}</dd>
            </>
          )}
          {n.risk && (
            <>
              <dt>Риски</dt>
              <dd>{n.risk}</dd>
            </>
          )}
        </dl>
        <SegmentLink id={n.id} className="fm-open-link">
          Открыть на карте →
        </SegmentLink>
      </div>
    </details>
  );
}

export function FintechMap() {
  const { openModal } = useModal();
  const count = countByVerdict(allSegments);
  const open = byScore(allSegments).filter((n) => verdict(score(n)) === "open");
  const domains = (market.c ?? []) as ScoredSegment[];

  const facts = [
    { value: allSegments.length, label: "сегментов рынка" },
    { value: count.open, label: "открытых окон для входа" },
    { value: count.wedge, label: "нужен клин" },
    { value: count.closed, label: "закрыто" },
  ];

  const cisRows = COUNTRIES.map((country) => ({
    country,
    rows: domains.flatMap((d) =>
      (d.cis ?? []).filter((r) => r.country === country).map((r) => ({ domain: d.n, text: r.text })),
    ),
  })).filter((c) => c.rows.length > 0);

  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      {/* Hero */}
      <section className="pt-20 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <nav
            aria-label="Хлебные крошки"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginBottom: "28px" }}
          >
            <Link to="/" style={{ color: "#717182", textDecoration: "none" }}>
              Главная
            </Link>
            {" / "}
            <Link to="/products/" style={{ color: "#717182", textDecoration: "none" }}>
              Продукты
            </Link>
          </nav>
          <div style={{ ...labelStyle, marginBottom: "24px" }}>
            Исследование рынка · срез <time dateTime={SNAPSHOT}>{SNAPSHOT_RU}</time>
          </div>
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.2vw, 68px)",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              lineHeight: "1.05",
              marginBottom: "28px",
              maxWidth: "880px",
            }}
          >
            Карта рынка финтеха России и СНГ
          </h1>
          <p style={{ ...leadStyle, fontSize: "clamp(16px, 1.4vw, 19px)" }}>
            {allSegments.length} сегментов финтеха в пяти доменах: банки, приём платежей, агрегаторы финансовых услуг,
            сервисы для самозанятых и KYC/AML. Каждый сегмент оценён с позиции нового игрока без банковской лицензии:
            насколько рынок перегрет, какой барьер входа, сколько денег можно взять за 2–3 года и куда дует регуляторный
            ветер.
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-6 mt-10">
            {facts.map((fact) => (
              <div key={fact.label}>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(32px, 3.4vw, 44px)",
                    letterSpacing: "-0.04em",
                    color: "#0F2356",
                    lineHeight: "1",
                  }}
                >
                  {fact.value}
                </div>
                <div
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#0a0a0a", marginTop: "4px" }}
                >
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open windows */}
      <section className="pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div style={{ background: "#f8f8f8", borderLeft: "3px solid #0F2356", padding: "32px" }}>
            <h2 id="windows" style={{ ...h2Style, fontSize: "clamp(22px, 2.4vw, 28px)" }}>
              Где в 2026 году есть окно для входа в финтех
            </h2>
            <p style={{ ...bodyStyle, maxWidth: "760px", marginBottom: "24px" }}>
              Горизонтальные рынки — эквайринг, кассы, финмаркетплейсы, розничный банкинг — поделены экосистемами и
              крупнейшими банками. Окна появляются там, где регулятор вводит новое требование быстрее, чем крупные
              вендоры успевают закрыть его продуктом. На {SNAPSHOT_RU} таких сегментов {open.length}:
            </p>
            <ol className="flex flex-col gap-5">
              {open.map((n) => (
                <li key={n.id} className="grid gap-x-6 gap-y-1" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <Pill n={n} />
                  <div>
                    <SegmentLink id={n.id} className="fm-title-link" style={h3Style}>
                      {n.n}
                    </SegmentLink>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182" }}>
                      {" "}
                      · {pathText(n)}
                    </span>
                    <p style={{ ...bodyStyle, marginTop: "4px" }}>{n.entry}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p style={{ ...bodyStyle, color: "#717182", marginTop: "24px", maxWidth: "760px" }}>
              Комплаенс по 115-ФЗ для МФО я проверял отдельным MVP — разбор гипотезы в разделе{" "}
              <Link to="/products/#compliance-mfo" style={{ color: "#0F2356" }}>
                «Продукты»
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Interactive map */}
      <section className="pb-20" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16">
          <h2 id="map" style={h2Style}>
            Интерактивная карта: {allSegments.length} сегментов
          </h2>
          <p style={{ ...leadStyle, marginBottom: "32px" }}>
            Плитки показывают домены и сегменты, «Внутрь» открывает подсегменты. Матрица раскладывает их по перегреву и
            деньгам, рейтинг сортирует по окну входа. Ссылкой на сегмент можно поделиться: код добавляется к адресу,
            например <code>#kyc.crypto</code>.
          </p>
          <Explorer />
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20" style={{ background: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 id="method" style={h2Style}>
            Как читать карту
          </h2>
          <p style={{ ...leadStyle, marginBottom: "32px" }}>
            Каждый сегмент получает три оценки от 1 до 5 и направление регуляторного ветра. Из них считается окно для
            входа.
          </p>
          <div className="grid grid-cols-12 gap-6">
            {DEFINITIONS.map((item) => (
              <div
                key={item.term}
                className="col-span-12 md:col-span-6 lg:col-span-3 p-6"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3 style={{ ...h3Style, fontSize: "17px", marginBottom: "8px" }}>{item.term}</h3>
                <p style={{ ...bodyStyle, fontSize: "14px" }}>{item.text}</p>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(17px, 2vw, 22px)",
              color: "#0F2356",
              marginTop: "32px",
            }}
          >
            Окно = Деньги × (12 − Перегрев − Барьер) / 10 + 0,3 × Ветер
          </p>
          <p style={{ ...bodyStyle, marginTop: "10px", maxWidth: "760px" }}>
            От 2,4 — открыто. От 1,6 до 2,4 — нужен клин: узкое преимущество, без которого не пробиться. Ниже 1,6 —
            закрыто. Деньги стоят множителем: пустой рынок без денег окна не даёт.
          </p>
        </div>
      </section>

      {/* Regulation timeline */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 id="regulation" style={h2Style}>
            Регуляторика 2026–2028: что меняет рынок финтеха
          </h2>
          <p style={{ ...leadStyle, marginBottom: "28px" }}>
            Даты, от которых зависят оценки на карте. Статус указан на {SNAPSHOT_RU}.
          </p>
          <div className="fm-scroll-x">
            <table className="fm-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Что меняется</th>
                  <th>Сегмент</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((item) => {
                  const status = item.planned ? "План" : item.date <= SNAPSHOT ? "Действует" : "Впереди";
                  return (
                    <tr key={`${item.date}-${item.segment}-${item.text}`}>
                      <td className="nowrap">{item.label}</td>
                      <td>{item.text}</td>
                      <td className="nowrap">
                        <SegmentLink id={item.segment}>{segmentName(item.segment)}</SegmentLink>
                      </td>
                      <td className={`nowrap status-${status === "Действует" ? "now" : "next"}`}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CIS */}
      <section className="py-20" style={{ background: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 id="cis" style={h2Style}>
            Финтех в СНГ: Казахстан, Узбекистан, Армения, Кыргызстан
          </h2>
          <p style={{ ...leadStyle, marginBottom: "32px" }}>
            Оценки на карте сделаны для России. Заметки по странам СНГ показывают, где рынок устроен иначе.
          </p>
          <div className="grid grid-cols-12 gap-6">
            {cisRows.map(({ country, rows }) => (
              <div
                key={country}
                className="col-span-12 md:col-span-6 p-7"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3 style={{ ...h3Style, marginBottom: "14px" }}>{country === "СНГ" ? "Весь регион" : country}</h3>
                <ul className="flex flex-col gap-3">
                  {rows.map((row) => (
                    <li key={`${row.domain}-${row.text}`} style={{ ...bodyStyle, fontSize: "14px" }}>
                      <span style={{ ...labelStyle, fontSize: "10px", color: "#717182", display: "block" }}>
                        {row.domain}
                      </span>
                      {row.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full index */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 id="segments" style={h2Style}>
            Все сегменты рынка финтеха
          </h2>
          <p style={{ ...leadStyle, marginBottom: "36px" }}>
            Полный список с оценками и фактами — тот же текст, что в карточках карты.
          </p>
          <div className="flex flex-col gap-12">
            {domains.map((domain) => (
              <div key={domain.id}>
                <h3 style={{ ...h3Style, fontSize: "22px", marginBottom: "6px" }}>{domain.n}</h3>
                <p style={{ ...bodyStyle, color: "#717182", fontSize: "14px", marginBottom: "16px" }}>{domain.d}</p>
                <div className="fm-index">
                  {[domain, ...descendants(domain)].map((n) => (
                    <SegmentDetails key={n.id} n={n} domain={n === domain} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div style={{ maxWidth: "860px" }}>
            <h2 id="faq" style={h2Style}>
              Частые вопросы
            </h2>
            <div className="flex flex-col">
              {faq.map((item) => (
                <div key={item.q} className="py-6" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <h3 style={{ ...h3Style, fontSize: "18px", marginBottom: "8px" }}>{item.q}</h3>
                  <p style={{ ...bodyStyle, fontSize: "16px", lineHeight: "1.65" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div style={{ maxWidth: "860px" }}>
            <h2 id="sources" style={{ ...h2Style, fontSize: "clamp(22px, 2.4vw, 28px)" }}>
              Источники
            </h2>
            <p style={{ ...bodyStyle, color: "#717182", marginBottom: "20px" }}>
              Факты сверены {SNAPSHOT_RU}. Часть ссылок — вторичные источники: перед цитированием цифр сверяйтесь с
              cbr.ru и pravo.gov.ru. Чтобы обновить ветку самостоятельно, откройте сегмент на карте и нажмите «Промпт
              для ИИ-ресерча ветки»: кнопка соберёт запрос для любой модели с поиском.
            </p>
            <ol className="flex flex-col gap-2" style={{ listStyle: "decimal", paddingLeft: "20px" }}>
              {sources.map((source) => (
                <li
                  key={source.url}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#717182", lineHeight: "1.5" }}
                >
                  <a href={source.url} target="_blank" rel="noopener" style={{ color: "#0F2356" }}>
                    {source.title}
                  </a>
                  <span> — {source.publisher}</span>
                  {source.date && <span>, {source.date.split("-").reverse().join(".")}</span>}
                </li>
              ))}
            </ol>
            <p style={{ ...bodyStyle, fontSize: "13px", color: "#717182", marginTop: "28px" }}>
              Оценки 1–5 экспертные и субъективные, это не инвестиционная рекомендация. Помеченное «оценка» не
              подтверждено первоисточником.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "#0F2356" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8">
          <div style={{ maxWidth: "680px" }}>
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
              Выбираете, куда зайти в финтехе?
            </p>
            <p style={{ ...bodyStyle, color: "rgba(255,255,255,0.75)", marginTop: "12px" }}>
              Помогу проверить гипотезу на цифрах и регуляторике и собрать MVP, который покажет спрос до больших
              вложений.
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
            Обсудить задачу
          </button>
        </div>
      </section>
    </div>
  );
}
