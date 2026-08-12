import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)

    const listings = await prisma.listing.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { name: true, username: true },
        },
      },
    })

    let favoriteIds: string[] = []
    if (user) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { listingId: true },
      })
      favoriteIds = favorites.map((f) => f.listingId)
    }

    const listingsWithFavorites = listings.map((listing) => ({
      ...listing,
      images: listing.images ? (listing.images as any) : null,
      isFavorite: favoriteIds.includes(listing.id),
    }))

    return NextResponse.json({ listings: listingsWithFavorites })
  } catch (error) {
    console.error('Latest listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

