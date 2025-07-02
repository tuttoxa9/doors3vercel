'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/OptimizedImage'
import { convertToCdnUrl } from '@/lib/utils'

export default function TestImagesPage() {
  const [testUrl, setTestUrl] = useState('')

  // Различные типы URL для тестирования
  const testUrls = [
    'gs://mebel-be602.firebasestorage.app/products/1750273380931_7.png',
    'products/1750273380931_7.png',
    'https://firebasestorage.googleapis.com/v0/b/mebel-be602/o/products%2F1750273380931_7.png?alt=media&token=test',
    'https://cdn.maestromebel.by/products/1750273380931_7.png?alt=media',
    '1750273380931_7.png'
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Тестирование изображений</h1>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Тест convertToCdnUrl функции</h2>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Введите URL для тестирования"
          className="w-full p-2 border rounded mb-4"
        />
        {testUrl && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Исходный URL:</strong> {testUrl}</p>
            <p><strong>Преобразованный URL:</strong> {convertToCdnUrl(testUrl)}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Предустановленные тесты</h2>
        {testUrls.map((url, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <p><strong>Тест #{index + 1}:</strong></p>
            <p><strong>Исходный:</strong> {url}</p>
            <p><strong>Преобразованный:</strong> {convertToCdnUrl(url)}</p>
            <div className="mt-2">
              <OptimizedImage
                src={url}
                alt={`Test image ${index + 1}`}
                className="w-32 h-32 object-cover border"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
