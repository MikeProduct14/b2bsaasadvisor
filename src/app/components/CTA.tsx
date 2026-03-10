import { useModal } from "../context/ModalContext";

export function CTA() {
  const { openModal } = useModal();

  return (
    <section
      id="cta"
      className="py-40"
      style={{ background: "#0F2356" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            {/* Label */}
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "32px",
              }}
            >
              Следующий шаг
            </div>

            {/* Headline */}
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 68px)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: "1.05",
                marginBottom: "24px",
              }}
            >
              Если вам нужен
              <br />
              системный взгляд на рост,
              <br />
              а не ещё один список гипотез
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.5vw, 18px)",
                color: "rgba(255,255,255,0.6)",
                lineHeight: "1.6",
                marginBottom: "52px",
                maxWidth: "480px",
              }}
            >
              Первый созвон — диагностический. Без продаж.
              <br />
              Разберёмся, есть ли смысл работать вместе.
            </p>

            {/* CTA Button */}
            <button
              onClick={openModal}
              style={{
                display: "inline-block",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "0.02em",
                color: "#0F2356",
                background: "#ffffff",
                padding: "18px 44px",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              Записаться на диагностический созвон →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
