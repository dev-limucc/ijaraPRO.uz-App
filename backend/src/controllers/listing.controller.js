// src/controllers/listing.controller.js

import { listingService } from "../services/listing.service.js";

// CONTROLLER = MIDDLE MAN
// gets data from request → sends it to service → returns answer to user

export const listingController = {  
  // GET /listings
  async getAll(req, res) {
    try {
      // read userId from query: /listings?userId=1
      const userId = req.query.userId ? Number(req.query.userId) : null;

      const listings = await listingService.getAll(userId);
      return res.json(listings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch listings" });
    }
  },

  // GET /listings/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);

      // read userId: /listings/5?userId=1
      const userId = req.query.userId ? Number(req.query.userId) : null;

      const listing = await listingService.getById(id, userId);

      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      return res.json(listing);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch listing" });
    }
  },

  // POST /listings
  async create(req, res) {
    try {
      const data = req.body;

      // small validation example
      if (!data.name || !data.price || !data.currency) {
        return res.status(400).json({
          error: "Name, price and currency are required",
        });
      }

      const listing = await listingService.create(data);
      return res.status(201).json(listing);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create listing" });
    }
  },
};
