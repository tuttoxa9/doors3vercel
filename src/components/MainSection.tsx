'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Star, ArrowRight, Phone, Mail, MapPin, Check, Loader2, CheckCircle, XCircle } from 'lucide-react'
import VideoBackground from './VideoBackground'
import SmoothRotatingText from './SmoothRotatingText'

interface MainSectionProps {
  showContactForm?: boolean
  setShowContactForm?: (show: boolean) => void
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'

export default function MainSection({ showContactForm = false, setShowContactForm }: MainSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+375',
    comment: ''
  })
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const rotatingTexts = [
    "Качественно",
    "Быстро",
    "Надёжно",
    "Современно",
    "Профессионально",
    "Креативно",
    "Стильно",
    "Функционально"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <VideoBackground />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          {/* Заголовок с блюром */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative inline-block">
              {/* Блюр за заголовком - подстраивается под размер текста */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 backdrop-blur-lg bg-black/30 rounded-xl md:rounded-2xl transform scale-110" />
              </div>
              <h1
                className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight relative z-10 px-3 py-2 md:px-6 md:py-3 text-center"
                style={{ fontFamily: 'AristaPro, sans-serif' }}
              >
                <span className="block">Ваше видение.</span>
                <span className="block">Наше исполнение.</span>
              </h1>
            </div>
          </div>

          {/* Подзаголовок с плавной анимацией размера */}
          <div className="mb-6 md:mb-8">
            <SmoothRotatingText
              texts={rotatingTexts}
              rotationInterval={1500}
              className="text-base sm:text-lg md:text-2xl text-white/95 font-semibold whitespace-nowrap"
              blurBackground={true}
            />
          </div>

          {/* Кнопка по центру */}
          <div className="flex justify-center">
            <motion.button
              onClick={() => setShowContactForm?.(true)}
              className="bg-zinc-900 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-zinc-800 transition-colors duration-200 inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Заказать консультацию</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>

        </div>

        {/* Стрелка для скролла - в самом низу секции */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
          <motion.div
            className="cursor-pointer"
            initial={{ y: 0 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            onClick={() => {
              const element = document.querySelector('section:nth-of-type(2)');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process & Form Section */}
      <section className="bg-zinc-50 rounded-t-3xl md:rounded-t-[3rem] py-16 md:py-20 -mt-6 md:-mt-8 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Process Description */}
            <div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-8 font-durik">
                Наш процесс работы
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 font-durik">Консультация</h3>
                    <p className="text-zinc-600 font-durik">Обсуждаем ваши потребности, измеряем пространство и предлагаем оптимальные решения</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 font-durik">Дизайн</h3>
                    <p className="text-zinc-600 font-durik">Создаем 3D-визуализацию будущего шкафа с учетом всех ваших пожеланий</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 font-durik">Производство</h3>
                    <p className="text-zinc-600 font-durik">Изготавливаем мебель из качественных материалов на современном оборудовании</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 font-durik">Доставка</h3>
                    <p className="text-zinc-600 font-durik">Доставляем по всей стране и устанавливаем с гарантией</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 font-durik">Оставить заявку</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-none outline-none rounded-2xl bg-gray-100 shadow-[inset_2px_5px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
                    placeholder="Ваше имя"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
                    Телефон
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-none outline-none rounded-2xl bg-gray-100 shadow-[inset_2px_5px_10px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
                      placeholder="+375XXXXXXXXX"
                      autoComplete="tel"
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
                  <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 mb-2 font-durik">
                    Комментарий
                  </label>
                  <textarea
                    id="comment"
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

              {/* Контакты под формой */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4 text-sm">Или свяжитесь с нами удобным способом:</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a
                    href="https://t.me/rervir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.589c-.12.554-.436.686-.884.427l-2.454-1.81-1.183 1.138c-.131.131-.242.242-.497.242l.178-2.519 4.589-4.149c.199-.178-.043-.276-.309-.098l-5.674 3.57-2.444-.763c-.531-.166-.542-.531.111-.785l9.544-3.68c.442-.166.83.099.683.785z"/>
                    </svg>
                    Написать в телеграм
                  </a>
                  <a
                    href="tel:+375291565232"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    +375 29 156 5232
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2
            className="text-4xl font-bold text-zinc-900 text-center mb-16 font-pusia-bold"
          >
            Отзывы наших клиентов
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Мария",
                review: "Заказывали встроенный шкаф в прихожую. Мастер идеально вписал его в нашу нишу неправильной формы, и теперь у нас в два раза больше места для хранения. Спасибо команде!",
                rating: 5
              },
              {
                name: "Дмитрий",
                review: "Делали гардеробную в спальне 3х2 метра. Система хранения продумана до мелочей - отдельные зоны для костюмов, белья, обуви. Даже антресоли используются максимально эффективно.",
                rating: 5
              },
              {
                name: "Анна",
                review: "Заказали кухонный гарнитур с нестандартными размерами под потолки 3.2м. Верхние шкафы сделали до самого верха, и кухня выглядит монолитно. Качество фасадов отличное!",
                rating: 5
              }
            ].map((review, index) => (
              <div
                key={review.name}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={`star-${review.name}-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-600 mb-4 italic font-pusia-bold">"{review.review}"</p>
                <p className="font-semibold text-zinc-900 font-pusia-bold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-zinc-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold mb-16 font-pusia-bold"
          >
            Свяжитесь с нами
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="flex flex-col items-center"
            >
              <Phone className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-pusia-bold">Телефон</h3>
              <p className="text-zinc-300 font-pusia-bold">+375291565232</p>
            </div>
            <div
              className="flex flex-col items-center"
            >
              <Mail className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-pusia-bold">Email</h3>
              <p className="text-zinc-300 font-pusia-bold">mebelkdomy.by@gmail.com</p>
            </div>
            <div
              className="flex flex-col items-center"
            >
              <MapPin className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-pusia-bold">Адрес</h3>
              <p className="text-zinc-300 font-pusia-bold">г.Минск, ул. Судмалиса, 13</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
