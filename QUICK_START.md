# Быстрый старт деплоя

## Вариант 1: Через Git (рекомендуется)

### 1. Установи Git
Скачай и установи: https://git-scm.com/download/win

### 2. Создай репозиторий на GitHub
- Зайди на https://github.com/new
- Название: `b2b-saas-advisor` (или любое другое)
- Публичный или приватный
- НЕ добавляй README, .gitignore, лицензию

### 3. Выполни команды в терминале проекта:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/b2b-saas-advisor.git
git push -u origin main
```

### 4. Настрой GitHub Pages
- Settings → Pages → Source: "GitHub Actions"

### 5. Готово!
Сайт будет доступен по адресу: `https://ВАШ_USERNAME.github.io/b2b-saas-advisor/`

---

## Вариант 2: Ручная загрузка (без Git)

### 1. Создай репозиторий на GitHub
- Зайди на https://github.com/new
- Создай репозиторий с README

### 2. Загрузи файлы
- Зайди в репозиторий
- Нажми "Add file" → "Upload files"
- Перетащи ВСЕ файлы проекта (кроме node_modules и dist)
- Commit changes

### 3. Настрой GitHub Pages
- Settings → Pages → Source: "GitHub Actions"

### 4. Готово!
GitHub Actions автоматически соберёт и задеплоит сайт.

---

## Важно!

После деплоя нужно будет обновить `base` в `vite.config.ts`:

Если репозиторий называется `b2b-saas-advisor`, замени:
```typescript
base: '/',
```

на:
```typescript
base: '/b2b-saas-advisor/',
```

И сделай повторный push/upload.
