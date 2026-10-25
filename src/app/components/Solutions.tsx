const solutions = [
  {
    num: "01",
    title: "Продажи и CRM",
    desc: "Квалификация и распределение лидов, мгновенный первый ответ, напоминания, автоматические КП и счета.",
  },
  {
    num: "02",
    title: "Заявки и заказы",
    desc: "Приём заказов из почты и мессенджеров, автоматическое создание в 1С или ERP, статусы для клиента без звонков менеджеру.",
  },
  {
    num: "03",
    title: "Документы и финансы",
    desc: "Счета, акты, сверки, ЭДО, проверки контрагентов и комплаенс — без ручного копирования.",
  },
  {
    num: "04",
    title: "Поддержка клиентов",
    desc: "AI-ассистент первой линии на базе знаний компании, маршрутизация обращений, контроль SLA.",
  },
  {
    num: "05",
    title: "Онбординг и найм",
    desc: "Подключение клиентов и сотрудников: анкеты, скоринг, Telegram-боты для массового найма.",
  },
  {
    num: "06",
    title: "Отчётность",
    desc: "Сквозные дашборды и ежедневная сводка собственнику вместо сборки Excel по пятницам.",
  },
];

const stack = [
  "n8n",
  "Make",
  "amoCRM",
  "Битрикс24",
  "1С",
  "Telegram",
  "ЭДО",
  "LLM-агенты",
  "RAG",
];

export function Solutions() {
  return (
    <section className="py-32" style={{ background: "#f8f8f8" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-20">
          <div className="col-span-12">
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
              Что я автоматизирую
            </span>
          </div>
          <div className="col-span-12 lg:col-span-8 mt-6">
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 4vw, 52px)",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.1",
              }}
            >
              Убираю ручную работу там,
              <br />
              где она стоит дороже всего
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.3vw, 18px)",
                color: "#3a3a3a",
                lineHeight: "1.6",
                maxWidth: "620px",
                marginTop: "24px",
              }}
            >
              Я не интегратор, который продаёт инструменты. Я продакт: сначала
              считаю, где автоматизация даст деньги, и только потом внедряю.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-12 gap-6">
          {solutions.map((s) => (
            <div
              key={s.num}
              className="col-span-12 sm:col-span-6 lg:col-span-4 p-8"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "36px",
                  letterSpacing: "-0.04em",
                  color: "#0F2356",
                  lineHeight: "1",
                  marginBottom: "24px",
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  letterSpacing: "-0.02em",
                  color: "#0a0a0a",
                  lineHeight: "1.3",
                  marginBottom: "12px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#717182",
                  lineHeight: "1.6",
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="mt-14 flex flex-wrap items-center gap-3">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#717182",
              marginRight: "8px",
            }}
          >
            Инструменты под задачу
          </span>
          {stack.map((tool) => (
            <span
              key={tool}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "#0a0a0a",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: "6px 12px",
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
