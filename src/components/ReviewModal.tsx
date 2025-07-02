'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { useEffect } from 'react'

interface Review {
  id: number
  name: string
  review: string
  rating: number
  category: string
  date: string
  verified: boolean
}

interface ReviewModalProps {
  reviews: Review[]
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
}

export default function ReviewModal({ reviews, isOpen, onClose, selectedCategory }: ReviewModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  const filteredReviews = selectedCategory
    ? reviews.filter(review => review.category === selectedCategory)
    : reviews

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 font-pusia-bold">
                    Отзывы наших клиентов
                  </h2>
                  <p className="text-zinc-600 mt-1">
                    {selectedCategory ? `Отзывы по категории: ${selectedCategory}` : 'Все отзывы'}
                    ({filteredReviews.length} отзыв{filteredReviews.length === 1 ? '' : filteredReviews.length < 5 ? 'а' : 'ов'})
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* Reviews Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="grid gap-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 hover:border-zinc-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-zinc-300 rounded-full flex items-center justify-center">
                          <span className="text-zinc-700 font-semibold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-zinc-900 font-pusia-bold">
                              {review.name}
                            </h3>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                ✓ Проверено
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-zinc-500">•</span>
                            <span className="text-sm text-zinc-500">{review.date}</span>
                            <span className="text-sm text-zinc-500">•</span>
                            <span className="text-sm text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded-full">
                              {review.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-zinc-700 leading-relaxed italic font-pusia-bold">
                      {review.review}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
