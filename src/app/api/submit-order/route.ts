import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CartItem {
  product: {
    id: string
    name: string
    category: string
    price: { min: number; max: number }
  }
  selectedColor?: string
  quantity: number
  price: number
}

interface OrderData {
  phone: string
  name?: string
  address?: string
  comment?: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
  timestamp: string
}

interface FirestoreOrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface FirestoreOrder {
  id: string
  name: string
  phone: string
  email: string
  address: string
  status: string
  createdAt: string
  items: FirestoreOrderItem[]
  total: number
  notes: string
}

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  try {
    // Получаем переменные окружения
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing Telegram environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Парсим данные заказа
    const orderData: OrderData = await request.json()

    if (!orderData.phone || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Phone and items are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Формируем сообщение для Telegram
    const itemsList = orderData.items.map(item =>
      `📦 ${item.product.name}\\n` +
      `   Категория: ${item.product.category}\\n` +
      `   ${item.selectedColor ? `Цвет: ${item.selectedColor}\\n   ` : ''}` +
      `Количество: ${item.quantity} шт.\\n` +
      `   Цена: ${item.price.toLocaleString()} BYN`
    ).join('\\n\\n')

    const message = `🛒 Новый заказ с сайта MAESTRO

👤 Клиент: ${orderData.name || 'Не указано'}
📞 Телефон: ${orderData.phone}
${orderData.address ? `📍 Адрес: ${orderData.address}` : ''}

📦 ТОВАРЫ:
${itemsList}

💰 ИТОГО: ${orderData.totalPrice.toLocaleString()} BYN
📊 Общее количество: ${orderData.totalItems} шт.

${orderData.comment ? `💬 Комментарий: ${orderData.comment}` : ''}

📅 Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}`

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text()
      console.error('Telegram API error:', errorData)
      throw new Error('Failed to send message to Telegram')
    }

    // Сохраняем заказ в Firestore
    const firestoreOrder: FirestoreOrder = {
      id: `ORDER_${Date.now()}`,
      name: orderData.name || 'Не указано',
      phone: orderData.phone,
      email: '', // Пустое поле, так как email не передается
      address: orderData.address || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      items: orderData.items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: orderData.totalPrice,
      notes: orderData.comment || ''
    }

    try {
      const docRef = await addDoc(collection(db, 'orders'), firestoreOrder)
      console.log('Order saved to Firestore with ID:', docRef.id)

      // Обновляем ID документа
      const finalOrder = { ...firestoreOrder, id: docRef.id }

      console.log('Order processed successfully:', orderData.phone)

      return NextResponse.json(
        {
          success: true,
          message: 'Заказ успешно отправлен!',
          orderId: docRef.id
        },
        { status: 200, headers: corsHeaders }
      )
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError)
      // Продолжаем выполнение, даже если Firestore недоступен
      return NextResponse.json(
        {
          success: true,
          message: 'Заказ отправлен в Telegram, но есть проблемы с базой данных.',
          orderId: `ORDER_${Date.now()}`
        },
        { status: 200, headers: corsHeaders }
      )
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Произошла ошибка при отправке заказа. Попробуйте позже.'
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}
