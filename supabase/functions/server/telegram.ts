// Уведомления владельцу в Telegram. Секреты функции Supabase:
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather;
//   TELEGRAM_CHAT_ID   — чат, куда слать (личный chat_id владельца).
// Без секретов уведомления выключены, заявки сохраняются как раньше.

export interface LeadNotice {
  name: string;
  telegram: string;
  phone: string;
  context: string;
  page: string;
  submittedAt: string;
  suspectedSpam?: boolean;
}

// Telegram режет сообщения длиннее 4096 символов; оставляем запас на подписи полей.
const CONTEXT_LIMIT = 3000;
const SITE_URL = "https://www.productmike.ru";

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// «@ivan», «ivan», «t.me/ivan», «https://t.me/ivan» → ссылка на профиль.
// Всё остальное (номер, опечатка) показываем как есть.
export function telegramContact(raw: string): string {
  const value = raw.trim();
  const match = value.match(
    /^(?:@|(?:https?:\/\/)?(?:t\.me|telegram\.me)\/)?([A-Za-z][A-Za-z0-9_]{3,31})\/?$/,
  );
  if (!match) return escapeHtml(value);
  const username = match[1];
  return `<a href="https://t.me/${username}">@${username}</a>`;
}

export function formatMoscowTime(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso)) + " МСК";
}

export function formatLeadMessage(lead: LeadNotice): string {
  const context = lead.context.trim();
  const clipped = context.length > CONTEXT_LIMIT
    ? `${context.slice(0, CONTEXT_LIMIT)}… (обрезано, полный текст в Supabase)`
    : context;

  const lines = [
    ...(lead.suspectedSpam
      ? ["⚠️ <b>Возможно спам:</b> заполнено скрытое поле-ловушка. Если заявка живая — его заполнило автозаполнение браузера.", ""]
      : []),
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name.trim())}`,
    `<b>Telegram:</b> ${telegramContact(lead.telegram)}`,
  ];
  if (lead.phone.trim()) {
    lines.push(`<b>Телефон:</b> ${escapeHtml(lead.phone.trim())}`);
  }
  lines.push("", "<b>Запрос:</b>", escapeHtml(clipped), "");
  if (lead.page) {
    const page = escapeHtml(lead.page);
    lines.push(`<b>Страница:</b> <a href="${SITE_URL}${page}">${page}</a>`);
  }
  lines.push(`<b>Время:</b> ${formatMoscowTime(lead.submittedAt)}`);
  return lines.join("\n");
}

// Возвращает true, если Telegram принял сообщение. Не бросает исключений:
// заявка уже сохранена, и сбой Telegram не должен ломать ответ посетителю.
export async function sendToOwner(text: string): Promise<boolean> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.log("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      // Тело ответа Telegram не содержит токен; сам токен в лог не пишем.
      console.log(`Telegram notification failed: ${response.status} ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    // Сообщение об ошибке fetch в Deno содержит URL запроса, а в нём токен — вырезаем.
    const message = String(error instanceof Error ? error.message : error).replaceAll(token, "***");
    console.log(`Telegram notification failed: ${message}`);
    return false;
  }
}
