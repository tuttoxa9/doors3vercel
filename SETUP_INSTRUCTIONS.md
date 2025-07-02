# 🚀 Инструкция по настройке проекта DOORS

## 📋 Что нужно настроить

1. **Telegram Bot для приема заявок**
2. **Firebase/Firestore для управления товарами**
3. **Переменные окружения**
4. **Деплой на Netlify**

---

## 🤖 Настройка Telegram Bot

### Шаг 1: Создание бота
1. Откройте Telegram и найдите бота [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Введите название бота (например: "Maestro Orders Bot")
4. Введите username бота (например: "maestro_orders_bot")
5. Сохраните полученный **TOKEN** - он понадобится позже

### Шаг 2: Получение Chat ID
1. Создайте группу или канал, куда будут приходить заявки
2. Добавьте созданного бота в группу/канал с правами администратора
3. Отправьте любое сообщение в группу/канал
4. Откройте в браузере: `https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates`
   - Замените `[YOUR_BOT_TOKEN]` на токен вашего бота
5. Найдите в ответе `"chat":{"id":-XXXXXXXXX}` и сохраните это число (Chat ID)

### Пример настройки:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHijklMNopQRSTuvwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

---

## 🔥 Настройка Firebase

### Шаг 1: Создание проекта
1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект"
3. Введите название проекта (например: "maestro-doors")
4. Отключите Google Analytics (не обязательно для этого проекта)
5. Нажмите "Создать проект"

### Шаг 2: Настройка Web App
1. В консоли Firebase нажмите на значок `</>`
2. Введите название приложения (например: "Maestro Website")
3. **НЕ** отмечайте "Firebase Hosting"
4. Нажмите "Зарегистрировать приложение"
5. Скопируйте конфигурацию (понадобится для .env файла)

### Шаг 3: Настройка Firestore
1. В боковом меню выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме"
4. Выберите регион (europe-west1 для Европы)
5. Нажмите "Готово"

### Шаг 4: Настройка Storage
1. В боковом меню выберите "Storage"
2. Нажмите "Начать"
3. Выберите "Начать в тестовом режиме"
4. Выберите тот же регион, что и для Firestore
5. Нажмите "Готово"

### Шаг 5: Настройка правил безопасности
#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение товаров всем
    match /products/{document} {
      allow read: if true;
      allow write: if false; // Запретить запись с фронтенда
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Запретить загрузку с фронтенда
    }
  }
}
```

---

## ⚙️ Настройка переменных окружения

### Шаг 1: Создание .env.local файла
1. Скопируйте файл `.env.example` в `.env.local`
2. Заполните все переменные:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id

# Firebase Configuration (из Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=ваш_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш_проект.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш_проект_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш_проект.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш_app_id
```

---

## 📊 Структура данных в Firestore

### Коллекция: `products`

Каждый документ должен содержать:

```javascript
{
  name: "Шкаф двухстворчатый ДМ9",           // string
  category: "Шкафы-купе",                     // string
  price: {                                    // object
    min: 449,                                 // number
    max: 549                                  // number
  },
  description: "Современный шкаф-купе...",    // string
  colors: ["Белый", "Венге магия", "Дуб сонома"], // array
  images: ["products/shkaf1/image1.jpg"],     // array (пути в Storage)
  inStock: true,                              // boolean
  featured: false,                            // boolean
  createdAt: timestamp,                       // Firestore timestamp
  updatedAt: timestamp                        // Firestore timestamp
}
```

### Пример добавления товара через Firebase Console:
1. Откройте Firestore в Firebase Console
2. Нажмите "Начать коллекцию"
3. Введите ID коллекции: `products`
4. Добавьте первый документ с автогенерированным ID
5. Заполните поля согласно структуре выше

---

## 🌐 Деплой на Netlify

### Шаг 1: Подготовка к деплою
1. Убедитесь, что все изменения запушены в GitHub
2. Проверьте, что файл `netlify.toml` настроен правильно

### Шаг 2: Настройка в Netlify
1. Войдите в [Netlify](https://netlify.com)
2. Нажмите "New site from Git"
3. Выберите GitHub и ваш репозиторий
4. Настройки сборки должны определиться автоматически
5. В разделе "Environment variables" добавьте ВСЕ переменные из .env.local

### Шаг 3: Настройка переменных окружения в Netlify
Добавьте в Netlify Dashboard → Site settings → Environment variables:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 📸 Загрузка изображений

### Вариант 1: Через Firebase Console (рекомендуется)
1. Откройте Firebase Storage
2. Создайте папку `products`
3. Внутри создайте папки для каждого товара (например: `products/shkaf-kupe-1/`)
4. Загрузите изображения
5. В Firestore укажите путь к файлу (например: `products/shkaf-kupe-1/main.jpg`)

### Вариант 2: Через код (для админки)
Компонент уже подготовлен для работы с Firebase Storage. Для создания админки понадобится:
1. Добавить Firebase Auth
2. Создать защищенные маршруты
3. Добавить формы для загрузки изображений

---

## ✅ Проверка работы

### Локальная разработка:
1. `bun install`
2. `bun run dev`
3. Проверьте отправку форм
4. Проверьте загрузку товаров из Firebase

### На продакшене:
1. Отправьте тестовую заявку
2. Проверьте, что сообщение пришло в Telegram
3. Убедитесь, что товары загружаются из Firebase

---

## 🔧 Решение проблем

### Заявки не отправляются:
- Проверьте правильность токена бота
- Убедитесь, что Chat ID указан с минусом (для групп)
- Проверьте, что бот добавлен в группу

### Товары не загружаются:
- Проверьте настройки Firebase
- Убедитесь, что правила Firestore разрешают чтение
- Проверьте правильность переменных окружения

### Изображения не показываются:
- Проверьте правила Storage
- Убедитесь, что пути к файлам указаны правильно
- Проверьте, что файлы загружены в правильные папки

---

## 📞 Поддержка

Если возникли проблемы с настройкой, проверьте:
1. Все переменные окружения заполнены
2. Боты и Firebase проект созданы правильно
3. Правила безопасности настроены
4. Сайт успешно задеплоен

Все компоненты настроены с fallback вариантами, поэтому сайт будет работать даже при неполной конфигурации.
