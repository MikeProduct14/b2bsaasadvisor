import { useModal } from "../context/ModalContext";

const formats = [
  {
    name: "Growth Bottleneck Audit",
    price: "60 000 ₽",
    duration: "2 недели",
    deliverables: [
      "Карта ограничений роста",
      "Анализ метрик и воронки",
      "Финансовый приоритет инициатив",
      "План действий на 90 дней",
    ],
    accent: false,
  },
  {
    name: "Fractional Product Lead",
    price: "от 150 000 ₽ / мес",
    duration: "15–20 часов в неделю",
    deliverables: [
      "Управление продуктовым стримом",
      "Приоритизация и роадмап",
      "Работа с командой",
      "Рост ключевых метрик",
    ],
    accent: true,
  },
];

export function Formats() {
  const { openModal } = useModal();

  return (
    <section className="py-32" style={{ background: "#f8f8f8" }}>
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
            Форматы работы
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
            Два формата.
            <br />
            Один принцип.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-12 gap-6">
          {formats.map((f) => (
            <div
              key={f.name}
              className="col-span-12 lg:col-span-6 p-10 flex flex-col"
              style={{
                background: f.accent ? "#0F2356" : "#ffffff",
                border: f.accent ? "none" : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Format name */}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: f.accent ? "rgba(255,255,255,0.5)" : "#717182",
                  marginBottom: "16px",
                }}
              >
                {f.name}
              </div>

              {/* Price */}
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3vw, 40px)",
                  letterSpacing: "-0.03em",
                  color: f.accent ? "#ffffff" : "#0a0a0a",
                  lineHeight: "1.1",
                  marginBottom: "8px",
                }}
              >
                {f.price}
              </div>

              {/* Duration */}
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: f.accent ? "rgba(255,255,255,0.5)" : "#717182",
                  marginBottom: "40px",
                }}
              >
                {f.duration}
              </div>

              {/* Divider */}
              <div
                style={{
                  borderTop: f.accent
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(0,0,0,0.08)",
                  marginBottom: "32px",
                }}
              />

              {/* Deliverables */}
              <ul className="flex flex-col gap-4 flex-1">
                {f.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <span
                      style={{
                        color: f.accent ? "#4a7aff" : "#0F2356",
                        marginTop: "2px",
                        flexShrink: 0,
                        fontSize: "16px",
                      }}
                    >
                      →
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "15px",
                        color: f.accent ? "rgba(255,255,255,0.85)" : "#3a3a3a",
                        lineHeight: "1.5",
                      }}
                    >
                      {d}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-12">
                <button
                  onClick={openModal}
                  style={{
                    display: "inline-block",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: f.accent ? "#0F2356" : "#ffffff",
                    background: f.accent ? "#ffffff" : "#0F2356",
                    padding: "14px 28px",
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                      "0.85")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                  }
                >
                  Записаться →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
