'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Header from '@/components/Header'

// Lazy load компонентов для оптимизации
const ShopSection = lazy(() => import('@/components/ShopSection'))
const Footer = lazy(() => import('@/components/Footer'))
const ContactModal = lazy(() => import('@/components/ContactModal'))
const ShoppingCart = lazy(() => import('@/components/ShoppingCart'))

export default function CatalogPage() {
  const [scrollY, setScrollY] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  const handleOrderSubmit = async (orderData: {
    phone: string
    name?: string
    address?: string
    comment?: string
    items: Array<{
      product: {
        id: string
        name: string
        category: string
        price: { min: number; max: number }
      }
      selectedColor?: string
      quantity: number
      price: number
    }>
    totalItems: number
    totalPrice: number
    timestamp: string
  }) => {
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      const result = await response.json()
      console.log('Order submitted successfully:', result)

      // Перенаправляем на страницу благодарности
      window.location.href = '/thank-you'
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Произошла ошибка при отправке заказа. Попробуйте позже.')
    }
  }

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation handler
  const handleSectionChange = (section: 'main' | 'shop') => {
    if (section === 'main') {
      window.location.href = '/'
    }
    // If section is 'shop', we stay on catalog page
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        scrollY={scrollY}
        activeSection="shop"
        setActiveSection={handleSectionChange}
        onContactClick={() => setShowContactForm(true)}
      />

      <main className="relative">
        <Suspense fallback={<div>Загрузка...</div>}>
          <ShopSection onContactClick={() => setShowContactForm(true)} />
        </Suspense>
      </main>

      <Suspense fallback={<div>Загрузка...</div>}>
        <Footer />
      </Suspense>

      {/* Global Contact Modal */}
      <Suspense fallback={null}>
        <ContactModal
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />
      </Suspense>

      {/* Shopping Cart */}
      <Suspense fallback={null}>
        <ShoppingCart onOrderSubmit={handleOrderSubmit} />
      </Suspense>
    </div>
  )
}
