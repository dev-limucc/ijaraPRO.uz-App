import { NextRequest, NextResponse } from 'next/server'
import { verifyTelegramWebAppData } from '@/lib/telegram'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json()
    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 })
    }

    const userData = verifyTelegramWebAppData(initData)
    if (!userData) {
      return NextResponse.json({ error: 'Invalid auth' }, { status: 401 })
    }

    const user = await prisma.user.upsert({
      where: { telegramId: String(userData.id) },
      update: {
        name: userData.first_name || undefined,
        username: userData.username || undefined,
        preferredLang: userData.language_code?.split('-')[0] || 'uz',
      },
      create: {
        telegramId: String(userData.id),
        name: userData.first_name || undefined,
        username: userData.username || undefined,
        preferredLang: userData.language_code?.split('-')[0] || 'uz',
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

