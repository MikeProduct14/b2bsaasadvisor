const steps = [
  {
    num: "01",
    title: "Разбор процессов",
    desc: "Интервью с собственником и командой. Смотрим, как на самом деле движутся заявки, документы и деньги.",
  },
  {
    num: "02",
    title: "Замер и расчёт ROI",
    desc: "Считаем, сколько часов и рублей уходит на ручные операции. Выбираем, что автоматизировать первым.",
  },
  {
    num: "03",
    title: "Пилот на узком месте",
    desc: "Запускаем автоматизацию на реальных данных и замеряем эффект до того, как масштабировать.",
  },
  {
    num: "04",
    title: "Масштабирование",
    desc: "Раскатываем на весь процесс, обучаем команду, передаём документацию и поддержку.",
  },
];

export function Process() {
  return (
    <section className="py-32" style={{ background: "#ffffff" }}>
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
              Как проходит работа
            </span>
          </div>
          <div className="col-span-12 lg:col-span-7 mt-6">
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
              4 этапа.
              <br />
              От аудита до результата.
            </h2>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-12 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "56px",
                  letterSpacing: "-0.05em",
                  color: "#ececf0",
                  lineHeight: "1",
                  marginBottom: "20px",
                }}
              >
                {step.num}
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "32px",
                  height: "2px",
                  background: "#0F2356",
                  marginBottom: "20px",
                }}
              />

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  letterSpacing: "-0.02em",
                  color: "#0a0a0a",
                  lineHeight: "1.3",
                  marginBottom: "12px",
                }}
              >
                {step.title}
              </h3>

              {/* Desc */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#717182",
                  lineHeight: "1.6",
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
