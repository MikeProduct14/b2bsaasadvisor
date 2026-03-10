const problems = [
  "Рост упёрся в онбординг",
  "Нет прозрачной юнит-экономики",
  "Retention нестабилен",
  "Команда перегружена фичами без эффекта",
  "Масштабирование увеличивает хаос",
];

export function Problems() {
  return (
    <section className="py-32" style={{ background: "#0a0a0a" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Label */}
          <div className="col-span-12 mb-16">
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
              С какими задачами ко мне приходят
            </span>
          </div>

          {/* Title */}
          <div className="col-span-12 lg:col-span-5 mb-16 lg:mb-0">
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 4vw, 52px)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: "1.1",
              }}
            >
              Симптомы
              <br />
              одинаковые.
              <br />
              <span style={{ color: "#4a7aff" }}>Причина — одна.</span>
            </h2>
          </div>

          {/* Problems list */}
          <div className="col-span-12 lg:col-span-7">
            <div>
              {problems.map((problem, i) => (
                <div
                  key={problem}
                  className="flex items-start gap-6 py-6"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                      color: "#4a7aff",
                      minWidth: "28px",
                      marginTop: "2px",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(16px, 1.5vw, 20px)",
                      color: "#e8e8e8",
                      lineHeight: "1.4",
                    }}
                  >
                    {problem}
                  </span>
                </div>
              ))}
              {/* Last border */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            <p
              className="mt-10"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                color: "#717182",
                letterSpacing: "0",
              }}
            >
              Я работаю не с симптомами, а с ограничением системы.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
