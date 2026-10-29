// Частотность ключей из Вордстата через Yandex Search API (AI Studio).
//
//   node scripts/wordstat.mjs                 заполнить пустые wordstat_month в content/seo/keywords.csv
//   node scripts/wordstat.mjs --all           обновить частотность у всех ключей
//   node scripts/wordstat.mjs "фраза" [...]   показать частотность, топ формулировок и ассоциации
//
// Нужны переменные окружения YANDEX_SEARCH_API_KEY (API-ключ сервисного аккаунта) и YANDEX_FOLDER_ID.
// Необязательно: WORDSTAT_REGIONS — ID регионов через запятую (225 — Россия); по умолчанию все регионы.
// Частотность — число запросов со всеми словами фразы за последние 30 дней (широкое соответствие).
// Настройка ключа: content/seo/wordstat.md.
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://searchapi.api.cloud.yandex.net/v2/wordstat";
const CSV_PATH = path.join(process.cwd(), "content/seo/keywords.csv");
const PAUSE_MS = 250;

const apiKey = process.env.YANDEX_SEARCH_API_KEY;
const folderId = process.env.YANDEX_FOLDER_ID;
const regions = (process.env.WORDSTAT_REGIONS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function topRequests(phrase, numPhrases = 10) {
  const body = { phrase, numPhrases, folderId };
  if (regions.length) body.regions = regions;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/topRequests`, {
      method: "POST",
      headers: { Authorization: `Api-Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 429 && attempt < 5) {
      await sleep(2000 * attempt);
      continue;
    }
    const text = await res.text();
    if (!res.ok) throw new Error(`Wordstat ${res.status} для «${phrase}»: ${text.slice(0, 300)}`);
    const data = JSON.parse(text);
    // int64 из gRPC приходят строками.
    const toRows = (list) => (list ?? []).map((r) => ({ phrase: r.phrase, count: Number(r.count) }));
    return { total: Number(data.totalCount ?? 0), results: toRows(data.results), associations: toRows(data.associations) };
  }
}

// CSV без внешних библиотек: кавычки, запятые и переводы строк внутри полей.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

const csvField = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const toCsv = (rows) => rows.map((r) => r.map(csvField).join(",")).join("\n") + "\n";

function requireCredentials() {
  if (!apiKey || !folderId) {
    console.error(
      "Нет YANDEX_SEARCH_API_KEY или YANDEX_FOLDER_ID. Как получить ключ и folder ID — content/seo/wordstat.md.",
    );
    process.exit(1);
  }
}

async function showPhrases(phrases) {
  for (const phrase of phrases) {
    const { total, results, associations } = await topRequests(phrase);
    console.log(`\n«${phrase}» — ${total} запросов за 30 дней`);
    if (results.length) console.log("Формулировки:\n" + results.map((r) => `  ${r.count}\t${r.phrase}`).join("\n"));
    if (associations.length)
      console.log("Похожие запросы:\n" + associations.map((r) => `  ${r.count}\t${r.phrase}`).join("\n"));
    await sleep(PAUSE_MS);
  }
}

async function fillCsv(refreshAll) {
  const rows = parseCsv(await fs.readFile(CSV_PATH, "utf8"));
  const header = rows[0];
  const kw = header.indexOf("keyword");
  const freq = header.indexOf("wordstat_month");
  if (kw < 0 || freq < 0) throw new Error("В keywords.csv нет колонок keyword и wordstat_month");

  let updated = 0;
  for (const row of rows.slice(1)) {
    if (!row[kw] || (!refreshAll && row[freq])) continue;
    const { total } = await topRequests(row[kw], 1);
    row[freq] = String(total);
    updated++;
    console.log(`${String(total).padStart(8)}  ${row[kw]}`);
    await sleep(PAUSE_MS);
  }
  await fs.writeFile(CSV_PATH, toCsv(rows));
  console.log(`\nОбновлено ключей: ${updated}`);
}

const args = process.argv.slice(2);
requireCredentials();
if (args.length && args[0] !== "--all") await showPhrases(args);
else await fillCsv(args[0] === "--all");
