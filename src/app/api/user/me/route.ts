import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            listings: true,
            requests: true,
            favorites: true,
            notifications: {
              where: { isRead: false },
            },
          },
        },
      },
    })

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error('User me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

