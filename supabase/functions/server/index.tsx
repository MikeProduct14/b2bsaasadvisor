import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
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

// Health check endpoint
app.get("/make-server-52ecca80/health", (c) => {
  return c.json({ status: "ok" });
});

// Lead submission endpoint
app.post("/make-server-52ecca80/leads", async (c) => {
  try {
    const body = await c.req.json();
    const { name, telegram, phone, context } = body;

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
      phone: phone || "",
      context,
      submittedAt: new Date().toISOString(),
    };

    await kv.set(leadId, leadData);

    console.log(`Lead submission successful: ${leadId}`, leadData);

    return c.json({
      success: true,
      message: "Lead submitted successfully",
      leadId
    });
  } catch (error) {
    console.log(`Error submitting lead: ${error}`);
    return c.json(
      { error: `Failed to submit lead: ${error.message}` },
      500
    );
  }
});

// Get all leads endpoint (optional, for viewing submissions)
app.get("/make-server-52ecca80/leads", async (c) => {
  try {
    const leads = await kv.getByPrefix("lead_");
    return c.json({ leads, count: leads.length });
  } catch (error) {
    console.log(`Error fetching leads: ${error}`);
    return c.json(
      { error: `Failed to fetch leads: ${error.message}` },
      500
    );
  }
});

Deno.serve(app.fetch);