/**
 * Cloudflare Worker для кэширования изображений из Firebase Storage
 * Решает проблему с Transform Rules, которые не работают с Firebase Storage
 */

interface Env {
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_PROJECT_ID: string;
  CDN_DOMAIN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);

      // Логируем запрос для отладки
      console.log(`[Worker] Обрабатываем запрос: ${url.pathname}`);

      // Проверяем, что это запрос к нашему CDN домену
      if (url.hostname !== env.CDN_DOMAIN) {
        return new Response('Not Found', { status: 404 });
      }

      // Извлекаем путь к файлу (убираем ведущий слэш)
      const filePath = url.pathname.slice(1);

      if (!filePath) {
        return new Response('No file path specified', { status: 400 });
      }

      console.log(`[Worker] Путь к файлу: ${filePath}`);
      console.log(`[Worker] Используем Firebase Storage Bucket: ${env.FIREBASE_STORAGE_BUCKET}`);

      // Создаем кэш ключ на основе URL
      const cacheKey = new Request(request.url, request);
      const cache = caches.default;

      // Проверяем кэш
      let response = await cache.match(cacheKey);
      if (response) {
        console.log(`[Worker] Файл найден в кэше: ${filePath}`);
        return response;
      }

      console.log(`[Worker] Файл не в кэше, запрашиваем из Firebase Storage: ${filePath}`);

      // Очищаем путь от лишних параметров
      let cleanPath = filePath.replace('?alt=media', '');

      // URL-кодируем слэши как требует Firebase API
      const encodedPath = cleanPath.replace(/\//g, '%2F');
      const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o/${encodedPath}?alt=media`;

      console.log(`[Worker] Чистый путь: ${cleanPath}`);
      console.log(`[Worker] Закодированный путь: ${encodedPath}`);
      console.log(`[Worker] Firebase URL: ${firebaseUrl}`);

      // Запрашиваем файл из Firebase Storage
      const firebaseResponse = await fetch(firebaseUrl, {
        method: request.method,
        headers: {
          // Передаем некоторые заголовки от клиента
          'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
          'Accept': request.headers.get('Accept') || '*/*',
        },
      });

      if (!firebaseResponse.ok) {
        console.log(`[Worker] Ошибка от Firebase Storage: ${firebaseResponse.status} ${firebaseResponse.statusText}`);
        return new Response(JSON.stringify({
          error: 'Image not found',
          status: firebaseResponse.status,
          statusText: firebaseResponse.statusText,
          requestedPath: filePath,
          cleanPath: cleanPath,
          encodedPath: encodedPath,
          firebaseUrl: firebaseUrl,
          bucket: env.FIREBASE_STORAGE_BUCKET,
          timestamp: new Date().toISOString()
        }, null, 2), {
          status: firebaseResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      console.log(`[Worker] Успешно получен файл из Firebase Storage: ${filePath}`);

      // Создаем ответ с кэшированием
      response = new Response(firebaseResponse.body, {
        status: firebaseResponse.status,
        statusText: firebaseResponse.statusText,
        headers: {
          // Копируем заголовки от Firebase
          'Content-Type': firebaseResponse.headers.get('Content-Type') || 'application/octet-stream',
          'Content-Length': firebaseResponse.headers.get('Content-Length') || '',
          'ETag': firebaseResponse.headers.get('ETag') || '',
          'Last-Modified': firebaseResponse.headers.get('Last-Modified') || '',

          // Добавляем заголовки для кэширования
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable', // 1 год
          'CDN-Cache-Control': 'public, max-age=31536000',
          'Cloudflare-CDN-Cache-Control': 'public, max-age=31536000',

          // CORS заголовки
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',

          // Дополнительные заголовки
          'X-Cache-Status': 'MISS',
          'X-Worker-Version': '1.3.0',
          'X-Firebase-Bucket': env.FIREBASE_STORAGE_BUCKET,
        },
      });

      // Кэшируем ответ (асинхронно, не блокируем ответ)
      ctx.waitUntil(cache.put(cacheKey, response.clone()));

      console.log(`[Worker] Файл закэширован: ${filePath}`);

      return response;

    } catch (error) {
      console.error('[Worker] Ошибка:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        bucket: env?.FIREBASE_STORAGE_BUCKET || 'undefined',
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
};
