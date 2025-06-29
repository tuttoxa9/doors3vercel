'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, ProductCategory } from '@/types/product'

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  isError: boolean
  error: string | null
}

// Маппинг категорий на коллекции Firestore
const categoryToCollection: Record<ProductCategory, string> = {
  'Шкафы': 'products',
  'Полки': 'polki',
  'Столы': 'tables',
  'Комоды': 'komodi'
}

export function useProducts(category: ProductCategory = 'Шкафы'): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        setError(null)

        const collectionName = categoryToCollection[category]

        // Создаем запрос к коллекции, сортированный по дате создания
        const q = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const fetchedProducts: Product[] = []

        for (const doc of querySnapshot.docs) {
          const data = doc.data()

          // Преобразуем Firestore timestamps в Date объекты
          const product: Product = {
            id: doc.id,
            name: data.name || '',
            category: category, // Используем переданную категорию
            price: {
              min: data.price?.min || 0,
              max: data.price?.max || 0,
            },
            description: data.description || '',
            colors: Array.isArray(data.colors) ? data.colors : [],
            images: Array.isArray(data.images) ? data.images : [],
            inStock: Boolean(data.inStock),
            featured: Boolean(data.featured),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          }

          fetchedProducts.push(product)
        }

        setProducts(fetchedProducts)
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err)
        setIsError(true)
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category]) // Добавляем category в зависимости

  return {
    products,
    isLoading,
    isError,
    error,
  }
}
