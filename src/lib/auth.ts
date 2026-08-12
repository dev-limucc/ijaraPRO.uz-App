import { NextRequest } from 'next/server'
import { verifyTelegramWebAppData } from './telegram'
import { prisma } from './prisma'

export async function getAuthenticatedUser(req: NextRequest): Promise<{
  id: string
  telegramId: string
} | null> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return null

    // Parse the initData from authorization header
    const { initData } = JSON.parse(authHeader)
    if (!initData) return null

    const userData = verifyTelegramWebAppData(initData)
    if (!userData) return null

    const user = await prisma.user.findUnique({
      where: { telegramId: String(userData.id) },
    })

    if (!user) return null

    return {
      id: user.id,
      telegramId: user.telegramId,
    }
  } catch {
    return null
  }
}

