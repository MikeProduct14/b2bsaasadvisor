export function Footer() {
  return (
    <footer
      className="py-10"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}
        >
          B2B SaaS Advisor
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "#717182",
          }}
        >
          © 2026 · Продуктовый консалтинг для B2B SaaS
        </span>
      </div>
    </footer>
  );
}
