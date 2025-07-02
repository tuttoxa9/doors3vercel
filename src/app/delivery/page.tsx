'use client'

import Link from 'next/link'
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, Phone } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Назад</span>
            </Link>
            <div className="w-px h-6 bg-zinc-300"></div>
            <h1 className="text-2xl font-bold text-zinc-900 font-pusia-bold">Доставка по Беларуси</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-2xl mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 font-pusia-bold">
              Быстрая и надёжная доставка
            </h2>
            <p className="text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Работаем с проверенными службами доставки для безопасной транспортировки вашей мебели по всей Беларуси
            </p>
          </div>
        </div>
      </section>



      {/* Delivery Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12 font-pusia-bold">
              Способы доставки
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Service 1 - Собственная доставка */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-zinc-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Рекомендуем
                  </span>
                </div>

                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-pusia-bold">До подъезда</h3>
                  <p className="text-zinc-300 text-sm">Наша собственная служба доставки</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-zinc-300">Стоимость</span>
                    <span className="font-bold text-lg">14-202 руб</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-zinc-300">Подходит для</span>
                    <span className="font-semibold">Всех изделий</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-zinc-300">График отправки</h4>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-zinc-300 text-sm">ПН — ПТ</span>
                      <span className="text-white font-semibold">21:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300 text-sm">СБ, ВС</span>
                      <span className="text-red-400 font-semibold">Не отправляем</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service 2 - Европочта */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-colors">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <img src="/uploads/европочта.png" alt="Европочта" className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2 font-pusia-bold">Европочта</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                      1-4 дня
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Стоимость</span>
                    <span className="font-bold text-lg text-zinc-900">4-20 руб</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Подходит для</span>
                    <span className="font-semibold text-zinc-900">Малогабаритных</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-zinc-600">График отправки</h4>
                  <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-zinc-600 text-sm">ПН — ПТ</span>
                      <span className="text-zinc-900 font-semibold">17:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-sm">СБ, ВС</span>
                      <span className="text-red-500 font-semibold">Не отправляем</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service 3 - Белпочта */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-colors">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <img src="/uploads/белпочта.png" alt="Белпочта" className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2 font-pusia-bold">Белпочта</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                      1-5 дней
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Стоимость</span>
                    <span className="font-bold text-lg text-zinc-900">от 14 руб</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Подходит для</span>
                    <span className="font-semibold text-zinc-900">Малогабаритных</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-zinc-600">График отправки</h4>
                  <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-zinc-600 text-sm">ПН — ПТ</span>
                      <span className="text-zinc-900 font-semibold">17:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-sm">СБ, ВС</span>
                      <span className="text-red-500 font-semibold">Не отправляем</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12 font-pusia-bold">
              Важная информация
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-zinc-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900">Упаковка и защита</h3>
                </div>
                <ul className="space-y-3 text-zinc-600">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Профессиональная упаковка каждого изделия</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Защитные материалы для безопасной транспортировки</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Страхование груза при необходимости</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-zinc-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900">Гарантии и поддержка</h3>
                </div>
                <ul className="space-y-3 text-zinc-600">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Отслеживание статуса доставки</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Поддержка на всех этапах доставки</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0"></div>
                    <span>Возможность изменения адреса доставки</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4 font-pusia-bold">
              Остались вопросы о доставке?
            </h2>
            <p className="text-lg text-zinc-600 mb-8">
              Свяжитесь с нами, и мы поможем выбрать оптимальный способ доставки для вашего заказа
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+375291565232"
                className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl hover:bg-zinc-800 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                +375 29 156 52 32
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-200 text-zinc-700 font-semibold rounded-2xl hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                Перейти к каталогу
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
