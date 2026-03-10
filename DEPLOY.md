# Инструкция по деплою на GitHub Pages

## Шаг 1: Создать репозиторий на GitHub

1. Зайди на https://github.com/new
2. Создай новый репозиторий (например, `b2b-saas-advisor`)
3. Сделай его публичным или приватным (оба варианта работают)
4. НЕ добавляй README, .gitignore или лицензию (они уже есть в проекте)

## Шаг 2: Инициализировать Git и загрузить код

Выполни команды в терминале:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

## Шаг 3: Настроить GitHub Pages

1. Зайди в Settings репозитория
2. Перейди в раздел "Pages" (слева в меню)
3. В разделе "Build and deployment":
   - Source: выбери "GitHub Actions"
4. Сохрани настройки

## Шаг 4: Деплой

После push в main ветку:
- GitHub Actions автоматически соберёт проект
- Задеплоит на GitHub Pages
- Сайт будет доступен по адресу: `https://ВАШ_USERNAME.github.io/ВАШ_РЕПОЗИТОРИЙ/`

## Проверка деплоя

1. Зайди во вкладку "Actions" в репозитории
2. Дождись завершения workflow "Deploy to GitHub Pages"
3. Если всё зелёное ✅ — сайт задеплоен!

## Обновление сайта

Просто делай изменения и push:
```bash
git add .
git commit -m "Update site"
git push
```

GitHub Pages автоматически обновится.
