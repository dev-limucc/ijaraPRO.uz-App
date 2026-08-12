import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)

    // First get all requests with counts
    const requests = await prisma.request.findMany({
      include: {
        _count: {
          select: { likes: true, watchers: true },
        },
        user: {
          select: { name: true, username: true },
        },
        likes: user
          ? {
              where: { userId: user.id },
              select: { id: true },
            }
          : false,
        watchers: user
          ? {
              where: { userId: user.id },
              select: { id: true },
            }
          : false,
      },
    })

    // Sort by likes count (desc), then by date (desc)
    requests.sort((a, b) => {
      const likesDiff = (b._count.likes || 0) - (a._count.likes || 0)
      if (likesDiff !== 0) return likesDiff
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    const requestsWithStatus = requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      budget: request.budget,
      currency: request.currency,
      city: request.city,
      location: request.location,
      propertyType: request.propertyType,
      note: request.note,
      createdAt: request.createdAt,
      _count: request._count,
      user: request.user,
      isLiked: user ? request.likes.length > 0 : false,
      isWatched: user ? request.watchers.length > 0 : false,
    }))

    return NextResponse.json({ requests: requestsWithStatus })
  } catch (error) {
    console.error('Requests error:', error)
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
    const { budget, currency, city, location, propertyType, note } = body

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget is required' },
        { status: 400 }
      )
    }

    const request = await prisma.request.create({
      data: {
        userId: user.id,
        budget: parseInt(budget),
        currency: currency || 'USD',
        city,
        location,
        propertyType,
        note,
      },
      include: {
        _count: {
          select: { likes: true, watchers: true },
        },
        user: {
          select: { name: true, username: true },
        },
      },
    })

    return NextResponse.json({ request })
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

