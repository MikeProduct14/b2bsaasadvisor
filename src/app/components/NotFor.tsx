const notFor = [
  "Стартапам на стадии идеи",
  "Инфобизнесу",
  "Компаниям без доступа к данным",
];

export function NotFor() {
  return (
    <section className="py-24" style={{ background: "#f8f8f8" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-4 mb-10 lg:mb-0">
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
              Честно
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3vw, 42px)",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.1",
              }}
            >
              Кому я
              <br />
              не подойду
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-col">
              {notFor.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-6 py-5"
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    ...(i === notFor.length - 1
                      ? { borderBottom: "1px solid rgba(0,0,0,0.08)" }
                      : {}),
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "18px",
                      color: "#d4183d",
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(16px, 1.5vw, 20px)",
                      color: "#3a3a3a",
                      lineHeight: "1.4",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
