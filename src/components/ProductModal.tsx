'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import OptimizedImage from './OptimizedImage'
import type { Product } from '@/types/product'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onContactClick?: () => void
}

export default function ProductModal({ product, isOpen, onClose, onContactClick }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const imageRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max || price.max === 0) {
      return `${price.min.toLocaleString()} BYN`
    }
    return `от ${price.min.toLocaleString()} до ${price.max.toLocaleString()} BYN`
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart(product, selectedColor || undefined)
    setIsAddedToCart(true)

    // Reset the animation after a short delay
    setTimeout(() => {
      setIsAddedToCart(false)
    }, 2000)
  }

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientX
    if (imageRef.current) {
      imageRef.current.dataset.touchStart = touchStart.toString()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!imageRef.current || product.images.length <= 1) return

    const touchStart = Number.parseFloat(imageRef.current.dataset.touchStart || '0')
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextImage()
      } else {
        prevImage()
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl mx-2 md:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full max-h-[95vh]">
              {/* Header - Sticky on mobile */}
              <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-3 sm:p-4 border-b border-zinc-200">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium rounded-full hidden sm:inline">
                      ⭐ Популярное
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors duration-200 flex-shrink-0"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 p-3 sm:p-4">
                    {product.images.length > 0 ? (
                      <div
                        ref={imageRef}
                        className="relative w-full aspect-square bg-zinc-50 rounded-xl overflow-hidden max-w-sm mx-auto lg:max-w-none"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        <OptimizedImage
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          fallbackClassName="w-full h-full"
                          loading="eager"
                        />

                        {/* Navigation buttons */}
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all duration-200"
                            >
                              <ChevronLeft className="w-4 h-4 text-zinc-900" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all duration-200"
                            >
                              <ChevronRight className="w-4 h-4 text-zinc-900" />
                            </button>
                          </>
                        )}

                        {/* Image indicators */}
                        {product.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                  index === currentImageIndex
                                    ? 'bg-white shadow-lg'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-zinc-100 rounded-xl flex items-center justify-center max-w-sm mx-auto lg:max-w-none">
                        <div className="text-center text-zinc-500">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Изображение недоступно</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info Section */}
                  <div className="lg:w-1/2 p-3 sm:p-4 space-y-4">
                    {/* Title and Price */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">{product.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <p className="text-lg sm:text-xl font-bold text-zinc-900">
                          {formatPrice(product.price)}
                        </p>
                        <div className={`self-start sm:self-auto inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-2">Описание</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Доступные цвета</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-3 py-1.5 rounded-full border-2 transition-all duration-200 text-xs ${
                                selectedColor === color
                                  ? 'border-zinc-900 bg-zinc-900 text-white'
                                  : 'border-zinc-300 hover:border-zinc-500 text-zinc-700'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Action Buttons */}
              <div className="p-3 sm:p-4 border-t border-zinc-200 bg-zinc-50">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <motion.button
                    onClick={onContactClick}
                    className="flex-1 bg-zinc-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-zinc-800 transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Заказать консультацию
                  </motion.button>
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-sm flex items-center justify-center space-x-2 ${
                      !product.inStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : isAddedToCart
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-zinc-300 text-zinc-700 hover:border-zinc-500 hover:bg-zinc-100'
                    }`}
                    whileHover={product.inStock ? { scale: 1.02 } : {}}
                    whileTap={product.inStock ? { scale: 0.98 } : {}}
                  >
                    {isAddedToCart ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
                        >
                          <span className="text-green-500 font-bold text-xs">✓</span>
                        </motion.div>
                        <span>Добавлено!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>В корзину</span>
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-xs text-zinc-500 text-center mt-2">
                  Бесплатная консультация и 3D-визуализация
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
