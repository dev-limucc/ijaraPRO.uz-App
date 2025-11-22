// src/controllers/listingLike.controller.js

import { listingLikeService } from "../services/listingLike.service.js";

export const listingLikeController = {
  // POST /listings/:id/like
  async like(req, res) {
    try {
      const listingId = Number(req.params.id);
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const like = await listingLikeService.like(userId, listingId);
      return res.status(201).json(like);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to like listing" });
    }
  },

  // DELETE /listings/:id/like
  async unlike(req, res) {
    try {
      const listingId = Number(req.params.id);
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      await listingLikeService.unlike(userId, listingId);
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to unlike listing" });
    }
  },

  // GET /listings/:id/likes
  async getListingLikes(req, res) {
    try {
      const listingId = Number(req.params.id);
      const likes = await listingLikeService.getListingLikes(listingId);
      return res.json(likes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch listing likes" });
    }
  },

  // (optional) GET /users/:id/likes
  async getUserLikes(req, res) {
    try {
      const userId = Number(req.params.id);
      const likes = await listingLikeService.getUserLikes(userId);
      return res.json(likes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch user likes" });
    }
  },
  // GET /users/:id/likes  -> "saved listings" for this user
  async getUserLikedListings(req, res) {
    try {
      const userId = Number(req.params.id);
      const listings = await listingLikeService.getUserLikedListings(userId);
      return res.json(listings);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch liked listings" });
    }
  },
};
