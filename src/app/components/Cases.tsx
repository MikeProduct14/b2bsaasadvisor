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

// Цифры — из резюме автора (hh.ru, 29.10.2026). Новые кейсы добавлять только с подтверждённым эффектом.
const cases: Case[] = [
  {
    industry: "AI-агрегатор",
    tag: "Молекула AI · B2C-подписка и B2B · 5 месяцев",
    category: "Продажи",
    problem:
      "Поднять выручку агрегатора нейросетей: конверсию в оплату, удержание и новые источники дохода",
    action:
      "Пересобрал тарифную сетку с доступным входным тарифом (+36% новых покупателей в день), запустил докупку токенов и B2B-продажи по счетам: презентации, калькулятор тарифов, mini-CRM, клиентский гайд по моделям",
    stack: ["DataLens", "SQL", "Яндекс Метрика", "Claude"],
    metrics: [
      { value: "+23%", unit: "выручка", prev: "к уровню до прихода, 1,16 млн ₽/мес" },
      { value: "1,14 млн ₽", unit: "из новых источников", prev: "20% выручки периода" },
    ],
  },
  {
    industry: "FinTech",
    tag: "100k+ мерчантов · 3 млрд ₽ ARR",
    category: "Операции",
    problem:
      "Подключение мерчантов шло через анкету, KYC и ручные проверки: от заявки до первой пользы проходило 5 дней",
    action:
      "Автоматизация онбординга: анкета, KYC и скоринг, бэкофис и статусы, интеграции. AI в бэкофисе, скоринге, взаиморасчётах и подключении партнёров",
    stack: ["KYC", "Скоринг", "Backoffice", "API", "AI"],
    metrics: [
      { value: "6 ч", unit: "time-to-value", prev: "↓ с 5 дней" },
      { value: "500", unit: "подключений в день", prev: "↑ с 150, +21 млн ₽ прибыли/мес" },
    ],
  },
  {
    industry: "AI-агрегатор",
    tag: "Молекула AI · рост аудитории",
    category: "Клиенты",
    problem: "Нарастить аудиторию без зависимости от платной рекламы",
    action:
      "SEO-посадочные под модели, роли и задачи с переходом сразу в чат; при отказе от платной рекламы органический поиск вырос в 6,4 раза. Работа с удержанием: автопродления +48%",
    stack: ["SEO", "Яндекс Вордстат", "DataLens", "Вебвизор"],
    metrics: [
      { value: "×2,2", unit: "регистраций", prev: "до 12,3 тыс. в месяц" },
      { value: "×2,1", unit: "активная аудитория", prev: "4,5 → 9,5 тыс. в месяц" },
    ],
  },
  {
    industry: "FinTech",
    tag: "Онлайн-платежи · антифрод",
    category: "Финансы",
    problem: "Снизить фрод при росте подключений и не потерять конверсию анкеты",
    action:
      "Правила скоринга, автоматизация проверок и согласования рисков",
    stack: ["Скоринг", "Автопроверки", "Workflow"],
    metrics: [
      { value: "−20%", unit: "фрода", prev: "" },
      { value: "+15%", unit: "конверсия анкеты", prev: "+10% end-to-end" },
    ],
  },
  {
    industry: "EdTech / MedTech",
    tag: "Медобразование · РФ, ЕС, США",
    category: "Клиенты",
    problem:
      "Перевести мобильный сегмент на подписку с длинными сроками и вывести продукт на международный рынок",
    action:
      "Android-приложения для врачей и медсестёр с нуля за 3 месяца, A/B-тест годовой подписки, привлечение через справочники врача, медкалькуляторы и бесплатные материалы",
    stack: ["Android", "A/B-тесты", "CJM", "Push"],
    metrics: [
      { value: "+300%", unit: "выручка мобильного сегмента", prev: "к web в период A/B-теста" },
      { value: "+50 000", unit: "новых платящих", prev: "пилот за рубежом — $300 000" },
    ],
  },
  {
    industry: "B2B e-commerce",
    tag: "2 млн позиций · 30 000 оптовых клиентов",
    category: "Продажи",
    problem: "Нарастить частоту и чек оптовых закупок на портале автозапчастей",
    action:
      "Редизайн CJM через JTBD: умный поиск и аналоги, фильтры по артикулам, новые способы оплаты, переработка подключения клиента, ценообразование для маркетплейсов, программа лояльности",
    stack: ["JTBD", "CJM", "Каталоги", "Лояльность"],
    metrics: [
      { value: "~470 тыс. ₽", unit: "средний чек", prev: "↑ с ~220 тыс. ₽" },
      { value: "+88%", unit: "оборот", prev: "частота покупок ≈160%" },
    ],
  },
  {
    industry: "HealthTech",
    tag: "Wellness · два MVP · founder",
    category: "Клиенты",
    problem: "Проверить спрос на продукты для снижения веса и ментального здоровья без бюджета на рекламу",
    action:
      "Discovery: 20+ интервью и разбор 15+ конкурентов, CJM, анкетирование, сегментация и персонализированные сценарии; оба MVP доведены до пилота",
    stack: ["CustDev", "CJM", "Анкета", "Сегментация"],
    metrics: [
      { value: "~42%", unit: "из анкеты в старт программы", prev: "D1 ~38%, D7 ~16%" },
      { value: "120+", unit: "пользователей", prev: "без платного маркетинга" },
    ],
  },
  {
    industry: "Бренд профкосметики",
    tag: "Розничная сеть и интернет-магазин · B2B и B2C",
    category: "Продажи",
    problem: "Поднять доходность клиента и повторные закупки в B2B и B2C",
    action:
      "Редизайн интернет-магазина и каталога, CJM подбора, программа лояльности для B2B и B2C, дилерский кабинет для оптовых закупок, SEO и конверсионные воронки по топ-страницам",
    stack: ["Лояльность", "B2B-кабинет", "SEO", "CJM"],
    metrics: [
      { value: "+71%", unit: "ARPU", prev: "" },
      { value: "+25%", unit: "повторных B2B-покупок", prev: "20 000 новых платящих" },
    ],
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
            Каждый результат — с замеренным эффектом: деньги, конверсия,
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
                  <span style={labelStyle}>Задача</span>
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
                  <span style={labelStyle}>Что сделали</span>
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
