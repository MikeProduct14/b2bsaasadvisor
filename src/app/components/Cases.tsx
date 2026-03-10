const cases = [
  {
    industry: "FinTech",
    tag: "100k+ клиентов · 3 млрд ₽ ARR",
    problem: "Ограничение масштабирования подключения",
    action: "Реинжиниринг процесса, автоскоринг, перестройка взаимодействия команд",
    metrics: [
      { value: "500", unit: "подключений/сутки", prev: "↑ с 150" },
    ],
  },
  {
    industry: "B2B e-commerce",
    tag: "Enterprise",
    problem: "Низкая доходность",
    action: "Пересборка CJM, товарного микса, механики продвижения",
    metrics: [
      { value: "+113%", unit: "рост ARPU", prev: "220k → 470k ₽" },
      { value: "+160%", unit: "Purchase Frequency", prev: "" },
    ],
  },
  {
    industry: "EdTech",
    tag: "Growth stage",
    problem: "Длинный time-to-onboarding",
    action: "Реструктуризация пользовательского пути и анкеты активации",
    metrics: [
      { value: "6 ч", unit: "time-to-onboarding", prev: "↓ с 5 дней" },
      { value: "+15 п.п.", unit: "CR анкеты", prev: "" },
    ],
  },
];

export function Cases() {
  return (
    <section className="py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20">
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
        </div>

        {/* Cases */}
        <div className="flex flex-col gap-0">
          {cases.map((c, idx) => (
            <div
              key={c.industry}
              className="grid grid-cols-12 gap-6 py-14"
              style={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                ...(idx === cases.length - 1
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

              {/* Problem + Action */}
              <div className="col-span-12 md:col-span-5">
                <div className="mb-3">
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                    }}
                  >
                    Проблема
                  </span>
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
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                    }}
                  >
                    Действие
                  </span>
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
              </div>

              {/* Metrics */}
              <div className="col-span-12 md:col-span-4 flex flex-wrap gap-8 items-start justify-start md:justify-end">
                {c.metrics.map((m) => (
                  <div key={m.unit} className="text-right">
                    <div
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(36px, 4vw, 52px)",
                        letterSpacing: "-0.04em",
                        color: "#0F2356",
                        lineHeight: "1",
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
      </div>
    </section>
  );
}
