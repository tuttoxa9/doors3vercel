'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Назад</span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 font-pusia-bold">Доставка</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6 font-pusia-bold">ДОСТАВКА ПО РБ</h2>
            <p className="text-lg text-zinc-600 font-pusia-regular">
              Мы сотрудничаем с надежными службами доставки для быстрой и безопасной доставки вашего заказа
            </p>
          </div>

          {/* Delivery services grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">

            {/* Service 1 - До подъезда */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-zinc-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M10 30h15v40H10zM30 20h40v50H30zM75 30h15v40H75z"/>
                    <circle cx="20" cy="75" r="8"/>
                    <circle cx="50" cy="75" r="8"/>
                    <circle cx="80" cy="75" r="8"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2 font-pusia-bold">ДОСТАВКА ДО ПОДЪЕЗДА</h3>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-zinc-800 font-pusia-bold">ГРАФИК ОТПРАВКИ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПОНЕДЕЛЬНИК</span>
                    <span className="font-semibold">21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВТОРНИК</span>
                    <span className="font-semibold">21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СРЕДА</span>
                    <span className="font-semibold">21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ЧЕТВЕРГ</span>
                    <span className="font-semibold">21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПЯТНИЦА</span>
                    <span className="font-semibold">21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СУББОТА</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВОСКРЕСЕНЬЕ</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-4">ПОДХОДИТ ДЛЯ ВСЕХ ИЗДЕЛИЙ</p>
                <div className="bg-zinc-900 text-white py-3 px-6 rounded-lg">
                  <span className="text-lg font-bold">ДОСТАВКА 14-202 РУБЛЕЙ</span>
                </div>
                <button className="w-full mt-4 bg-zinc-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                  Оформить заказ
                </button>
              </div>
            </div>

            {/* Service 2 - Европочта */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-zinc-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <img src="/uploads/европочта.png" alt="Европочта" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-sm text-zinc-600 mb-2">ДОСТАВЯТ ЗА 1-4 ДНЯ</p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-zinc-800 font-pusia-bold">ГРАФИК ОТПРАВКИ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПОНЕДЕЛЬНИК</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВТОРНИК</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СРЕДА</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ЧЕТВЕРГ</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПЯТНИЦА</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СУББОТА</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВОСКРЕСЕНЬЕ</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-4">ПОДХОДИТ ДЛЯ МАЛОГАБАРИТНЫХ ИЗДЕЛИЙ</p>
                <div className="bg-zinc-900 text-white py-3 px-6 rounded-lg">
                  <span className="text-lg font-bold">ДОСТАВКА 4-20 РУБЛЕЙ</span>
                </div>
                <button className="w-full mt-4 bg-zinc-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                  Рассчитать стоимость доставки
                </button>
              </div>
            </div>

            {/* Service 3 - Белпочта */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-zinc-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <img src="/uploads/белпочта.png" alt="Белпочта" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-sm text-zinc-600 mb-2">ДОСТАВЯТ ЗА 1-5 ДНЕЙ</p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-zinc-800 font-pusia-bold">ГРАФИК ОТПРАВКИ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПОНЕДЕЛЬНИК</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВТОРНИК</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СРЕДА</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ЧЕТВЕРГ</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ПЯТНИЦА</span>
                    <span className="font-semibold">17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">СУББОТА</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ВОСКРЕСЕНЬЕ</span>
                    <span className="text-red-600 font-semibold">НЕ ОТПРАВЛЯЕМ</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-4">ПОДХОДИТ ДЛЯ МАЛОГАБАРИТНЫХ ИЗДЕЛИЙ</p>
                <div className="bg-zinc-900 text-white py-3 px-6 rounded-lg">
                  <span className="text-lg font-bold">ДОСТАВКА ОТ 14Р</span>
                </div>
                <button className="w-full mt-4 bg-zinc-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                  Рассчитать стоимость доставки
                </button>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="bg-zinc-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-zinc-900 mb-4 font-pusia-bold">Дополнительная информация</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-zinc-800 mb-2">Упаковка</h4>
                <p className="text-zinc-600 text-sm">Все товары надежно упаковываются для безопасной транспортировки</p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-800 mb-2">Отслеживание</h4>
                <p className="text-zinc-600 text-sm">Возможность отследить статус доставки через службы доставки</p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-800 mb-2">Поддержка</h4>
                <p className="text-zinc-600 text-sm">Наша команда поможет выбрать оптимальный способ доставки</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
