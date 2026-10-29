# Частотность из Вордстата

Частотность ключей в `keywords.csv` (колонка `wordstat_month`) берётся из Wordstat API в составе
Yandex Search API (AI Studio). Старый API Вордстата (`api.wordstat.yandex.net`) закрыт, его возможности
перенесены в Search API. Число — запросы со всеми словами фразы за последние 30 дней, по всем регионам.

## Настройка (один раз)

1. Войдите в [Yandex AI Studio](https://aistudio.yandex.ru/) и в [консоли Yandex Cloud](https://console.yandex.cloud/)
   откройте каталог (folder). Его ID — в адресе страницы и в карточке каталога, вида `b1g...`.
2. В этом каталоге создайте сервисный аккаунт с ролью `search-api.webSearch.user` и API-ключ к нему
   с областью действия `yc.search-api.execute`. Ключ показывается один раз, при создании.
   Client ID и Client Secret от старого API Вордстата (OAuth-приложение) не нужны.
3. В репозитории: Settings → Secrets and variables → Actions → New repository secret:
   - `YANDEX_SEARCH_API_KEY` — API-ключ;
   - `YANDEX_FOLDER_ID` — ID каталога.

## Как пользоваться

- Actions → **Wordstat frequency** → Run workflow: заполнит пустые `wordstat_month` и откроет PR.
  Галочка «Обновить частотность у всех ключей» пересчитает все строки. Второго числа каждого месяца
  частотность обновляется сама.
- ИИ-блогер при запуске проверяет спрос по своим ключам тем же скриптом.
- Локально: `YANDEX_SEARCH_API_KEY=... YANDEX_FOLDER_ID=... node scripts/wordstat.mjs "фраза"` —
  частотность, топ формулировок и похожие запросы.

Операторы Вордстата (`!слово`, `[слово]`, `"фраза"`) API не поддерживает: для точной частотности
формулировки смотрите в веб-интерфейсе wordstat.yandex.ru.
