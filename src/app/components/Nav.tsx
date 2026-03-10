import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useModal } from "../context/ModalContext";

export function Nav() {
  const { openModal } = useModal();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Philosophy", to: "/philosophy" },
    { label: "Масштаб", to: "/scale" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "-0.02em",
            color: "#0a0a0a",
            textDecoration: "none",
          }}
        >
          B2B SaaS Advisor
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                letterSpacing: "0.02em",
                color: isActive(link.to) ? "#0F2356" : "#717182",
                textDecoration: "none",
                borderBottom: isActive(link.to)
                  ? "1px solid #0F2356"
                  : "1px solid transparent",
                paddingBottom: "1px",
                transition: "color 0.15s ease",
              }}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={openModal}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.04em",
              color: "#ffffff",
              background: "#0F2356",
              border: "none",
              padding: "9px 20px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
          >
            Записаться
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#0a0a0a",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform:
                  menuOpen && i === 0
                    ? "translateY(6.5px) rotate(45deg)"
                    : menuOpen && i === 2
                    ? "translateY(-6.5px) rotate(-45deg)"
                    : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            padding: "16px 24px 24px",
          }}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  color: isActive(link.to) ? "#0F2356" : "#3a3a3a",
                  textDecoration: "none",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                openModal();
              }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#ffffff",
                background: "#0F2356",
                border: "none",
                padding: "14px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Записаться на созвон →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
