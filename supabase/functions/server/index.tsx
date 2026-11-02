import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { formatLeadMessage, sendToOwner } from "./telegram.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint. Читает базу, а не только отвечает «ok»: ежедневная проверка
// (.github/workflows/leads-healthcheck.yml) так замечает сбой базы и не даёт бесплатному
// проекту Supabase уйти на паузу из-за недели без запросов.
app.get("/make-server-52ecca80/health", async (c) => {
  try {
    await kv.get("healthcheck");
    return c.json({ status: "ok" });
  } catch (error) {
    console.log(`Health check failed: ${error instanceof Error ? error.message : error}`);
    return c.json({ status: "error" }, 500);
  }
});

// Предельные длины полей формы: защищают базу и сообщение в Telegram от мусора.
const LIMITS = { name: 200, telegram: 100, phone: 50, context: 5000, page: 200 };

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Lead submission endpoint
app.post("/make-server-52ecca80/leads", async (c) => {
  try {
    const body = (await c.req.json()) ?? {};

    // Ловушка для спам-ботов: поле скрыто от людей, боты заполняют все поля подряд.
    // Отвечаем как при успехе, чтобы бот не подбирал обход, но заявку не сохраняем.
    if (field(body.website, 200)) {
      console.log("Lead rejected by honeypot");
      return c.json({ success: true, message: "Lead submitted successfully" });
    }

    const name = field(body.name, LIMITS.name);
    const telegram = field(body.telegram, LIMITS.telegram);
    const phone = field(body.phone, LIMITS.phone);
    const context = field(body.context, LIMITS.context);
    const rawPage = field(body.page, LIMITS.page);
    const page = rawPage.startsWith("/") ? rawPage : "";

    // Validate required fields
    if (!name || !telegram || !context) {
      return c.json(
        { error: "Missing required fields: name, telegram, context" },
        400
      );
    }

    // Generate unique key for this lead
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store lead data
    const leadData = {
      name,
      telegram,
      phone,
      context,
      page,
      submittedAt: new Date().toISOString(),
    };

    await kv.set(leadId, leadData);

    console.log(`Lead submission successful: ${leadId}`);

    // Заявка уже сохранена: сбой Telegram только пишется в лог.
    await sendToOwner(formatLeadMessage(leadData));

    return c.json({
      success: true,
      message: "Lead submitted successfully",
      leadId
    });
  } catch (error) {
    console.log(`Error submitting lead: ${error}`);
    return c.json(
      { error: `Failed to submit lead: ${error instanceof Error ? error.message : error}` },
      500
    );
  }
});

// Чтения заявок через API нет: anon-ключ публичный, и любой мог бы скачать
// контакты клиентов. Заявки приходят в Telegram и лежат в таблице kv_store_52ecca80
// (Supabase → Table Editor).

Deno.serve(app.fetch);