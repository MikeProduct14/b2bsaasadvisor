import { useModal } from "../context/ModalContext";

const scaleMetrics = [
  { value: "11+", label: "лет в продукте", sub: "от seed до enterprise" },
  { value: "3 млрд ₽", label: "максимальный ARR продукта", sub: "FinTech, b2b" },
  { value: "100k+", label: "клиентов в продукте", sub: "пиковая нагрузка" },
  { value: "500", label: "подключений в сутки", sub: "после реинжиниринга" },
];

const stages = [
  {
    stage: "Seed / Pre-product-market fit",
    arr: "до 30 млн ₽",
    focus: "Поиск ценности, первые 10–50 клиентов, юнит-экономика от нуля",
    work: "Customer discovery, MVP-логика, первые продажи, настройка базовых метрик",
  },
  {
    stage: "Early Growth",
    arr: "30–300 млн ₽",
    focus: "Масштабирование онбординга, retention-основа, найм первой продуктовой команды",
    work: "Построение процессов, CJM, активационные воронки, первая приоритизация",
  },
  {
    stage: "Scale",
    arr: "300 млн – 1 млрд ₽",
    focus: "Оптимизация юнит-экономики, управление несколькими продуктовыми стримами",
    work: "OKR-каскадирование, ARPU-рост, монетизация, межкомандная координация",
  },
  {
    stage: "Enterprise / Late Growth",
    arr: "1–3+ млрд ₽",
    focus: "Системная оптимизация при высокой сложности, масштабирование без потери качества",
    work: "Реинжиниринг процессов, автоматизация, управление зависимостями, stakeholder-менеджмент",
  },
];

const decisions = [
  {
    title: "Реинжиниринг онбординга на уровне компании",
    context: "FinTech, 100k+ клиентов",
    result: "150 → 500 подключений/сутки",
    scope: "Межкомандная",
  },
  {
    title: "Пересборка монетизационной модели",
    context: "B2B e-commerce",
    result: "ARPU +113%, частота покупок +160%",
    scope: "Продуктово-коммерческая",
  },
  {
    title: "Сжатие цикла онбординга с 5 дней до 6 часов",
    context: "EdTech, growth stage",
    result: "CR анкеты +15 п.п.",
    scope: "Продуктовая",
  },
  {
    title: "Внедрение ROI-приоритизации в roadmap",
    context: "B2B SaaS, несколько стримов",
    result: "Снижение waste >40%, фокус на ключевых метриках",
    scope: "Процессная",
  },
  {
    title: "Запуск автоскоринга для партнёрской базы",
    context: "FinTech, enterprise",
    result: "Снижение ручной обработки на 70%",
    scope: "Product + Operations",
  },
];

const teamWork = [
  {
    aspect: "Размер команд",
    desc: "Работал с командами от 3 до 50+ человек. От фаундер-продукта до мультистримовой организации.",
  },
  {
    aspect: "Роли в командах",
    desc: "PM, дизайнеры, аналитики, разработчики, CS, продажи. Умею работать на стыке и выстраивать связи.",
  },
  {
    aspect: "Форматы участия",
    desc: "Fractional CPO, project-lead, советник, внешний аудитор. Подстраиваюсь под контекст.",
  },
  {
    aspect: "Межфункциональная работа",
    desc: "Регулярно работал на стыке продукта, продаж и операций — особенно критично в B2B SaaS с длинным циклом.",
  },
];

export function ManagementScale() {
  const { openModal } = useModal();

  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      {/* Hero */}
      <section className="pt-24 pb-20" style={{ background: "#ffffff" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0F2356",
                  marginBottom: "28px",
                }}
              >
                Управленческий масштаб
              </div>
              <h1
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(38px, 5.5vw, 72px)",
                  letterSpacing: "-0.03em",
                  color: "#0a0a0a",
                  lineHeight: "1.05",
                  marginBottom: "32px",
                  maxWidth: "820px",
                }}
              >
                С какими масштабами
                <br />
                я работал
              </h1>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(16px, 1.5vw, 20px)",
                  color: "#717182",
                  lineHeight: "1.7",
                  maxWidth: "560px",
                }}
              >
                Не теория. Конкретные решения на конкретных
                масштабах — от 30 млн ₽ ARR до 3 млрд ₽.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scale metrics */}
      <section className="py-20" style={{ background: "#0a0a0a" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {scaleMetrics.map((m, i) => (
              <div
                key={m.label}
                className="py-10 px-8"
                style={{
                  borderRight:
                    i < scaleMetrics.length - 1
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                  borderTop:
                    i >= 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(32px, 3.5vw, 48px)",
                    letterSpacing: "-0.04em",
                    color: "#ffffff",
                    lineHeight: "1",
                    marginBottom: "8px",
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#e8e8e8",
                    marginBottom: "4px",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#717182",
                  }}
                >
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="py-28" style={{ background: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="mb-16">
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
              Стадии продуктов
            </span>
            <h2
              className="mt-6"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 48px)",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.1",
              }}
            >
              Работал на всех стадиях роста
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {stages.map((s, i) => (
              <div
                key={s.stage}
                className="col-span-12 sm:col-span-6 lg:col-span-3 p-8"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  position: "relative",
                }}
              >
                {/* Stage label */}
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "13px",
                    letterSpacing: "0",
                    color: "#0F2356",
                    marginBottom: "6px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "-0.02em",
                    color: "#0a0a0a",
                    lineHeight: "1.3",
                    marginBottom: "6px",
                  }}
                >
                  {s.stage}
                </div>
                <div
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#4a7aff",
                    marginBottom: "16px",
                  }}
                >
                  {s.arr}
                </div>
                <div
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.07)",
                    paddingTop: "16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "#717182",
                      lineHeight: "1.6",
                      marginBottom: "12px",
                    }}
                  >
                    {s.focus}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "#3a3a3a",
                      lineHeight: "1.6",
                    }}
                  >
                    {s.work}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key decisions */}
      <section className="py-28" style={{ background: "#ffffff" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="mb-16">
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
              Ключевые решения
            </span>
            <h2
              className="mt-6"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 48px)",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.1",
              }}
            >
              Решения с измеримым результатом
            </h2>
          </div>

          <div className="flex flex-col">
            {decisions.map((d, i) => (
              <div
                key={d.title}
                className="grid grid-cols-12 gap-6 py-8"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.07)",
                  ...(i === decisions.length - 1
                    ? { borderBottom: "1px solid rgba(0,0,0,0.07)" }
                    : {}),
                }}
              >
                <div className="col-span-12 md:col-span-5">
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "17px",
                      letterSpacing: "-0.02em",
                      color: "#0a0a0a",
                      lineHeight: "1.3",
                      marginBottom: "6px",
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "#717182",
                    }}
                  >
                    {d.context}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 flex items-center">
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#3a3a3a",
                      lineHeight: "1.5",
                    }}
                  >
                    {d.result}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-center md:justify-end">
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#0F2356",
                      background: "rgba(15,35,86,0.06)",
                      padding: "5px 10px",
                    }}
                  >
                    {d.scope}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team work */}
      <section className="py-28" style={{ background: "#0F2356" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Командный контекст
            </span>
            <h2
              className="mt-6"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 48px)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: "1.1",
              }}
            >
              Форматы участия
              <br />
              и командная работа
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {teamWork.map((t) => (
              <div key={t.aspect} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    background: "#4a7aff",
                    marginBottom: "20px",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    letterSpacing: "-0.02em",
                    color: "#ffffff",
                    lineHeight: "1.3",
                    marginBottom: "12px",
                  }}
                >
                  {t.aspect}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: "1.7",
                  }}
                >
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-8">
              <h2
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  letterSpacing: "-0.03em",
                  color: "#0a0a0a",
                  lineHeight: "1.15",
                  marginBottom: "16px",
                }}
              >
                Ваш масштаб подходит?
                <br />
                Разберёмся на созвоне
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "#717182",
                  lineHeight: "1.6",
                }}
              >
                Если ваш ARR от 30 млн ₽ и есть доступ к данным — это наш формат.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
              <button
                onClick={openModal}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                  color: "#ffffff",
                  background: "#0F2356",
                  border: "none",
                  padding: "16px 36px",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                Записаться на созвон →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
