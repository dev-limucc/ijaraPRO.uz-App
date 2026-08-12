import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listings = await prisma.listing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, username: true },
        },
        favorites: {
          select: { userId: true },
        },
      },
    })

    const listingsWithFavorites = listings.map((listing) => ({
      ...listing,
      images: listing.images ? (listing.images as any) : null,
      isFavorite: listing.favorites.some((f) => f.userId === user.id),
    }))

    return NextResponse.json({ listings: listingsWithFavorites })
  } catch (error) {
    console.error('My listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

