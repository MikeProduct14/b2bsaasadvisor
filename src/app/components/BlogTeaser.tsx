import { Link } from "react-router";
import { formatDate, postPath, posts } from "../blog/posts";

export function BlogTeaser() {
  if (posts.length === 0) return null;
  const latest = posts.slice(0, 3);

  return (
    <section className="py-32" style={{ background: "#ffffff" }}>
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
              Блог
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
              Свежие разборы
            </h2>
          </div>
          <Link
            to="/blog/"
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
            Все статьи →
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {latest.map((post) => (
            <Link
              key={post.slug}
              to={postPath(post.slug)}
              className="col-span-12 md:col-span-4 p-8 flex flex-col"
              style={{
                background: "#f8f8f8",
                border: "1px solid rgba(0,0,0,0.06)",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "#717182",
                  marginBottom: "16px",
                }}
              >
                {formatDate(post.date)} · {post.readingMinutes} мин
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
                {post.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "#717182",
                  lineHeight: "1.6",
                }}
              >
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
