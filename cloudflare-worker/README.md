# 🔥 Firebase Image Cache - Cloudflare Worker

Высокопроизводительный Cloudflare Worker для кэширования изображений из Firebase Storage с поддержкой современных форматов изображений и продвинутого кэширования.

## 🎯 Проблема, которую решает

- ❌ **Cloudflare Transform Rules не работают** с Firebase Storage
- ❌ **Изображения не кэшируются** и загружаются медленно
- ❌ **Высокие затраты** на Firebase Storage bandwidth
- ❌ **Низкие лимиты** Firebase бесплатного плана

## ✅ Что предоставляет решение

- 🚀 **Быстрое кэширование** изображений на Cloudflare Edge
- 💰 **Экономия трафика** Firebase Storage (до 90%)
- 🌍 **Глобальная CDN** с низкой задержкой
- 🔄 **Автоматическая оптимизация** WebP/AVIF форматов
- 📊 **Подробная аналитика** и мониторинг
- 🛡️ **CORS поддержка** и безопасность

## 📁 Структура проекта

```
cloudflare-worker/
├── src/
│   ├── worker.ts           # Базовая версия worker
│   └── advanced-worker.ts  # Расширенная версия с оптимизацией
├── wrangler.toml          # Конфигурация Cloudflare
├── package.json           # Зависимости проекта
├── tsconfig.json          # TypeScript конфигурация
├── DEPLOY_INSTRUCTIONS.md # Подробная инструкция деплоя
└── README.md             # Этот файл
```

## 🚀 Быстрый старт

### 1. Установка Wrangler CLI

```bash
npm install -g wrangler
# или
bun add -g wrangler

# Авторизация
wrangler auth login
```

### 2. Установка зависимостей

```bash
cd cloudflare-worker
bun install
```

### 3. Настройка конфигурации

Отредактируйте `wrangler.toml`:
```toml
[vars]
FIREBASE_STORAGE_BUCKET = "your-bucket.firebasestorage.app"
CDN_DOMAIN = "cdn.yourdomain.com"

[[routes]]
pattern = "cdn.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### 4. Деплой

```bash
wrangler deploy
```

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|---------|
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | `mebel-be602.firebasestorage.app` |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | `mebel-be602` |
| `CDN_DOMAIN` | CDN домен | `cdn.maestromebel.by` |

### Настройка DNS

После деплоя добавьте CNAME запись:
- **Type**: CNAME
- **Name**: cdn
- **Target**: yourdomain.com
- **Proxy**: ✅ Enabled

## 🎨 Возможности

### Базовая версия (`worker.ts`)
- ✅ Проксирование запросов к Firebase Storage
- ✅ Кэширование с правильными заголовками
- ✅ CORS поддержка
- ✅ Обработка ошибок
- ✅ Логирование

### Расширенная версия (`advanced-worker.ts`)
- ✅ Все функции базовой версии
- ✅ Автоматическая оптимизация WebP/AVIF
- ✅ Адаптивное время кэширования
- ✅ Подробная аналитика производительности
- ✅ Улучшенная обработка ошибок
- ✅ Поддержка различных MIME типов
- ✅ Дополнительные заголовки безопасности

## 📊 Форматы и оптимизация

Worker автоматически определяет поддерживаемые браузером форматы:

| Браузер | Формат | Экономия размера |
|---------|--------|------------------|
| Chrome 110+ | AVIF | ~50% от JPEG |
| Chrome 32+ | WebP | ~30% от JPEG |
| Safari/Firefox | Original | - |

## 🔍 Мониторинг

### Просмотр логов в реальном времени
```bash
wrangler tail
```

### Аналитика Cloudflare
- Workers Analytics в Cloudflare Dashboard
- Метрики производительности
- Статистика кэширования
- Отчеты об ошибках

### Пользовательские заголовки
- `X-Cache-Status`: `HIT` | `MISS`
- `X-Response-Time`: время ответа в мс
- `X-Worker-Version`: версия worker
- `X-Optimized-Format`: используемый формат изображения

## 🧪 Тестирование

### Локальное тестирование
```bash
wrangler dev

# В другом терминале
curl "http://localhost:8787/products/test-image.jpg?alt=media"
```

### Продакшн тестирование
```bash
# Проверка заголовков
curl -I "https://cdn.maestromebel.by/products/image.jpg"

# Проверка с WebP поддержкой
curl -H "Accept: image/webp" -I "https://cdn.maestromebel.by/products/image.jpg"
```

## 📈 Производительность

### Ожидаемые результаты
- 🚀 **Первая загрузка**: 200-500ms (из Firebase)
- ⚡ **Кэшированная загрузка**: 10-50ms (из Edge)
- 💾 **Экономия трафика**: 80-95%
- 🌍 **Время до первого байта**: <100ms

### Оптимизации
- Кэширование на 1 год для неизменяемых изображений
- Сжатие и оптимизация форматов
- Эффективные заголовки кэширования
- Минимальная латентность через Edge сеть

## 🚨 Устранение неполадок

### Worker не отвечает
1. Проверьте DNS настройки (Proxy должен быть включен)
2. Убедитесь в правильности роутов в Cloudflare Dashboard
3. Проверьте логи: `wrangler tail`

### Изображения не кэшируются
1. Проверьте заголовки ответа
2. Убедитесь в корректности Firebase URL
3. Очистите кэш Cloudflare

### CORS ошибки
1. Убедитесь, что запросы идут к правильному CDN домену
2. Проверьте заголовки CORS в ответе worker
3. Убедитесь в поддержке preflight запросов

## 🔄 Обновление

### Обновление worker
```bash
# Изменить код в src/worker.ts
wrangler deploy
```

### Очистка кэша после обновлений
```bash
# В Cloudflare Dashboard: Caching → Purge Everything
```

## 💡 Советы по оптимизации

1. **Именование файлов**: Используйте хэши в именах для лучшего кэширования
2. **Размеры изображений**: Оптимизируйте размеры перед загрузкой в Firebase
3. **Форматы**: Загружайте современные форматы (WebP/AVIF) когда возможно
4. **Мониторинг**: Регулярно проверяйте аналитику производительности

## 📞 Поддержка

При возникновении проблем:
1. Проверьте [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)
2. Просмотрите логи worker: `wrangler tail`
3. Проверьте Cloudflare Analytics
4. Убедитесь в правильности всех настроек DNS и роутинга

---

🎉 **Готово!** Ваши изображения теперь кэшируются через Cloudflare Edge и загружаются молниеносно!
