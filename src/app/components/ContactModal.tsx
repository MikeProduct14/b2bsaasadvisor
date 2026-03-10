import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "../context/ModalContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface FormData {
  name: string;
  telegram: string;
  phone: string;
  context: string;
}

async function submitLead(data: FormData): Promise<void> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-52ecca80/leads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit lead");
  }

  return response.json();
}

export function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSubmitError(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeModal]);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitLead(data);
      console.log("Lead submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting lead:", error);
      setSubmitError(error instanceof Error ? error.message : "Ошибка отправки");
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    closeModal();
    reset();
  }

  if (!isOpen) return null;

  const inputStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    fontWeight: 400,
    color: "#0a0a0a",
    background: "#f8f8f8",
    border: "1px solid rgba(0,0,0,0.1)",
    width: "100%",
    padding: "14px 16px",
    outline: "none",
    transition: "border-color 0.15s ease",
    borderRadius: 0,
  };

  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#717182",
    display: "block",
    marginBottom: "8px",
  };

  const errorStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    color: "#d4183d",
    marginTop: "5px",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,10,0.7)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          background: "#ffffff",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "0",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "36px 40px 28px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
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
                marginBottom: "10px",
              }}
            >
              Диагностический созвон
            </div>
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "24px",
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                lineHeight: "1.15",
              }}
            >
              Оставьте заявку
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#717182",
                marginTop: "8px",
                lineHeight: "1.5",
              }}
            >
              Свяжусь в течение 24 часов для подбора времени.
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#717182",
              fontSize: "22px",
              lineHeight: 1,
              flexShrink: 0,
              marginLeft: "16px",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 40px 40px" }}>
          {isSubmitSuccessful ? (
            /* Success state */
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#0F2356",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "22px",
                  color: "#ffffff",
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  fontSize: "22px",
                  letterSpacing: "-0.03em",
                  color: "#0a0a0a",
                  marginBottom: "12px",
                }}
              >
                Заявка отправлена
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "#717182",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Свяжусь с вами в течение 24 часов
                <br />и предложу удобное время для созвона.
              </p>
              <button
                onClick={handleClose}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  background: "#0F2356",
                  border: "none",
                  padding: "14px 32px",
                  cursor: "pointer",
                }}
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                {/* Name */}
                <div>
                  <label style={labelStyle}>Имя *</label>
                  <input
                    {...register("name", { required: "Введите имя" })}
                    placeholder="Александр"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#0F2356")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,0,0,0.1)")
                    }
                  />
                  {errors.name && (
                    <p style={errorStyle}>{errors.name.message}</p>
                  )}
                </div>

                {/* Telegram */}
                <div>
                  <label style={labelStyle}>Telegram *</label>
                  <input
                    {...register("telegram", {
                      required: "Введите Telegram",
                      pattern: {
                        value: /^@?[a-zA-Z0-9_]{3,}$/,
                        message: "Например: @username",
                      },
                    })}
                    placeholder="@username"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#0F2356")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,0,0,0.1)")
                    }
                  />
                  {errors.telegram && (
                    <p style={errorStyle}>{errors.telegram.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Телефон</label>
                  <input
                    {...register("phone")}
                    placeholder="+7 999 000 00 00"
                    type="tel"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#0F2356")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,0,0,0.1)")
                    }
                  />
                </div>

                {/* Context */}
                <div>
                  <label style={labelStyle}>Контекст / Проблема *</label>
                  <textarea
                    {...register("context", {
                      required: "Опишите задачу",
                      minLength: {
                        value: 20,
                        message: "Минимум 20 символов",
                      },
                    })}
                    placeholder="Кратко: что происходит с ростом, какой масштаб бизнеса, где видите узкое место..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "100px",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#0F2356")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,0,0,0.1)")
                    }
                  />
                  {errors.context && (
                    <p style={errorStyle}>{errors.context.message}</p>
                  )}
                </div>

                {/* Error message */}
                {submitError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      padding: "12px 16px",
                      borderRadius: "4px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: "#dc2626",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    letterSpacing: "0.02em",
                    color: "#ffffff",
                    background: isSubmitting ? "#717182" : "#0F2356",
                    border: "none",
                    padding: "16px 32px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s ease",
                    marginTop: "4px",
                    textAlign: "center",
                    width: "100%",
                  }}
                  onMouseEnter={(e) =>
                    !isSubmitting &&
                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                      "0.88")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                      "1")
                  }
                >
                  {isSubmitting ? "Отправка..." : "Отправить заявку →"}
                </button>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#adadb8",
                    textAlign: "center",
                    lineHeight: "1.5",
                  }}
                >
                  Первый созвон — диагностический. Без продаж.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
