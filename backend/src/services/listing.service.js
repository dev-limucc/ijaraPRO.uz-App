import { prisma } from "../../prisma/client.js";

export const listingService = {
  // GET /listings
  async getAll(userId) {
    // 1) Get all listings + owner + like count
    const listings = await prisma.listing.findMany({
      include: {
        owner: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    // 2) Prepare list of "liked listing IDs" for this user
    let likedIds = new Set();

    if (userId) {
      const likes = await prisma.listingLike.findMany({
        where: { userId },
        select: { listingId: true },
      });

      likedIds = new Set(likes.map((l) => l.listingId));
    }

    // 3) Add likesCount + isLikedByUser to each listing
    return listings.map((l) => ({
      ...l,
      likesCount: l._count.likes,
      isLikedByUser: userId ? likedIds.has(l.id) : false,
    }));
  },

  // GET /listings/:id
  async getById(id, userId) {
    // 1) Get the listing + like count
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!listing) return null;

    // 2) Check if THIS user liked THIS listing
    let isLikedByUser = false;

    if (userId) {
      const like = await prisma.listingLike.findUnique({
        where: {
          userId_listingId: {
            userId,
            listingId: id,
          },
        },
      });

      isLikedByUser = !!like;
    }

    // 3) Return listing with computed fields
    return {
      ...listing,
      likesCount: listing._count.likes,
      isLikedByUser,
    };
  },

  // POST /listings
  async create(data) {
    return prisma.listing.create({
      data,
    });
  },
};
