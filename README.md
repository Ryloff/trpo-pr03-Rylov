# Практическая работа №3 — Панель статуса лабораторных работ

## Технологии
- Bootstrap 5
- Vanilla JavaScript
- JSON-датасет

## Запуск
Так как используется `fetch` к JSON-файлам, откройте проект через локальный сервер:

    python -m http.server 8000
    # или
    npx serve

Затем откройте http://localhost:8000

## Структура
- `index.html` — разметка
- `css/custom.css` — собственные стили
- `js/app.js` — загрузка данных, обработчики, валидация
- `data/dashboard.json`, `data/notifications.json` — датасет

## Что делает Bootstrap JS
- Раскрытие navbar
- Modal, offcanvas, toast
- Программный вызов через `bootstrap.*.getOrCreateInstance`

## Что делает собственный app.js
- Загрузка данных через `fetch`
- Рендер карточек и таблицы
- Валидация формы
- Показ toast по результату действия