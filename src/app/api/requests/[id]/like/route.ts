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

    // Check if like exists
    const existing = await prisma.requestLike.findUnique({
      where: {
        userId_requestId: {
          userId: user.id,
          requestId,
        },
      },
    })

    if (existing) {
      // Remove like
      await prisma.requestLike.delete({
        where: {
          userId_requestId: {
            userId: user.id,
            requestId,
          },
        },
      })
      return NextResponse.json({ isLiked: false })
    } else {
      // Add like
      await prisma.requestLike.create({
        data: {
          userId: user.id,
          requestId,
        },
      })
      return NextResponse.json({ isLiked: true })
    }
  } catch (error) {
    console.error('Request like error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

