import { useModal } from "../context/ModalContext";
import { products, statusLabel, type Product, type ProductStatus } from "../products";

const statusColors: Record<ProductStatus, { color: string; background: string }> = {
  live: { color: "#14532d", background: "#e8f5ec" },
  shipped: { color: "#14532d", background: "#e8f5ec" },
  hypothesis: { color: "#7c4a03", background: "#fdf3e1" },
  "in-progress": { color: "#0F2356", background: "#f3f5fa" },
  prototype: { color: "#3a3a3a", background: "#f0f0f0" },
};

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#717182",
};

const bodyStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: "15px",
  color: "#3a3a3a",
  lineHeight: "1.6",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const colors = statusColors[status];
  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        fontSize: "12px",
        letterSpacing: "0.02em",
        color: colors.color,
        background: colors.background,
        padding: "4px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {statusLabel[status]}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article
      id={product.slug}
      className="grid grid-cols-12 gap-6 py-14"
      style={{ borderTop: "1px solid rgba(0,0,0,0.08)", scrollMarginTop: "80px" }}
    >
      {/* Name + status + facts */}
      <div className="col-span-12 md:col-span-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusBadge status={product.status} />
          <span style={{ ...labelStyle, letterSpacing: "0.04em" }}>{product.kicker}</span>
        </div>
        <h2
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 2.4vw, 28px)",
            letterSpacing: "-0.02em",
            color: "#0a0a0a",
            lineHeight: "1.2",
            marginBottom: "12px",
          }}
        >
          {product.name}
        </h2>
        <p style={{ ...bodyStyle, color: "#717182" }}>{product.summary}</p>

        <div className="flex flex-wrap gap-x-8 gap-y-6 mt-8">
          {product.facts.map((fact) => (
            <div key={fact.label}>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 3.4vw, 44px)",
                  letterSpacing: "-0.04em",
                  color: "#0F2356",
                  lineHeight: "1",
                }}
              >
                {fact.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "#0a0a0a",
                  marginTop: "4px",
                }}
              >
                {fact.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem + what was built */}
      <div className="col-span-12 md:col-span-8 md:pl-8">
        <span style={labelStyle}>Задача</span>
        <p style={{ ...bodyStyle, color: "#0a0a0a", marginTop: "6px" }}>{product.problem}</p>

        <div className="mt-6">
          <span style={labelStyle}>Что сделано</span>
          <ul className="mt-2 flex flex-col gap-2">
            {product.built.map((item) => (
              <li key={item} className="flex gap-3" style={bodyStyle}>
                <span style={{ color: "#0F2356" }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {product.next && (
          <div className="mt-6">
            <span style={labelStyle}>Дальше</span>
            <p style={{ ...bodyStyle, marginTop: "6px" }}>{product.next}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {product.stack.map((tool) => (
            <span
              key={tool}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                color: "#0F2356",
                background: "#f3f5fa",
                padding: "4px 10px",
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {product.link && (
          <a
            href={product.link.href}
            target="_blank"
            rel="noopener"
            className="inline-block mt-8"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#0F2356",
              textDecoration: "none",
              border: "1px solid #0F2356",
              padding: "12px 24px",
            }}
          >
            {product.link.label} ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function Products() {
  const { openModal } = useModal();

  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      <section className="pt-24 pb-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0F2356",
              marginBottom: "28px",
            }}
          >
            Продукты
          </div>
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 5.5vw, 72px)",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              lineHeight: "1.05",
              marginBottom: "28px",
              maxWidth: "820px",
            }}
          >
            Что я собрал сам
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              color: "#717182",
              lineHeight: "1.6",
              maxWidth: "640px",
            }}
          >
            Продукты и прототипы, которые я довёл от гипотезы до работающей версии вместе
            с Claude Code и Codex. Честный статус у каждого: что работает, что проверяет
            гипотезу, что ещё в работе.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }} />
        </div>
      </section>

      <section className="py-24" style={{ background: "#0F2356" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-8">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              color: "#ffffff",
              lineHeight: "1.2",
              maxWidth: "640px",
            }}
          >
            Нужен такой же MVP или автоматизация под вашу задачу?
          </p>
          <button
            onClick={openModal}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#0F2356",
              background: "#ffffff",
              border: "none",
              padding: "16px 28px",
              cursor: "pointer",
            }}
          >
            Обсудить задачу
          </button>
        </div>
      </section>
    </div>
  );
}
