import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findNearbyListings } from '@/lib/postgis'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const city = searchParams.get('city')
  const latest = searchParams.get('latest') === 'true'

  try {
    const user = await getAuthenticatedUser(req)

    if (lat && lng) {
      const listings = await findNearbyListings(
        parseFloat(lat),
        parseFloat(lng)
      )

      // Get favorites for authenticated user
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
        isFavorite: favoriteIds.includes(listing.id),
      }))

      return NextResponse.json({ listings: listingsWithFavorites })
    }

    if (latest) {
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
    }

    const listings = await prisma.listing.findMany({
      where: {
        isActive: true,
        ...(city && { city }),
      },
      orderBy: { createdAt: 'desc' },
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
    console.error('Listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      price,
      currency,
      city,
      address,
      latitude,
      longitude,
      images,
    } = body

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      )
    }

    if (images && Array.isArray(images) && images.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        title,
        description,
        price: parseInt(price),
        currency: currency || 'USD',
        city,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images ? images : null,
      },
      include: {
        user: {
          select: { name: true, username: true },
        },
      },
    })

    // Check for matching requests and create notifications
    const matchingRequests = await prisma.request.findMany({
      where: {
        city: listing.city || undefined,
        watchers: {
          some: {},
        },
      },
      include: {
        watchers: true,
      },
    })

    for (const request of matchingRequests) {
      // Check if price range matches (within 20% of budget)
      const priceDiff = Math.abs(listing.price - request.budget) / request.budget
      if (priceDiff <= 0.2) {
        // Create notifications for watchers
        await prisma.notification.createMany({
          data: request.watchers.map((watcher) => ({
            userId: watcher.userId,
            title: 'New listing matches your request',
            body: `A new listing "${listing.title}" matches your request in ${listing.city}`,
          })),
        })
      }
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

