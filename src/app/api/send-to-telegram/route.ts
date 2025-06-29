import { type NextRequest, NextResponse } from 'next/server'

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

interface FormData {
  name: string
  phone: string
  comment?: string
  cartItems?: CartItem[]
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
      console.error('Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Парсим данные формы
    const formData: FormData = await request.json()

    if (!formData.name || !formData.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Формируем сообщение для Telegram
    let message = `🏠 Новая заявка с сайта MAESTRO

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
${formData.comment ? `💬 Комментарий: ${formData.comment}` : ''}`

    // Добавляем информацию о товарах из корзины, если они есть
    if (formData.cartItems && formData.cartItems.length > 0) {
      const itemsList = formData.cartItems.map(item =>
        `📦 ${item.product.name}\\n` +
        `   Категория: ${item.product.category}\\n` +
        `   ${item.selectedColor ? `Цвет: ${item.selectedColor}\\n   ` : ''}` +
        `Количество: ${item.quantity} шт.\\n` +
        `   Цена: ${item.price.toLocaleString()} BYN`
      ).join('\\n\\n')

      const totalPrice = formData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalItems = formData.cartItems.reduce((sum, item) => sum + item.quantity, 0)

      message += `

🛒 ТОВАРЫ В КОРЗИНЕ:
${itemsList}

💰 ИТОГО ПО КОРЗИНЕ: ${totalPrice.toLocaleString()} BYN
📊 Общее количество: ${totalItems} шт.`
    }

    message += `

📅 Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}`

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const response = await fetch(telegramUrl, {
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

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Telegram API error:', errorData)
      throw new Error('Failed to send message to Telegram')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Заявка успешно отправлена!'
      },
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Произошла ошибка при отправке заявки. Попробуйте позже.'
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
