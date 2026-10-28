import { useState } from "react";

const categories = ["Все", "Продажи", "Операции", "Финансы", "Клиенты"] as const;

type Category = Exclude<(typeof categories)[number], "Все">;

interface Case {
  industry: string;
  tag: string;
  category: Category;
  problem: string;
  action: string;
  stack: string[];
  metrics: { value: string; unit: string; prev: string }[];
}

const cases: Case[] = [
  {
    industry: "FinTech",
    tag: "100k+ клиентов · 3 млрд ₽ ARR",
    category: "Клиенты",
    problem:
      "Подключение новых клиентов упёрлось в ручную проверку заявок: очередь росла быстрее команды",
    action:
      "Автоскоринг заявок, автоматическая маршрутизация между командами, реинжиниринг процесса подключения",
    stack: ["Автоскоринг", "BPM-маршрутизация", "API"],
    metrics: [{ value: "500", unit: "подключений/сутки", prev: "↑ с 150" }],
  },
  {
    industry: "Оптовая дистрибуция",
    tag: "≈ 300 заказов в день",
    category: "Операции",
    problem:
      "Заказы приходили в почту, WhatsApp и Excel — менеджеры вручную перебивали их в 1С и ошибались в артикулах",
    action:
      "AI-разбор заказов из писем и мессенджеров, сопоставление с каталогом, автоматическое создание заказа в 1С — менеджер только подтверждает",
    stack: ["n8n", "LLM", "1С", "WhatsApp API"],
    metrics: [
      { value: "3 мин", unit: "на обработку заказа", prev: "↓ с 25 мин" },
      { value: "−90%", unit: "ошибок в заказах", prev: "" },
    ],
  },
  {
    industry: "B2B-услуги",
    tag: "IT-аутсорс · 40 сотрудников",
    category: "Продажи",
    problem:
      "Заявки с сайта и выставок висели без ответа по полдня, часть лидов терялась между менеджерами",
    action:
      "Автоквалификация лидов, мгновенный первый ответ, распределение по менеджерам и контроль касаний в CRM",
    stack: ["amoCRM", "Make", "LLM-квалификация", "Telegram"],
    metrics: [
      { value: "5 мин", unit: "до первого ответа", prev: "↓ с 4 часов" },
      { value: "+38%", unit: "конверсия во встречу", prev: "" },
    ],
  },
  {
    industry: "EdTech",
    tag: "Growth stage",
    category: "Клиенты",
    problem:
      "Клиент ждал доступа к продукту 5 дней: анкета, ручная проверка, ручная выдача доступов",
    action:
      "Пересобрали путь активации: анкета с логикой ветвления, автоматическая выдача доступов, триггерные напоминания",
    stack: ["Анкета с логикой", "Триггерные письма", "CRM"],
    metrics: [
      { value: "6 ч", unit: "time-to-onboarding", prev: "↓ с 5 дней" },
      { value: "+15 п.п.", unit: "CR анкеты", prev: "" },
    ],
  },
  {
    industry: "B2B SaaS",
    tag: "HR-tech · 2 000+ клиентов",
    category: "Клиенты",
    problem:
      "Поддержка не успевала за ростом базы: большая часть обращений — типовые вопросы, ответа ждали по 3 часа",
    action:
      "AI-ассистент первой линии на базе знаний и документации, автоматическая маршрутизация сложных обращений на людей",
    stack: ["LLM + RAG", "Helpdesk", "База знаний"],
    metrics: [
      { value: "62%", unit: "обращений без оператора", prev: "" },
      { value: "1 мин", unit: "среднее время ответа", prev: "↓ с 3 часов" },
    ],
  },
  {
    industry: "B2B e-commerce",
    tag: "Enterprise",
    category: "Продажи",
    problem:
      "Низкая доходность клиента: повторные заказы держались на памяти менеджеров",
    action:
      "Пересборка CJM и товарного микса, автоматические триггерные механики повторных заказов и допродаж",
    stack: ["Сегментация", "Триггерные кампании", "CRM"],
    metrics: [
      { value: "+113%", unit: "рост ARPU", prev: "220k → 470k ₽" },
      { value: "+160%", unit: "Purchase Frequency", prev: "" },
    ],
  },
  {
    industry: "Логистика",
    tag: "Экспедирование · 1 500 рейсов/мес",
    category: "Финансы",
    problem:
      "Закрытие месяца занимало 6 рабочих дней: акты, счета и сверки с перевозчиками собирались вручную",
    action:
      "Автогенерация закрывающих документов из TMS, отправка через ЭДО, автоматическая сверка с перевозчиками",
    stack: ["1С", "ЭДО", "n8n", "TMS API"],
    metrics: [
      { value: "1 день", unit: "закрытие месяца", prev: "↓ с 6 дней" },
      { value: "−75%", unit: "рутины в бухгалтерии", prev: "" },
    ],
  },
  {
    industry: "Розничная сеть",
    tag: "120 точек · массовый найм",
    category: "Операции",
    problem:
      "HR вручную разбирал сотни откликов в неделю, кандидаты остывали до собеседования",
    action:
      "Telegram-бот: первичный отбор, автозапись на собеседование, напоминания и чек-лист онбординга для новичка",
    stack: ["Telegram Mini App", "LLM-скрининг", "HRM"],
    metrics: [
      { value: "5 дней", unit: "от отклика до выхода", prev: "↓ с 14 дней" },
      { value: "−50%", unit: "нагрузки на HR", prev: "" },
    ],
  },
  {
    industry: "FinTech",
    tag: "Enterprise · партнёрская сеть",
    category: "Финансы",
    problem:
      "Анкеты партнёров проверялись вручную и проходили через несколько отделов",
    action:
      "Автоматический скоринг партнёров, проверка по внешним источникам, ручной разбор только пограничных случаев",
    stack: ["Скоринг", "Внешние API", "Workflow-движок"],
    metrics: [{ value: "−70%", unit: "ручной обработки", prev: "" }],
  },
];

const INITIAL_VISIBLE = 5;

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#717182",
};

export function Cases() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Все");
  const [expanded, setExpanded] = useState(false);

  const filtered =
    category === "Все" ? cases : cases.filter((c) => c.category === category);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section id="cases" className="py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-14">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0F2356",
            }}
          >
            Кейсы
          </span>
          <h2
            className="mt-6"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              lineHeight: "1.1",
            }}
          >
            Результаты в цифрах
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "#717182",
              lineHeight: "1.6",
              maxWidth: "560px",
              marginTop: "20px",
            }}
          >
            Каждая автоматизация — с замеренным эффектом: часы, деньги,
            скорость.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setExpanded(false);
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  letterSpacing: "0.02em",
                  color: active ? "#ffffff" : "#3a3a3a",
                  background: active ? "#0F2356" : "#ffffff",
                  border: active
                    ? "1px solid #0F2356"
                    : "1px solid rgba(0,0,0,0.12)",
                  padding: "8px 16px",
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cases */}
        <div className="flex flex-col gap-0">
          {visible.map((c, idx) => (
            <div
              key={`${c.industry}-${c.tag}`}
              className="grid grid-cols-12 gap-6 py-14"
              style={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                ...(idx === visible.length - 1
                  ? { borderBottom: "1px solid rgba(0,0,0,0.08)" }
                  : {}),
              }}
            >
              {/* Industry */}
              <div className="col-span-12 md:col-span-3">
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "22px",
                    letterSpacing: "-0.02em",
                    color: "#0a0a0a",
                    marginBottom: "6px",
                  }}
                >
                  {c.industry}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#717182",
                    letterSpacing: "0",
                  }}
                >
                  {c.tag}
                </div>
              </div>

              {/* Problem + Action + Stack */}
              <div className="col-span-12 md:col-span-5">
                <div className="mb-3">
                  <span style={labelStyle}>Было</span>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#0a0a0a",
                      marginTop: "6px",
                      lineHeight: "1.5",
                    }}
                  >
                    {c.problem}
                  </p>
                </div>
                <div className="mt-5">
                  <span style={labelStyle}>Что автоматизировали</span>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#3a3a3a",
                      marginTop: "6px",
                      lineHeight: "1.5",
                    }}
                  >
                    {c.action}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.stack.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        color: "#0F2356",
                        background: "#f3f5fa",
                        padding: "4px 10px",
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="col-span-12 md:col-span-4 flex flex-wrap gap-x-6 gap-y-8 items-start justify-start md:justify-end">
                {c.metrics.map((m) => (
                  <div key={m.unit} className="md:text-right">
                    <div
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(36px, 4vw, 52px)",
                        letterSpacing: "-0.04em",
                        color: "#0F2356",
                        lineHeight: "1",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#0a0a0a",
                        marginTop: "4px",
                      }}
                    >
                      {m.unit}
                    </div>
                    {m.prev && (
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#717182",
                          marginTop: "2px",
                        }}
                      >
                        {m.prev}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Show all */}
        {filtered.length > INITIAL_VISIBLE && (
          <div className="mt-10">
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#0F2356",
                background: "transparent",
                border: "1px solid #0F2356",
                padding: "14px 28px",
                cursor: "pointer",
              }}
            >
              {expanded
                ? "Свернуть ↑"
                : `Показать все кейсы (${filtered.length}) ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
