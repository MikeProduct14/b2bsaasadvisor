# Домен www.productmike.ru → GitHub Pages

Сайт собирается GitHub Actions (`.github/workflows/deploy.yml`) при каждом push в `main`
и публикуется на GitHub Pages. DNS-зона домена — на Beget.

## Если домен перестал открываться (например, после продления)

### 1. Beget: делегирование и DNS

1. Убедиться, что домен продлён и у него стоят NS Beget:
   `ns1.beget.com`, `ns2.beget.com`, `ns1.beget.pro`, `ns2.beget.pro`.
   После оплаты просроченного `.ru` делегирование восстанавливается само, обычно за несколько часов.
2. В «Управление DNS» для `productmike.ru` должны быть записи:

| Тип   | Имя   | Значение                  |
|-------|-------|---------------------------|
| A     | @     | 185.199.108.153           |
| A     | @     | 185.199.109.153           |
| A     | @     | 185.199.110.153           |
| A     | @     | 185.199.111.153           |
| CNAME | www   | mikeproduct14.github.io.  |

   Если для `www` есть A-запись на сервер Beget — удалить её, иначе CNAME не заработает.
   Опционально AAAA для `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`.

### 2. GitHub: Settings → Pages

1. Source: **GitHub Actions**.
2. Custom domain: `www.productmike.ru` → **Save**. Если поле уже заполнено, удалить домен,
   сохранить и ввести заново — это перезапускает проверку DNS и выпуск сертификата.
3. Дождаться зелёной галочки «DNS check successful» и включить **Enforce HTTPS**
   (сертификат выпускается от нескольких минут до суток).
4. Actions → «Deploy to GitHub Pages» → **Run workflow**, чтобы передеплоить.

### 3. Защита от перехвата домена (один раз)

Профиль GitHub → Settings → Pages → **Add a domain** → `productmike.ru`.
GitHub выдаст TXT-запись `_github-pages-challenge-MikeProduct14` — добавить её в DNS на Beget
и нажать Verify. После этого никто другой не сможет привязать домен к своему репозиторию,
даже если DNS временно отвалится.

### Проверка

```bash
nslookup www.productmike.ru   # должен вернуть mikeproduct14.github.io
nslookup productmike.ru       # 185.199.108-111.153
```

Файл `CNAME` в корне репозитория при деплое через Actions не используется —
домен задаётся только в Settings → Pages.
