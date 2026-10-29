# Блог и ИИ-блогер

## Как устроен блог

- Статьи лежат в `content/blog/<slug>.md`: frontmatter (заголовок, описание, ключи, «Коротко», FAQ, источники) + Markdown.
- При сборке (`npm run build`) каждая страница сайта и каждая статья превращается в готовый HTML
  с мета-тегами и schema.org (`scripts/prerender.mjs`). Поисковики и ИИ-краулеры видят текст без JavaScript.
- Сборка сама генерирует `sitemap.xml`, `robots.txt`, `rss.xml` и `llms.txt`.
- Сборка падает с понятной ошибкой, если во frontmatter чего-то не хватает (`plugins/blog.ts`).
- `draft: true` прячет статью с сайта.

## ИИ-блогер

Скилл `.claude/skills/ai-blogger/` для Claude Code. Он ищет тему на стыке болей аудитории, поискового
спроса и свежих новостей ИИ, пишет статью, проверяет факты по первоисточникам и открывает PR.
Статья попадает на сайт только после того, как вы сольёте PR.

Запуски:

- **По расписанию** — GitHub Actions, workflow `.github/workflows/ai-blogger.yml`: понедельник и четверг
  в 11:40 по Москве. Работает на подписке Claude через секрет `CLAUDE_CODE_OAUTH_TOKEN`
  (получить: `claude setup-token`). Результат — PR со статьёй; если GitHub не даёт Actions создавать PR,
  в сводке запуска будет ссылка, чтобы открыть его вручную.
- **Вручную** — Actions → AI blogger → Run workflow (можно указать тему) или `/ai-blogger` в сессии Claude Code.

Что блогер читает и обновляет:

| Файл | Зачем |
|---|---|
| `.claude/product-marketing.md` | Оффер, голос и **подтверждённые кейсы автора** — блогер цитирует только их |
| `content/seo/keywords.csv` | Семантическое ядро. Заполняйте колонку `wordstat_month` из Яндекс Вордстата |
| `content/seo/backlog.md` | Бэклог тем и их статусы |
| `.claude/skills/ai-blogger/references/` | Аудитория, стиль, источники, фактчек, SEO/GEO, формат статьи |

В помощь блогеру подключены open-source скиллы `copywriting`, `copy-editing`, `ai-seo`,
`content-strategy` и `humanizer` (лицензии — в `.claude/skills/THIRD_PARTY_NOTICES.md`).

## Что нужно для полноценной работы

1. **Доступ к сайтам-источникам.** Блогер открывает каждую страницу, на которую ссылается.
   В GitHub Actions интернет открыт. В облачной сессии Claude Code доступ настраивается
   в Network access (меню окружения → Edit); без него факты проверяются только по поисковой выдаче,
   и блогер помечает их в PR как непроверенные.
2. **Имя автора.** В `src/app/site.ts` замените `AUTHOR.name` на настоящее имя: подпись статьи
   и schema.org влияют на доверие поисковиков (E-E-A-T).
3. **Яндекс Вебмастер и Google Search Console.** Подтвердите сайт и отправьте `https://www.productmike.ru/sitemap.xml`.
