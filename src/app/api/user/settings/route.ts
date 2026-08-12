import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { preferredLang, preferredCurrency } = await req.json()

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(preferredLang && { preferredLang }),
        ...(preferredCurrency && { preferredCurrency }),
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

