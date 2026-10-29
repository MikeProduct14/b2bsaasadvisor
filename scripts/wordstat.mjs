// Частотность ключей из Вордстата через Yandex Search API (AI Studio).
//
//   node scripts/wordstat.mjs                 заполнить пустые wordstat_month в content/seo/keywords.csv
//   node scripts/wordstat.mjs --all           ещё и обновить частотность старше 25 дней, начиная с самой старой
//   node scripts/wordstat.mjs "фраза" [...]   показать частотность, топ формулировок и ассоциации
//
// Нужны переменные окружения YANDEX_SEARCH_API_KEY (API-ключ сервисного аккаунта) и YANDEX_FOLDER_ID.
// Необязательно: WORDSTAT_REGIONS — ID регионов через запятую (225 — Россия); по умолчанию все регионы;
// WORDSTAT_MAX_REQUESTS — сколько ключей обновить за запуск (по умолчанию 90).
// Частотность — число запросов со всеми словами фразы за последние 30 дней (широкое соответствие).
// Яндекс пускает не больше 100 запросов к Вордстату в час: остаток ключей заполнит следующий запуск,
// а дата проверки каждого ключа хранится в content/seo/wordstat-checked.json.
// Настройка ключа: content/seo/wordstat.md.
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://searchapi.api.cloud.yandex.net/v2/wordstat";
const CSV_PATH = path.join(process.cwd(), "content/seo/keywords.csv");
const CHECKED_PATH = path.join(process.cwd(), "content/seo/wordstat-checked.json");
const PAUSE_MS = 250;
const STALE_DAYS = 25;
const maxRequests = Number(process.env.WORDSTAT_MAX_REQUESTS ?? 90);

const apiKey = process.env.YANDEX_SEARCH_API_KEY;
const folderId = process.env.YANDEX_FOLDER_ID;
const regions = (process.env.WORDSTAT_REGIONS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Исчерпана часовая квота Вордстата: ждать бессмысленно, следующий запуск продолжит. */
class QuotaExceeded extends Error {}

async function topRequests(phrase, numPhrases = 10) {
  const body = { phrase, numPhrases, folderId };
  if (regions.length) body.regions = regions;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/topRequests`, {
      method: "POST",
      headers: { Authorization: `Api-Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (res.status === 429 && /PerHour/i.test(text)) throw new QuotaExceeded(text.slice(0, 200));
    if (res.status === 429 && attempt < 5) {
      await sleep(2000 * attempt);
      continue;
    }
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

async function readChecked() {
  try {
    return JSON.parse(await fs.readFile(CHECKED_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function fillCsv(refreshStale) {
  const rows = parseCsv(await fs.readFile(CSV_PATH, "utf8"));
  const header = rows[0];
  const kw = header.indexOf("keyword");
  const freq = header.indexOf("wordstat_month");
  if (kw < 0 || freq < 0) throw new Error("В keywords.csv нет колонок keyword и wordstat_month");
  const checked = await readChecked();
  const today = new Date().toISOString().slice(0, 10);
  const staleBefore = new Date(Date.now() - STALE_DAYS * 864e5).toISOString().slice(0, 10);

  // Сначала ключи без частотности, затем (с --all) давно не проверенные, самые старые первыми.
  const data = rows.slice(1).filter((row) => row[kw]);
  const empty = data.filter((row) => !row[freq]);
  const stale = refreshStale
    ? data
        .filter((row) => row[freq] && (checked[row[kw]] ?? "") < staleBefore)
        .sort((a, b) => (checked[a[kw]] ?? "").localeCompare(checked[b[kw]] ?? ""))
    : [];
  const queue = [...empty, ...stale];

  let updated = 0;
  try {
    for (const row of queue.slice(0, maxRequests)) {
      const { total } = await topRequests(row[kw], 1);
      row[freq] = String(total);
      checked[row[kw]] = today;
      updated++;
      console.log(`${String(total).padStart(8)}  ${row[kw]}`);
      await sleep(PAUSE_MS);
    }
  } catch (err) {
    if (!(err instanceof QuotaExceeded)) throw err;
    console.log(`\nЧасовая квота Вордстата исчерпана: ${err.message}`);
  } finally {
    // Сохраняем то, что успели собрать, даже если запуск оборвался.
    await fs.writeFile(CSV_PATH, toCsv(rows));
    const sorted = Object.fromEntries(Object.entries(checked).sort(([a], [b]) => a.localeCompare(b, "ru")));
    await fs.writeFile(CHECKED_PATH, JSON.stringify(sorted, null, 2) + "\n");
  }
  const left = queue.length - updated;
  console.log(`\nОбновлено ключей: ${updated}${left ? `, осталось на следующий запуск: ${left}` : ""}`);
}

const args = process.argv.slice(2);
requireCredentials();
if (args.length && args[0] !== "--all") await showPhrases(args);
else await fillCsv(args[0] === "--all");
