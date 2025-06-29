'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { items } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    phone: '+375',
    comment: ''
  })
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus('loading')
    setErrorMessage('')

    try {
      // Добавляем товары из корзины к данным формы
      const dataToSend = {
        ...formData,
        cartItems: items.map(item => ({
          product: item.product,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
          price: item.product.price.min
        }))
      }

      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmissionStatus('success')
        // Перенаправляем на страницу благодарности через 1 секунду
        setTimeout(() => {
          window.location.href = '/thank-you'
        }, 1000)
      } else {
        setSubmissionStatus('error')
        setErrorMessage(result.error || 'Произошла ошибка при отправке заявки')
        setTimeout(() => setSubmissionStatus('idle'), 3000)
      }
    } catch (error) {
      setSubmissionStatus('error')
      setErrorMessage('Не удалось отправить заявку. Проверьте подключение к интернету.')
      setTimeout(() => setSubmissionStatus('idle'), 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'phone') {
      // Ensure phone starts with +375 and only allow 9 digits after
      if (value.startsWith('+375')) {
        const digits = value.slice(4).replace(/\D/g, '')
        if (digits.length <= 9) {
          setFormData({
            ...formData,
            phone: `+375${digits}`
          })
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const isPhoneValid = formData.phone.length === 13 // +375 + 9 digits

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 font-durik">Заказать консультацию</h3>
            {items.length > 0 && (
              <p className="text-sm text-zinc-600 mt-1">
                🛒 В корзине: {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
              Имя
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-none outline-none rounded-2xl bg-gray-100 shadow-[inset_2px_5px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
              placeholder="Ваше имя"
              autoFocus
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-phone" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
              Телефон
            </label>
            <div className="relative">
              <input
                type="tel"
                id="modal-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border-none outline-none rounded-2xl bg-gray-100 shadow-[inset_2px_5px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
                autoComplete="tel"
                placeholder="+375XXXXXXXXX"
                required
              />
              {isPhoneValid && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-black" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="modal-comment" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
              Комментарий
            </label>
            <textarea
              id="modal-comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border-none outline-none rounded-2xl bg-gray-100 shadow-[inset_2px_5px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff] resize-none"
              placeholder="Расскажите о ваших пожеланиях..."
              autoComplete="off"
            />
          </div>
          <motion.button
            type="submit"
            disabled={submissionStatus === 'loading'}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 font-durik flex items-center justify-center space-x-2 ${
              submissionStatus === 'success'
                ? 'bg-green-600 text-white'
                : submissionStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            } ${submissionStatus === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={submissionStatus === 'idle' ? { scale: 1.02 } : {}}
            whileTap={submissionStatus === 'idle' ? { scale: 0.98 } : {}}
          >
            {submissionStatus === 'loading' && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {submissionStatus === 'success' && (
              <CheckCircle className="w-5 h-5" />
            )}
            {submissionStatus === 'error' && (
              <XCircle className="w-5 h-5" />
            )}
            <span>
              {submissionStatus === 'loading' && 'Отправка...'}
              {submissionStatus === 'success' && 'Отправлено!'}
              {submissionStatus === 'error' && 'Ошибка'}
              {submissionStatus === 'idle' && 'Отправить заявку'}
            </span>
          </motion.button>
          {submissionStatus === 'error' && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm text-center"
            >
              {errorMessage}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  )
}
