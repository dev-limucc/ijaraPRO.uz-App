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

    const listingId = params.id

    // Check if favorite exists
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        },
      },
    })

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId,
          },
        },
      })
      return NextResponse.json({ isFavorite: false })
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: user.id,
          listingId,
        },
      })
      return NextResponse.json({ isFavorite: true })
    }
  } catch (error) {
    console.error('Favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

