# Заявки и Telegram-бот

Форма «Обсудить задачу» (`src/app/components/ContactModal.tsx`) отправляет заявку в функцию Supabase
`make-server-52ecca80` (код — `supabase/functions/server/`). Функция сохраняет заявку в таблицу
`kv_store_52ecca80` и сразу присылает её владельцу в Telegram: имя, Telegram (кликабельный), телефон,
текст запроса, страница, с которой отправили заявку, и время по Москве.

Где смотреть заявки:

- **Telegram** — каждая новая заявка приходит сообщением от бота.
- **Supabase** → Table Editor → `kv_store_52ecca80`
  (https://supabase.com/dashboard/project/bxokwgejreqeraxlhwqd/database/tables) — все заявки, включая старые.

Публичного API и страницы для чтения заявок нет: ключ Supabase в коде сайта виден всем,
и через них любой мог бы скачать контакты клиентов.

Если Telegram недоступен, заявка всё равно сохраняется, а ошибка пишется в логи функции
(Supabase → Edge Functions → `make-server-52ecca80` → Logs).

## Подключение бота (один раз)

1. **Создать бота.** В Telegram откройте @BotFather → `/newbot` → придумайте имя и username.
   BotFather пришлёт токен вида `123456789:AA...` — это `TELEGRAM_BOT_TOKEN`. Никому его не пересылайте.
2. **Разрешить боту писать вам.** Найдите своего бота по username и нажмите «Запустить» (`/start`).
   Без этого Telegram не даст боту отправить вам сообщение.
3. **Узнать chat_id.** Откройте в браузере `https://api.telegram.org/bot<токен>/getUpdates`
   (вместо `<токен>` — токен из шага 1). В ответе найдите `"chat":{"id":123456789` — это число
   и есть `TELEGRAM_CHAT_ID`. Если ответ пустой (`"result":[]`), напишите боту любое сообщение
   и обновите страницу.
4. **Токен Supabase.** https://supabase.com/dashboard/account/tokens → Generate new token.
   Это `SUPABASE_ACCESS_TOKEN`: с ним GitHub выкладывает функцию.
5. **Секреты в GitHub.** Репозиторий → Settings → Secrets and variables → Actions →
   New repository secret. Добавьте три секрета: `SUPABASE_ACCESS_TOKEN`, `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHAT_ID`.
6. **Выложить и проверить.** Actions → Deploy Supabase function → Run workflow. Workflow передаст
   секреты Telegram в Supabase, выложит функцию и пришлёт тестовое сообщение «Бот подключён».
   После этого отправьте тестовую заявку с сайта — она должна прийти в Telegram за несколько секунд.

Дальше функция выкладывается сама при каждом изменении `supabase/` в `main`
(`.github/workflows/supabase-functions.yml`).

## Защита от спама

В форме есть скрытое поле-ловушка: человек его не видит, а спам-бот заполняет. Такие заявки функция
не сохраняет и в Telegram не присылает, а боту отвечает «успешно». Если спам всё же пойдёт,
следующий шаг — ограничение частоты заявок с одного IP.
