import { Link, useLoaderData, useParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useModal } from "../context/ModalContext";
import {
  formatDate,
  getPost,
  loadPostBody,
  postPath,
  relatedPosts,
  type PostBody,
} from "../blog/posts";
import { AUTHOR } from "../site";

export function blogPostLoader({ params }: LoaderFunctionArgs) {
  return loadPostBody(params.slug);
}

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#0F2356",
};

const sectionTitleStyle = {
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 800,
  fontSize: "clamp(22px, 2.4vw, 28px)",
  letterSpacing: "-0.02em",
  color: "#0a0a0a",
  lineHeight: "1.25",
  marginBottom: "20px",
};

export function BlogPost() {
  const { slug } = useParams();
  const body = useLoaderData() as PostBody | null;
  const post = getPost(slug);
  const { openModal } = useModal();

  if (!post || !body) {
    return (
      <div className="max-w-[760px] mx-auto px-6 pt-40 pb-32">
        <h1 style={{ ...sectionTitleStyle, fontSize: "36px" }}>Статья не найдена</h1>
        <Link to="/blog/" style={{ color: "#0F2356", fontFamily: "'Inter', sans-serif" }}>
          ← Все статьи
        </Link>
      </div>
    );
  }

  const related = relatedPosts(post);

  return (
    <div style={{ background: "#ffffff", paddingTop: "64px" }}>
      <article className="max-w-[760px] mx-auto px-6 pt-20 pb-24">
        {/* Breadcrumbs */}
        <nav
          aria-label="Хлебные крошки"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginBottom: "28px" }}
        >
          <Link to="/" style={{ color: "#717182", textDecoration: "none" }}>
            Главная
          </Link>
          {" / "}
          <Link to="/blog/" style={{ color: "#717182", textDecoration: "none" }}>
            Блог
          </Link>
        </nav>

        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(32px, 4.5vw, 52px)",
            letterSpacing: "-0.03em",
            color: "#0a0a0a",
            lineHeight: "1.1",
            marginBottom: "24px",
          }}
        >
          {post.title}
        </h1>

        <div
          className="flex flex-wrap gap-x-5 gap-y-1"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginBottom: "40px" }}
        >
          <span>{AUTHOR.name}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && post.updated !== post.date && (
            <span>
              обновлено <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
          <span>{post.readingMinutes} мин чтения</span>
        </div>

        {/* Summary */}
        <aside
          style={{
            background: "#f8f8f8",
            borderLeft: "3px solid #0F2356",
            padding: "24px 28px",
            marginBottom: "40px",
          }}
        >
          <div style={{ ...labelStyle, marginBottom: "14px" }}>Коротко</div>
          <ul className="flex flex-col gap-3">
            {post.summary.map((item) => (
              <li
                key={item}
                className="flex gap-3"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#0a0a0a", lineHeight: "1.55" }}
              >
                <span style={{ color: "#0F2356", flexShrink: 0 }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Table of contents */}
        {body.toc.length >= 3 && (
          <nav aria-label="Содержание" style={{ marginBottom: "48px" }}>
            <div style={{ ...labelStyle, color: "#717182", marginBottom: "12px" }}>Содержание</div>
            <ol className="flex flex-col gap-2" style={{ listStyle: "decimal", paddingLeft: "20px" }}>
              {body.toc.map((item) => (
                <li key={item.id} style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#717182" }}>
                  <a href={`#${item.id}`} style={{ color: "#0F2356", textDecoration: "none" }}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: body.html }} />

        {/* FAQ */}
        {post.faq.length > 0 && (
          <section style={{ marginTop: "64px" }}>
            <h2 id="faq" style={sectionTitleStyle}>
              Частые вопросы
            </h2>
            <div className="flex flex-col">
              {post.faq.map((item) => (
                <div key={item.q} className="py-5" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <h3
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#0a0a0a",
                      lineHeight: "1.35",
                      marginBottom: "8px",
                    }}
                  >
                    {item.q}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#3a3a3a", lineHeight: "1.65" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources */}
        <section style={{ marginTop: "56px" }}>
          <h2 id="sources" style={{ ...sectionTitleStyle, fontSize: "20px" }}>
            Источники
          </h2>
          <ol className="flex flex-col gap-2" style={{ listStyle: "decimal", paddingLeft: "20px" }}>
            {post.sources.map((source) => (
              <li key={source.url} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#717182", lineHeight: "1.5" }}>
                <a href={source.url} target="_blank" rel="noopener" style={{ color: "#0F2356" }}>
                  {source.title}
                </a>
                {source.publisher && <span> — {source.publisher}</span>}
                {source.date && <span>, {formatDate(source.date)}</span>}
              </li>
            ))}
          </ol>
        </section>

        {/* Author + CTA */}
        <section
          className="mt-16 p-8"
          style={{ background: "#0F2356", color: "#ffffff" }}
        >
          <div style={{ ...labelStyle, color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>Автор</div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "20px", marginBottom: "6px" }}>
            {AUTHOR.name}
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: "1.6",
              marginBottom: "24px",
            }}
          >
            {AUTHOR.bio}
          </p>
          <button
            onClick={openModal}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#0F2356",
              background: "#ffffff",
              border: "none",
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Разобрать мои процессы →
          </button>
        </section>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="pb-32">
          <div className="max-w-[760px] mx-auto px-6">
            <h2 style={sectionTitleStyle}>Читайте также</h2>
            {related.map((other) => (
              <Link
                key={other.slug}
                to={postPath(other.slug)}
                className="block py-5"
                style={{ borderTop: "1px solid rgba(0,0,0,0.08)", textDecoration: "none" }}
              >
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "18px", color: "#0a0a0a" }}>
                  {other.title}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#717182", marginTop: "4px" }}>
                  {formatDate(other.date)} · {other.readingMinutes} мин
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
