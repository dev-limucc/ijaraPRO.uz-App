import crypto from 'crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export interface TelegramUser {
  id: number
  first_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

export function verifyTelegramWebAppData(initData: string): TelegramUser | null {
  try {
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not set')
      return null
    }

    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    if (!hash) return null

    urlParams.delete('hash')

    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest()

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) {
      return null
    }

    const userStr = urlParams.get('user')
    if (!userStr) return null

    return JSON.parse(userStr)
  } catch (error) {
    console.error('Telegram verification error:', error)
    return null
  }
}

export function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  
  try {
    const user = JSON.parse(authHeader)
    return user.telegramId || null
  } catch {
    return null
  }
}

