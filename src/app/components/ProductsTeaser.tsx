import { Link } from "react-router";
import { products } from "../products";
import { StatusBadge } from "../pages/Products";

export function ProductsTeaser() {
  return (
    <section id="products" className="py-32" style={{ background: "#f8f8f8" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
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
              Свои продукты
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
              Что я собрал сам
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(15px, 1.3vw, 18px)",
                color: "#717182",
                lineHeight: "1.6",
                maxWidth: "560px",
                marginTop: "20px",
              }}
            >
              От гипотезы до работающей версии — с Claude Code и Codex.
            </p>
          </div>
          <Link
            to="/products/"
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
            Все продукты →
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              to={`/products/#${product.slug}`}
              className="col-span-12 md:col-span-6 lg:col-span-4 p-8 flex flex-col"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                textDecoration: "none",
              }}
            >
              <div className="mb-5">
                <StatusBadge status={product.status} />
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "#717182",
                  marginBottom: "8px",
                }}
              >
                {product.kicker}
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 700,
                  fontSize: "19px",
                  letterSpacing: "-0.02em",
                  color: "#0a0a0a",
                  lineHeight: "1.3",
                  marginBottom: "12px",
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "#717182",
                  lineHeight: "1.6",
                }}
              >
                {product.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
