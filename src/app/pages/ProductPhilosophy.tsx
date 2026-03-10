import { useModal } from "../context/ModalContext";

const principles = [
  {
    num: "01",
    title: "Продукт — это система, а не набор фич",
    body: "Рост не создаётся добавлением функций. Он возникает, когда каждый элемент системы — онбординг, монетизация, retention, команда — работает как единое целое. Я смотрю на продукт как на систему с ограничениями, а не как на список задач.",
  },
  {
    num: "02",
    title: "Ограничение системы — единственное, что важно",
    body: "Теория ограничений Голдратта применима к любому B2B SaaS: в каждый момент времени существует ровно одно ключевое ограничение роста. Устранение второстепенных проблем при живом ограничении — потеря ресурсов. Моя задача — найти это ограничение и устранить его системно.",
  },
  {
    num: "03",
    title: "Данные решают, интуиция направляет",
    body: "Мнения — это гипотезы. Решения принимаются на основе данных: юнит-экономики, когортного анализа, воронки активации. Но данные без опыта интерпретации — шум. Я соединяю аналитику с продуктовым мышлением.",
  },
  {
    num: "04",
    title: "ROI-первичность в приоритизации",
    body: "Каждая инициатива оценивается по финансовому весу: какой вклад она вносит в ARR, LTV, margin? Красивые фичи без финансового обоснования стоят в конце очереди. Это не жестокость — это уважение к ресурсам команды.",
  },
  {
    num: "05",
    title: "Скорость обучения важнее скорости поставки",
    body: "В SaaS побеждает тот, кто быстрее обучается — на данных, на ошибках, на обратной связи рынка. Культура экспериментов и измеримые гипотезы важнее скорости релизов. Быстро делать не то — это медленно расти.",
  },
  {
    num: "06",
    title: "Системность масштабируется, хаос — нет",
    body: "Компании, которые растут через хаос, упираются в потолок. Системы, процессы, прозрачная коммуникация — это не бюрократия, это инфраструктура для масштабирования. Без неё 150 подключений в сутки не становятся 500.",
  },
];

const beliefs = [
  { text: "Понять систему важнее, чем быстро предложить решение" },
  { text: "Честный диагноз ценнее красивого плана" },
  { text: "Долгосрочное партнёрство важнее разового проекта" },
  { text: "Нет плохих продуктов — есть неверно диагностированные ограничения" },
];

export function ProductPhilosophy() {
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
                Product Philosophy
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
                Как я думаю
                <br />
                о продукте
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
                Это не методология ради методологии.
                Это принципы, которые определяют каждое решение
                в работе с B2B SaaS-продуктами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px",
        }}
      />

      {/* Principles */}
      <section className="py-24" style={{ background: "#ffffff" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col">
            {principles.map((p, idx) => (
              <div
                key={p.num}
                className="grid grid-cols-12 gap-6 py-14"
                style={{
                  borderTop:
                    idx === 0
                      ? "none"
                      : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {/* Number */}
                <div className="col-span-12 md:col-span-1">
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 800,
                      fontSize: "13px",
                      letterSpacing: "0.04em",
                      color: "#0F2356",
                    }}
                  >
                    {p.num}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-12 md:col-span-4">
                  <h3
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(18px, 2vw, 24px)",
                      letterSpacing: "-0.02em",
                      color: "#0a0a0a",
                      lineHeight: "1.25",
                    }}
                  >
                    {p.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="col-span-12 md:col-span-7">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(15px, 1.3vw, 17px)",
                      color: "#3a3a3a",
                      lineHeight: "1.75",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs block */}
      <section className="py-24" style={{ background: "#0a0a0a" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <div className="col-span-12">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#717182",
                }}
              >
                Убеждения
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
                В работе я исхожу
                <br />
                из следующего
              </h2>
            </div>
          </div>

          <div className="flex flex-col">
            {beliefs.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-6 py-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  style={{
                    color: "#4a7aff",
                    fontSize: "18px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  —
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    color: "#e8e8e8",
                    lineHeight: "1.5",
                  }}
                >
                  {b.text}
                </span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
          </div>
        </div>
      </section>

      {/* Quote / Manifesto */}
      <section className="py-32" style={{ background: "#0F2356" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-10">
              <blockquote
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(24px, 3.5vw, 48px)",
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  lineHeight: "1.2",
                  borderLeft: "3px solid #4a7aff",
                  paddingLeft: "32px",
                  margin: 0,
                }}
              >
                Продукт — это не то, что вы делаете.
                Это то, как устроена система,
                которая создаёт ценность для клиента
                и доход для бизнеса.
              </blockquote>
            </div>
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
                Если это близко к тому,
                <br />
                как думаете вы — поговорим
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
                Диагностический созвон бесплатный. Разберёмся в вашей ситуации.
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
