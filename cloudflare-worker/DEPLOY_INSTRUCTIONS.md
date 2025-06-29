# 🚀 Инструкция по деплою Cloudflare Worker для кэширования изображений

## 📋 Что это решает

Этот Cloudflare Worker решает проблему с кэшированием изображений из Firebase Storage, когда Cloudflare Transform Rules не работают. Worker:

- ✅ Проксирует запросы к Firebase Storage
- ✅ Кэширует изображения в Cloudflare Edge Cache
- ✅ Добавляет правильные заголовки для длительного кэширования
- ✅ Обрабатывает ошибки и предоставляет фоллбэки
- ✅ Поддерживает CORS для веб-приложений

## 🛠️ Предварительные требования

1. **Аккаунт Cloudflare** с доступом к Workers
2. **Домен maestromebel.by** должен быть настроен в Cloudflare
3. **Wrangler CLI** установлен и настроен

## 📥 Установка Wrangler CLI

```bash
# Установка глобально
npm install -g wrangler

# Или через bun
bun add -g wrangler

# Авторизация в Cloudflare
wrangler auth login
```

## 🔧 Настройка и деплой

### 1. Переход в директорию worker

```bash
cd cloudflare-worker
```

### 2. Установка зависимостей

```bash
# Если используете npm
npm install

# Если используете bun
bun install
```

### 3. Проверка конфигурации

Убедитесь, что в `wrangler.toml` правильно указаны:
- `zone_name = "maestromebel.by"` (ваш домен в Cloudflare)
- `pattern = "cdn.maestromebel.by/*"` (поддомен для CDN)

### 4. Тестирование локально (опционально)

```bash
# Запуск локально для тестирования
wrangler dev

# Тестирование запроса
curl "http://localhost:8787/products/test-image.jpg?alt=media"
```

### 5. Деплой в production

```bash
# Деплой worker
wrangler deploy
```

## 🌐 Настройка DNS

После деплоя worker необходимо настроить DNS запись для поддомена CDN:

1. Зайдите в **Cloudflare Dashboard**
2. Выберите домен **maestromebel.by**
3. Перейдите в **DNS** → **Records**
4. Добавьте запись:
   - **Type**: `CNAME`
   - **Name**: `cdn`
   - **Target**: `maestromebel.by`
   - **Proxy status**: 🟠 Proxied (обязательно!)

## ✅ Проверка работы

После деплоя проверьте работу:

### 1. Прямой запрос к worker
```bash
curl -I "https://cdn.maestromebel.by/products/1750273380931_7.png?alt=media"
```

Должны увидеть заголовки:
- `X-Worker-Version: 1.0.0`
- `Cache-Control: public, max-age=31536000...`
- `X-Cache-Status: MISS` (при первом запросе) или `HIT` (при повторном)

### 2. Проверка в браузере
Откройте: `https://cdn.maestromebel.by/products/1750273380931_7.png?alt=media`

### 3. Проверка в DevTools
- Откройте Network tab
- Обновите страницу с изображениями
- Убедитесь, что изображения загружаются с `cdn.maestromebel.by`
- При повторной загрузке должен быть статус `304 Not Modified` или загрузка из кэша

## 🔍 Мониторинг и отладка

### Просмотр логов worker
```bash
wrangler tail
```

### Очистка кэша (если нужно)
В Cloudflare Dashboard:
1. **Caching** → **Purge Cache**
2. **Purge Everything** или **Purge by URL**

## 🔧 Настройки после деплоя

### 1. Настройка роутов (если не работает автоматически)
В Cloudflare Dashboard:
1. **Workers & Pages** → **firebase-image-cache**
2. **Triggers** → **Routes**
3. Добавить роут: `cdn.maestromebel.by/*`

### 2. Переменные окружения (если нужно изменить)
```bash
# Установка переменной
wrangler secret put FIREBASE_STORAGE_BUCKET

# Просмотр переменных
wrangler secret list
```

## 🚨 Устранение неполадок

### Проблема: Worker не отвечает
1. Проверьте DNS запись для `cdn.maestromebel.by`
2. Убедитесь, что Proxy включен (🟠)
3. Проверьте роуты в Workers dashboard

### Проблема: Изображения не кэшируются
1. Проверьте заголовки ответа
2. Убедитесь, что Firebase URL корректен
3. Проверьте логи через `wrangler tail`

### Проблема: CORS ошибки
Worker уже включает CORS заголовки, но если есть проблемы:
- Проверьте, что запросы идут именно к `cdn.maestromebel.by`
- Убедитесь, что в коде сайта используется правильный CDN URL

## 📊 Ожидаемые результаты

После настройки:
- ✅ Изображения загружаются через `cdn.maestromebel.by`
- ✅ Первая загрузка: MISS (загрузка из Firebase)
- ✅ Повторные загрузки: HIT (из кэша Cloudflare)
- ✅ Время загрузки изображений значительно сокращается
- ✅ Снижается нагрузка на Firebase Storage
- ✅ Экономия трафика и затрат

## 🎯 Следующие шаги

1. Мониторьте работу worker первые дни
2. Оптимизируйте настройки кэширования при необходимости
3. Рассмотрите добавление компрессии изображений (WebP/AVIF)
4. Настройте алерты на ошибки worker
