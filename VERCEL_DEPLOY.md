# Деплой на Vercel

Этот проект подготовлен для деплоя на платформе Vercel с полной поддержкой отправки уведомлений в Telegram.

## Требования

- Node.js 18+
- Bun (используется как пакетный менеджер)
- Telegram Bot Token и Chat ID

## Быстрый деплой

1. **Склонируйте репозиторий:**
   ```bash
   git clone https://github.com/tuttoxa9/doors3vercel.git
   cd doors3vercel
   ```

2. **Подключите к Vercel:**
   - Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
   - Нажмите "New Project"
   - Импортируйте этот репозиторий

3. **Настройте переменные окружения в Vercel:**
   - `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
   - `TELEGRAM_CHAT_ID` - ID чата, куда отправлять уведомления

## Настройка Telegram

### Создание бота:
1. Отправьте `/start` боту [@BotFather](https://t.me/BotFather)
2. Создайте нового бота командой `/newbot`
3. Скопируйте полученный токен

### Получение Chat ID:
1. Добавьте бота в нужный чат или группу
2. Отправьте любое сообщение в чат
3. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Найдите значение `chat.id` в ответе

## API Routes

Проект включает следующие API маршруты:

- `/api/send-to-telegram` - Отправка заявок на консультацию
- `/api/submit-order` - Отправка заказов из корзины

Все маршруты настроены с CORS заголовками для безопасной работы.

## Конфигурация

### vercel.json
Файл содержит:
- Настройки сборки с Bun
- Конфигурацию изображений для CDN
- Настройки функций API
- Переменные окружения

### CDN для изображений
Проект автоматически использует Cloudflare CDN для оптимизации загрузки изображений:
- Исходные Firebase Storage URL автоматически преобразуются в CDN URL
- Поддержка `https://cdn.maestromebel.by`

## Локальная разработка

```bash
# Установка зависимостей
bun install

# Запуск в режиме разработки
bun run dev

# Сборка
bun run build
```

## Переменные окружения (.env.local)

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Отличия от Netlify версии

- Netlify Functions заменены на Vercel API Routes
- Обновлены пути API с `/.netlify/functions/` на `/api/`
- Настроена конфигурация `vercel.json` вместо `netlify.toml`
- Сохранена полная функциональность отправки в Telegram

## Поддержка

При возникновении проблем проверьте:
1. Корректность Telegram Bot Token и Chat ID
2. Права бота в чате/группе
3. Логи в Vercel Dashboard

## Автоматический деплой

После первоначальной настройки все изменения в main ветке будут автоматически деплоиться на Vercel.
