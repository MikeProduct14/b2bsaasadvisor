import { useModal } from "../context/ModalContext";

export function Hero() {
  const { openModal } = useModal();

  return (
    <section
      className="min-h-screen flex flex-col justify-center pt-16"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-10 xl:col-span-9">
            {/* Label */}
            <div
              className="mb-10"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0F2356",
              }}
            >
              B2B SaaS · Product Consulting
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 6vw, 80px)",
                lineHeight: "1.05",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                marginBottom: "40px",
              }}
            >
              Убираю системные
              <br />
              ограничения роста
              <br />
              <span style={{ color: "#0F2356" }}>в B2B SaaS</span>
            </h1>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 mb-14">
              {[
                { value: "11+", label: "лет в продукте" },
                { value: "500", label: "подключений в сутки" },
                { value: "+113%", label: "рост ARPU" },
                { value: "3 млрд ₽", label: "ARR продуктов" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      letterSpacing: "-0.03em",
                      color: "#0a0a0a",
                      lineHeight: "1",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "#717182",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Subline */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(16px, 1.5vw, 20px)",
                color: "#3a3a3a",
                lineHeight: "1.6",
                maxWidth: "540px",
                marginBottom: "48px",
              }}
            >
              Если рост замедлился — проблема почти всегда
              <br className="hidden md:block" />
              в системе, а не в фичах.
            </p>

            {/* CTA Button */}
            <button
              onClick={openModal}
              style={{
                display: "inline-block",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "0.02em",
                color: "#ffffff",
                background: "#0F2356",
                padding: "16px 36px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#1a3a7a")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#0F2356")
              }
            >
              Записаться на диагностический созвон →
            </button>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          className="mt-24"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
        />
      </div>
    </section>
  );
}
