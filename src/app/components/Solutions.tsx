const solutions = [
  {
    num: "01",
    title: "Найти точку ограничения роста",
    desc: "Системный анализ воронки, метрик и процессов. Не гипотезы — диагностика.",
  },
  {
    num: "02",
    title: "Перестроить онбординг и монетизацию",
    desc: "Реинжиниринг CJM, тарифной логики и механик активации.",
  },
  {
    num: "03",
    title: "Выстроить продуктовую систему",
    desc: "Процессы, приоритизация, юнит-экономика — всё, что позволяет масштабироваться без хаоса.",
  },
  {
    num: "04",
    title: "Приоритизировать инициативы по ROI",
    desc: "Финансовый вес каждого решения. Только то, что двигает ключевые метрики.",
  },
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
              Что я делаю
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
              Помогаю B2B SaaS-компаниям
              <br />
              расти системно
            </h2>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-12 gap-6">
          {solutions.map((s) => (
            <div
              key={s.num}
              className="col-span-12 sm:col-span-6 lg:col-span-3 p-8"
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
      </div>
    </section>
  );
}
