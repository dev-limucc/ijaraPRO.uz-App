// src/services/listingLike.service.js

import { prisma } from "../../prisma/client.js";

export const listingLikeService = {
  // 👍 like a listing
  async like(userId, listingId) {
    // upsert = "create if not exist, otherwise keep it"
    return prisma.listingLike.upsert({
      where: {
        userId_listingId: { userId, listingId },
      },
      create: {
        userId,
        listingId,
      },
      update: {}, // nothing to update, just keep it
    });
  },

  // 👎 unlike a listing
  async unlike(userId, listingId) {
    return prisma.listingLike.delete({
      where: {
        userId_listingId: { userId, listingId },
      },
    });
  },

  // 🧍 all likes for listing (who liked this listing)
  async getListingLikes(listingId) {
    return prisma.listingLike.findMany({
      where: { listingId },
      include: {
        user: true, // so we see the users
      },
    });
  },

  // ⭐ (optional) all liked listings for a user
  async getUserLikes(userId) {
    return prisma.listingLike.findMany({
      where: { userId },
      include: {
        listing: true,
      },
    });
  },
  // return just the listings, not the like rows
  async getUserLikedListings(userId) {
    const likes = await prisma.listingLike.findMany({
      where: { userId },
      include: { listing: true },
    });

    // map to only the listing object
    return likes.map((like) => like.listing);
  },
};
