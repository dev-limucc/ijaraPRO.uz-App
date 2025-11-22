// src/routes/listing.routes.js

import { Router } from "express";
import { listingController } from "../controllers/listing.controller.js";

const router = Router();

// GET /listings
router.get("/", listingController.getAll);

// GET /listings/:id
router.get("/:id", listingController.getById);

// POST /listings
router.post("/", listingController.create);

export default router;
