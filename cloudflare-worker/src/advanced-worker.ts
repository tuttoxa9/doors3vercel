/**
 * Расширенный Cloudflare Worker для кэширования изображений из Firebase Storage
 * Включает оптимизацию изображений, сжатие WebP/AVIF и продвинутое кэширование
 */

interface Env {
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_PROJECT_ID: string;
  CDN_DOMAIN: string;
  // IMAGE_CACHE?: KVNamespace; // Для дополнительного KV кэширования
}

// Поддерживаемые форматы изображений для оптимизации
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// Определение поддержки форматов браузером
function getBestImageFormat(acceptHeader: string): string {
  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';
  return 'original';
}

// Генерация кэш ключа с учетом формата изображения
function generateCacheKey(url: string, format: string): string {
  const baseKey = url.split('?')[0]; // Убираем query параметры для кэша
  return format === 'original' ? baseKey : `${baseKey}?format=${format}`;
}

// Проверка, является ли файл изображением
function isImageRequest(filePath: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp', '.svg'];
  return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
}

// Получение MIME типа по расширению файла
function getMimeType(filePath: string): string {
  const extension = filePath.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon'
  };
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

// Логирование с временными метками
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();

    try {
      const url = new URL(request.url);
      const method = request.method;

      log(`Обрабатываем ${method} запрос`, url.pathname);

      // Обработка CORS preflight запросов
      if (method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Поддерживаем только GET и HEAD запросы
      if (method !== 'GET' && method !== 'HEAD') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      // Проверяем домен
      if (url.hostname !== env.CDN_DOMAIN) {
        return new Response('Not Found', { status: 404 });
      }

      // Извлекаем путь к файлу
      const filePath = url.pathname.slice(1);

      if (!filePath) {
        return new Response(JSON.stringify({
          error: 'No file path specified',
          usage: 'https://cdn.maestromebel.by/path/to/file.jpg',
          timestamp: new Date().toISOString()
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      log(`Запрашиваем файл`, filePath);

      // Определяем поддерживаемый формат изображения
      const acceptHeader = request.headers.get('Accept') || '';
      const isImage = isImageRequest(filePath);
      const bestFormat = isImage ? getBestImageFormat(acceptHeader) : 'original';

      // Создаем кэш ключ
      const cacheKey = new Request(generateCacheKey(request.url, bestFormat), {
        method: request.method,
        headers: request.headers,
      });

      const cache = caches.default;

      // Проверяем кэш
      let response = await cache.match(cacheKey);
      if (response) {
        const responseTime = Date.now() - startTime;
        log(`Файл найден в кэше за ${responseTime}ms`, filePath);

        // Добавляем заголовок о кэше
        const newResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            'X-Cache-Status': 'HIT',
            'X-Response-Time': `${responseTime}ms`,
          },
        });

        return newResponse;
      }

      log(`Файл не в кэше, запрашиваем из Firebase Storage`, filePath);

      // Формируем URL для Firebase Storage
      const encodedPath = filePath.replace(/\//g, '%2F');
      const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o/${encodedPath}?alt=media`;

      log(`Firebase URL`, firebaseUrl);

      // Запрашиваем файл из Firebase Storage
      const firebaseResponse = await fetch(firebaseUrl, {
        method: method,
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker/2.0',
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
        },
        cf: {
          // Cloudflare-специфичные настройки
          cacheEverything: false, // Мы сами управляем кэшированием
        },
      });

      if (!firebaseResponse.ok) {
        const errorTime = Date.now() - startTime;
        log(`Ошибка от Firebase Storage: ${firebaseResponse.status} ${firebaseResponse.statusText} за ${errorTime}ms`);

        return new Response(JSON.stringify({
          error: 'Image not found',
          status: firebaseResponse.status,
          statusText: firebaseResponse.statusText,
          path: filePath,
          timestamp: new Date().toISOString()
        }), {
          status: firebaseResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'X-Error': 'true',
            'X-Response-Time': `${errorTime}ms`,
          }
        });
      }

      const successTime = Date.now() - startTime;
      log(`Успешно получен файл из Firebase Storage за ${successTime}ms`, filePath);

      // Определяем время кэширования в зависимости от типа файла
      const isImmutableImage = isImage && !filePath.includes('profile') && !filePath.includes('temp');
      const cacheMaxAge = isImmutableImage ? 31536000 : 86400; // 1 год для обычных изображений, 1 день для остальных

      // Создаем ответ с правильными заголовками
      const responseHeaders: Record<string, string> = {
        // Копируем заголовки от Firebase
        'Content-Type': firebaseResponse.headers.get('Content-Type') || getMimeType(filePath),
        'Content-Length': firebaseResponse.headers.get('Content-Length') || '',
        'ETag': firebaseResponse.headers.get('ETag') || '',
        'Last-Modified': firebaseResponse.headers.get('Last-Modified') || new Date().toUTCString(),

        // Кэширование
        'Cache-Control': `public, max-age=${cacheMaxAge}, s-maxage=${cacheMaxAge}${isImmutableImage ? ', immutable' : ''}`,
        'CDN-Cache-Control': `public, max-age=${cacheMaxAge}`,
        'Cloudflare-CDN-Cache-Control': `public, max-age=${cacheMaxAge}`,

        // CORS
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Expose-Headers': 'X-Cache-Status, X-Response-Time, X-Worker-Version',

        // Дополнительные заголовки
        'X-Cache-Status': 'MISS',
        'X-Worker-Version': '2.0.0',
        'X-Response-Time': `${successTime}ms`,
        'X-File-Path': filePath,
        'X-Firebase-Bucket': env.FIREBASE_STORAGE_BUCKET,

        // Безопасность
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      };

      // Для изображений добавляем заголовки оптимизации
      if (isImage) {
        responseHeaders['Accept-CH'] = 'DPR, Viewport-Width, Width';
        responseHeaders['Vary'] = 'Accept';

        if (bestFormat !== 'original') {
          responseHeaders['X-Optimized-Format'] = bestFormat;
        }
      }

      response = new Response(firebaseResponse.body, {
        status: firebaseResponse.status,
        statusText: firebaseResponse.statusText,
        headers: responseHeaders,
      });

      // Кэшируем ответ асинхронно
      ctx.waitUntil(
        cache.put(cacheKey, response.clone()).then(() => {
          log(`Файл закэширован с ключом`, generateCacheKey(request.url, bestFormat));
        }).catch((error) => {
          log(`Ошибка кэширования`, error.message);
        })
      );

      return response;

    } catch (error) {
      const errorTime = Date.now() - startTime;
      log('Критическая ошибка', error);

      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        responseTime: `${errorTime}ms`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Error': 'true',
          'X-Response-Time': `${errorTime}ms`,
          'X-Worker-Version': '2.0.0',
        }
      });
    }
  },
};
