'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Home, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-zinc-200/50 backdrop-blur-sm"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 font-pusia-bold">
            Спасибо за заявку!
          </h1>

          <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
            Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время для обсуждения деталей вашего заказа.
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100"
            >
              <Phone className="w-8 h-8 text-zinc-700 mb-3 mx-auto" />
              <h3 className="font-semibold text-zinc-900 mb-2">Быстрый ответ</h3>
              <p className="text-sm text-zinc-600">Ответим в течение 30 минут в рабочее время</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100"
            >
              <MessageCircle className="w-8 h-8 text-zinc-700 mb-3 mx-auto" />
              <h3 className="font-semibold text-zinc-900 mb-2">Консультация</h3>
              <p className="text-sm text-zinc-600">Бесплатная консультация по всем вопросам</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100"
            >
              <CheckCircle className="w-8 h-8 text-zinc-700 mb-3 mx-auto" />
              <h3 className="font-semibold text-zinc-900 mb-2">Качество</h3>
              <p className="text-sm text-zinc-600">Гарантия качества на все изделия</p>
            </motion.div>
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white mb-8"
          >
            <h3 className="text-lg font-semibold mb-3">Что дальше?</h3>
            <div className="space-y-2 text-sm text-zinc-200">
              <p>• Наш менеджер свяжется с вами для уточнения деталей</p>
              <p>• Обсудим ваши пожелания и создадим 3D-визуализацию</p>
              <p>• Согласуем окончательный дизайн и стоимость</p>
              <p>• Приступим к изготовлению вашей мебели</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span>Вернуться на главную</span>
            </Link>

            <Link
              href="/catalog"
              className="inline-flex items-center justify-center space-x-2 bg-white text-zinc-900 px-8 py-4 rounded-full font-medium border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Посмотреть каталог</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8 bg-gradient-to-r from-zinc-50 to-white rounded-2xl p-6 border border-zinc-200"
        >
          <h3 className="text-lg font-semibold text-zinc-900 mb-4 text-center">Свяжитесь с нами прямо сейчас</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="tel:+375291234567"
              className="flex items-center justify-center space-x-3 bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 group"
            >
              <Phone className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-zinc-500">Телефон</div>
                <div className="font-semibold text-zinc-900">+375 (29) 123-45-67</div>
              </div>
            </a>

            <a
              href="https://t.me/maestro_mebel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 group"
            >
              <MessageCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-zinc-500">Telegram</div>
                <div className="font-semibold text-zinc-900">@maestro_mebel</div>
              </div>
            </a>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-zinc-600">
              Рабочие часы: Пн-Пт 9:00-18:00, Сб 10:00-16:00
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
