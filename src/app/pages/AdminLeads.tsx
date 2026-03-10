import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

interface Lead {
  name: string;
  telegram: string;
  phone: string;
  context: string;
  submittedAt: string;
}

async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-52ecca80/leads`,
    {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  const data = await response.json();
  return data.leads || [];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        setLeads(data.sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchLeads()
      .then((data) => {
        setLeads(data.sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "120px 40px 80px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0F2356",
                marginBottom: "12px",
              }}
            >
              Админ-панель
            </div>
            <h1
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "48px",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.1",
              }}
            >
              Заявки
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "#717182",
                marginTop: "12px",
              }}
            >
              Всего заявок: <strong>{leads.length}</strong>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.02em",
              color: "#0F2356",
              background: "transparent",
              border: "2px solid #0F2356",
              padding: "12px 28px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              !loading && ((e.currentTarget.style.background = "#0F2356"), (e.currentTarget.style.color = "#ffffff"))
            }
            onMouseLeave={(e) =>
              ((e.currentTarget.style.background = "transparent"), (e.currentTarget.style.color = "#0F2356"))
            }
          >
            {loading ? "Загрузка..." : "Обновить"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: "#717182",
            }}
          >
            Загрузка заявок...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "20px 24px",
              borderRadius: "4px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "#dc2626",
              marginBottom: "32px",
            }}
          >
            Ошибка: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && leads.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                color: "#0a0a0a",
                marginBottom: "12px",
              }}
            >
              Заявок пока нет
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                color: "#717182",
                lineHeight: "1.6",
              }}
            >
              Когда кто-то оставит заявку через форму,
              <br />
              она появится здесь.
            </p>
          </div>
        )}

        {/* Leads Table */}
        {!loading && !error && leads.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    Дата
                  </th>
                  <th
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    Имя
                  </th>
                  <th
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    Telegram
                  </th>
                  <th
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    Телефон
                  </th>
                  <th
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#717182",
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    Контекст
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={index}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#fafafa",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        index % 2 === 0 ? "#ffffff" : "#fafafa")
                    }
                  >
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        color: "#717182",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(lead.submittedAt)}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0a0a0a",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {lead.name}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        color: "#0F2356",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <a
                        href={`https://t.me/${lead.telegram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0F2356",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {lead.telegram}
                      </a>
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        color: "#0a0a0a",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {lead.phone || "—"}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        color: "#0a0a0a",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        maxWidth: "400px",
                        lineHeight: "1.5",
                      }}
                    >
                      {lead.context}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
