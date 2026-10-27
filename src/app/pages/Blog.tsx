import { Link } from "react-router";
import { formatDate, postPath, posts } from "../blog/posts";

export function Blog() {
  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0F2356",
              marginBottom: "28px",
            }}
          >
            Блог
          </div>
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 5.5vw, 72px)",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              lineHeight: "1.05",
              marginBottom: "32px",
              maxWidth: "860px",
            }}
          >
            ИИ и автоматизация
            <br />
            <span style={{ color: "#0F2356" }}>на языке денег</span>
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(16px, 1.5vw, 20px)",
              color: "#717182",
              lineHeight: "1.7",
              maxWidth: "620px",
            }}
          >
            Разборы кейсов, расчёты и новости ИИ для собственников и
            руководителей. Без хайпа и техножаргона: прочитали — внедряете.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {posts.length === 0 && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "#717182",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                paddingTop: "40px",
              }}
            >
              Первые статьи готовятся.
            </p>
          )}
          {posts.map((post, idx) => (
            <article
              key={post.slug}
              className="grid grid-cols-12 gap-6 py-12"
              style={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                ...(idx === posts.length - 1
                  ? { borderBottom: "1px solid rgba(0,0,0,0.08)" }
                  : {}),
              }}
            >
              <div className="col-span-12 md:col-span-3">
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "#0a0a0a",
                  }}
                >
                  {formatDate(post.date)}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#717182",
                    marginTop: "4px",
                  }}
                >
                  {post.readingMinutes} мин чтения
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <h2
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                    marginBottom: "12px",
                  }}
                >
                  <Link
                    to={postPath(post.slug)}
                    style={{ color: "#0a0a0a", textDecoration: "none" }}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    color: "#3a3a3a",
                    lineHeight: "1.6",
                    maxWidth: "720px",
                  }}
                >
                  {post.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "#0F2356",
                        background: "#f3f5fa",
                        padding: "4px 10px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <p
            className="mt-10"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182" }}
          >
            Подписаться через{" "}
            <a href="/rss.xml" style={{ color: "#0F2356" }}>
              RSS
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
