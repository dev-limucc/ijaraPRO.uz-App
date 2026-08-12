import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestId = params.id

    // Check if watch exists
    const existing = await prisma.requestWatch.findUnique({
      where: {
        userId_requestId: {
          userId: user.id,
          requestId,
        },
      },
    })

    if (existing) {
      // Remove watch
      await prisma.requestWatch.delete({
        where: {
          userId_requestId: {
            userId: user.id,
            requestId,
          },
        },
      })
      return NextResponse.json({ isWatched: false })
    } else {
      // Add watch
      await prisma.requestWatch.create({
        data: {
          userId: user.id,
          requestId,
        },
      })
      return NextResponse.json({ isWatched: true })
    }
  } catch (error) {
    console.error('Request watch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

