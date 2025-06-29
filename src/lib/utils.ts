import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Преобразует Firebase Storage URL в CDN URL
 * @param firebaseUrl - URL из Firebase Storage
 * @returns CDN URL через cdn.maestromebel.by
 */
export function convertToCdnUrl(firebaseUrl: string): string {
  if (!firebaseUrl) {
    console.log('convertToCdnUrl: пустой URL')
    return firebaseUrl
  }

  console.log('convertToCdnUrl input:', firebaseUrl)

  // Если уже CDN URL - возвращаем как есть
  if (firebaseUrl.includes('cdn.maestromebel.by')) {
    console.log('convertToCdnUrl: уже CDN URL, возвращаем как есть')
    return firebaseUrl
  }

  // Если это Firebase Storage HTTP URL
  if (firebaseUrl.includes('firebasestorage.googleapis.com') || firebaseUrl.includes('firebasestorage.app')) {
    try {
      const url = new URL(firebaseUrl)
      console.log('convertToCdnUrl: парсим Firebase URL, searchParams:', url.searchParams.toString())
      console.log('convertToCdnUrl: pathname:', url.pathname)

      // Извлекаем путь к файлу из URL вида: /v0/b/bucket/o/path%2Fto%2Ffile.jpg
      const pathMatch = firebaseUrl.match(/\/o\/([^?]+)/)
      console.log('convertToCdnUrl: pathMatch:', pathMatch)
      if (pathMatch && pathMatch[1]) {
        const decodedPath = decodeURIComponent(pathMatch[1])
        console.log('convertToCdnUrl: decodedPath:', decodedPath)
        const cdnUrl = `https://cdn.maestromebel.by/${decodedPath}?alt=media`
        console.log('convertToCdnUrl: result CDN URL:', cdnUrl)
        return cdnUrl
      }
    } catch (error) {
      console.warn('Ошибка при преобразовании Firebase URL в CDN URL:', error)
    }
  }

  // Если это gs:// URL (Firebase Storage bucket path)
  if (firebaseUrl.startsWith('gs://')) {
    console.log('convertToCdnUrl: обрабатываем gs:// URL')
    try {
      // Парсим gs://bucket-name/path/to/file.ext
      const gsMatch = firebaseUrl.match(/^gs:\/\/[^/]+\/(.+)$/)
      if (gsMatch && gsMatch[1]) {
        const filePath = gsMatch[1]
        console.log('convertToCdnUrl: filePath:', filePath)
        const cdnUrl = `https://cdn.maestromebel.by/${filePath}?alt=media`
        console.log('convertToCdnUrl: gs:// result CDN URL:', cdnUrl)
        return cdnUrl
      }
    } catch (error) {
      console.warn('Ошибка при преобразовании gs:// URL:', error)
    }
  }

  // Если это относительный путь (например, просто "products/image.jpg")
  if (!firebaseUrl.startsWith('http://') && !firebaseUrl.startsWith('https://') && !firebaseUrl.startsWith('gs://')) {
    console.log('convertToCdnUrl: относительный путь, добавляем CDN префикс')
    const cdnUrl = `https://cdn.maestromebel.by/${firebaseUrl}?alt=media`
    console.log('convertToCdnUrl: relative path result:', cdnUrl)
    return cdnUrl
  }

  // Если не Firebase URL или не удалось преобразовать - возвращаем оригинал
  console.log('convertToCdnUrl: не Firebase URL или не удалось преобразовать, возвращаем оригинал')
  return firebaseUrl
}
